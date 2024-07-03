import { getMetadata, hasMetadata } from "@abraham/reflection";
import {
	ON_DEACTIVATION_ERROR,
	POST_CONSTRUCT_ERROR,
	PRE_DESTROY_ERROR,
} from "../constants/error_msgs";
import { BindingScopeEnum, TargetTypeEnum } from "../constants/literal_types";
import { POST_CONSTRUCT, PRE_DESTROY } from "../constants/metadata_keys";
import type {
	Binding,
	Newable,
	Request,
	ResolveRequestHandler,
} from "../interfaces/interfaces";
import type { Metadata } from "../planning/metadata";
import { isPromise, isPromiseOrContainsPromise } from "../utils";

interface InstanceCreationInstruction {
	constructorInjections: unknown[];
	propertyInjections: unknown[];
	propertyRequests: Request[];
}

interface ResolvedRequests extends InstanceCreationInstruction {
	isAsync: boolean;
}

interface CreateInstanceWithInjectionArg<T>
	extends InstanceCreationInstruction {
	constr: Newable<T>;
}

function _resolveRequests(
	childRequests: Request[],
	resolveRequest: ResolveRequestHandler,
): ResolvedRequests {
	return childRequests.reduce<ResolvedRequests>(
		(resolvedRequests, childRequest) => {
			const injection = resolveRequest(childRequest);
			const targetType = childRequest.target.type;
			if (targetType === TargetTypeEnum.ConstructorArgument) {
				resolvedRequests.constructorInjections.push(injection);
			} else {
				resolvedRequests.propertyRequests.push(childRequest);
				resolvedRequests.propertyInjections.push(injection);
			}
			if (!resolvedRequests.isAsync) {
				resolvedRequests.isAsync = isPromiseOrContainsPromise(injection);
			}
			return resolvedRequests;
		},
		{
			constructorInjections: [],
			propertyInjections: [],
			propertyRequests: [],
			isAsync: false,
		},
	);
}

function _createInstance<T>(
	constr: Newable<T>,
	childRequests: Request[],
	resolveRequest: ResolveRequestHandler,
): T | Promise<T> {
	let result: T | Promise<T>;

	if (childRequests.length > 0) {
		const resolved = _resolveRequests(childRequests, resolveRequest);
		const createInstanceWithInjectionsArg: CreateInstanceWithInjectionArg<T> = {
			...resolved,
			constr,
		};
		if (resolved.isAsync) {
			result = createInstanceWithInjectionsAsync(
				createInstanceWithInjectionsArg,
			);
		} else {
			result = createInstanceWithInjections(createInstanceWithInjectionsArg);
		}
	} else {
		result = new constr();
	}

	return result;
}

function createInstanceWithInjections<T>(
	args: CreateInstanceWithInjectionArg<T>,
): T {
	// @ts-ignore
	const instance = new args.constr(...(args.constructorInjections as never[]));
	args.propertyRequests.forEach((r: Request, index: number) => {
		const property = r.target.identifier;
		const injection = args.propertyInjections[index];
		if (!r.target.isOptional() || injection !== undefined) {
			(instance as Record<string | symbol, unknown>)[property] = injection;
		}
	});
	return instance;
}

async function createInstanceWithInjectionsAsync<T>(
	args: CreateInstanceWithInjectionArg<T>,
): Promise<T> {
	const constructorInjections = await possiblyWaitInjections(
		args.constructorInjections,
	);
	const propertyInjections = await possiblyWaitInjections(
		args.propertyInjections,
	);
	return createInstanceWithInjections<T>({
		...args,
		constructorInjections,
		propertyInjections,
	});
}

async function possiblyWaitInjections(possiblePromiseinjections: unknown[]) {
	const injections: unknown[] = [];
	for (const injection of possiblePromiseinjections) {
		if (Array.isArray(injection)) {
			injections.push(Promise.all(injection));
		} else {
			injections.push(injection);
		}
	}
	return Promise.all(injections);
}

function _getInstanceAfterPostConstruct<T>(
	constr: Newable<T>,
	result: T,
): T | Promise<T> {
	const postConstructResult = _postConstruct(constr, result);

	if (isPromise(postConstructResult)) {
		return postConstructResult.then(() => result);
	}
	return result;
}

function _postConstruct<T>(
	constr: Newable<T>,
	instance: T,
): void | Promise<void> {
	if (hasMetadata(POST_CONSTRUCT, constr)) {
		// @ts-ignore
		const data: Metadata = getMetadata(POST_CONSTRUCT, constr);
		try {
			return (instance as T & Record<string, () => void>)[
				data.value as string
			]?.();
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} catch (e: any) {
			throw new Error(POST_CONSTRUCT_ERROR(constr.name, e.message));
		}
	}
}

function _validateInstanceResolution<T = unknown>(
	binding: Binding<T>,
	constr: Newable<T>,
): void {
	if (binding.scope !== BindingScopeEnum.Singleton) {
		_throwIfHandlingDeactivation(binding, constr);
	}
}

function _throwIfHandlingDeactivation<T = unknown>(
	binding: Binding<T>,
	constr: Newable<T>,
): void {
	const scopeErrorMessage = `Class cannot be instantiated in ${
		binding.scope === BindingScopeEnum.Request ? "request" : "transient"
	} scope.`;
	if (typeof binding.onDeactivation === "function") {
		throw new Error(ON_DEACTIVATION_ERROR(constr.name, scopeErrorMessage));
	}

	if (hasMetadata(PRE_DESTROY, constr)) {
		throw new Error(PRE_DESTROY_ERROR(constr.name, scopeErrorMessage));
	}
}

export function resolveInstance<T>(
	binding: Binding<T>,
	constr: Newable<T>,
	childRequests: Request[],
	resolveRequest: ResolveRequestHandler,
): T | Promise<T> {
	_validateInstanceResolution(binding, constr);

	const result = _createInstance(constr, childRequests, resolveRequest);

	if (isPromise(result)) {
		return result.then((resolvedResult) =>
			_getInstanceAfterPostConstruct(constr, resolvedResult),
		);
	}
	return _getInstanceAfterPostConstruct(constr, result);
}
