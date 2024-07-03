import { BindingCount } from "../bindings/binding_count";
import {
	AMBIGUOUS_MATCH,
	ARGUMENTS_LENGTH_MISMATCH,
	NOT_REGISTERED,
} from "../constants/error_msgs";
import { BindingTypeEnum, TargetTypeEnum } from "../constants/literal_types";
import { INJECT_TAG, MULTI_INJECT_TAG } from "../constants/metadata_keys";
import type {
	Binding,
	ContainerInterface,
	Context as IContext,
	Request as IRequest,
	Target as ITarget,
	Lookup,
	MetadataReaderInterface,
	ServiceIdentifier,
	TargetType,
} from "../interfaces";
import { isStackOverflowExeption } from "../utils/exceptions";
import {
	circularDependencyToException,
	getServiceIdentifierAsString,
	listMetadataForTarget,
	listRegisteredBindingsForServiceIdentifier,
} from "../utils/serialization";
import { Context } from "./context";
import { Metadata } from "./metadata";
import { Plan } from "./plan";
import {
	getBaseClassDependencyCount,
	getDependencies,
	getFunctionName,
} from "./reflection_utils";
import { Request } from "./request";
import { Target } from "./target";

export function getBindingDictionary(
	container: ContainerInterface,
): Lookup<Binding<unknown>> {
	return (
		container as unknown as { _bindingDictionary: Lookup<Binding<unknown>> }
	)._bindingDictionary;
}

function _createTarget(
	isMultiInject: boolean,
	targetType: TargetType,
	serviceIdentifier: ServiceIdentifier,
	name: string,
	key?: string | number | symbol,
	value?: unknown,
): ITarget {
	const metadataKey = isMultiInject ? MULTI_INJECT_TAG : INJECT_TAG;
	const injectMetadata = new Metadata(metadataKey, serviceIdentifier);
	const target = new Target(
		targetType,
		name,
		serviceIdentifier,
		injectMetadata,
	);

	if (key !== undefined) {
		const tagMetadata = new Metadata(key, value);
		target.metadata.push(tagMetadata);
	}

	return target;
}

function _getActiveBindings(
	metadataReader: MetadataReaderInterface,
	avoidConstraints: boolean,
	context: IContext,
	parentRequest: IRequest | null,
	target: ITarget,
): Binding<unknown>[] {
	let bindings = getBindings(context.container, target.serviceIdentifier);
	let activeBindings: Binding<unknown>[] = [];

	// automatic binding
	if (
		bindings.length === BindingCount.NoBindingsAvailable &&
		context.container.options.autoBindInjectable &&
		typeof target.serviceIdentifier === "function" &&
		metadataReader.getConstructorMetadata(target.serviceIdentifier)
			.compilerGeneratedMetadata
	) {
		context.container.bind(target.serviceIdentifier).toSelf();
		bindings = getBindings(context.container, target.serviceIdentifier);
	}

	// multiple bindings available
	if (!avoidConstraints) {
		// apply constraints if available to reduce the number of active bindings
		activeBindings = bindings.filter((binding) => {
			const request = new Request(
				binding.serviceIdentifier,
				context,
				parentRequest,
				binding,
				target,
			);

			return binding.constraint(request);
		});
	} else {
		// simple injection or multi-injection without constraints
		activeBindings = bindings;
	}

	// validate active bindings
	_validateActiveBindingCount(
		target.serviceIdentifier,
		activeBindings,
		target,
		context.container,
	);

	return activeBindings;
}

function _validateActiveBindingCount(
	serviceIdentifier: ServiceIdentifier,
	bindings: Binding<unknown>[],
	target: ITarget,
	container: ContainerInterface,
): Binding<unknown>[] {
	switch (bindings.length) {
		case BindingCount.NoBindingsAvailable: {
			if (target.isOptional()) {
				return bindings;
			}
			const serviceIdentifierString =
				getServiceIdentifierAsString(serviceIdentifier);
			let msg = NOT_REGISTERED;
			msg += listMetadataForTarget(serviceIdentifierString, target);
			msg += listRegisteredBindingsForServiceIdentifier(
				container,
				serviceIdentifierString,
				getBindings,
			);
			throw new Error(msg);
		}

		// @ts-ignore
		case BindingCount.OnlyOneBindingAvailable:
			return bindings;

		// eslint-disable no-fallthrough
		// case BindingCount.MultipleBindingsAvailable:
		default:
			if (!target.isArray()) {
				const serviceIdentifierString =
					getServiceIdentifierAsString(serviceIdentifier);
				let msg = `${AMBIGUOUS_MATCH} ${serviceIdentifierString}`;
				msg += listRegisteredBindingsForServiceIdentifier(
					container,
					serviceIdentifierString,
					getBindings,
				);
				throw new Error(msg);
			}
			return bindings;
	}
}

function _createSubRequests(
	metadataReader: MetadataReaderInterface,
	avoidConstraints: boolean,
	serviceIdentifier: ServiceIdentifier,
	context: Context,
	parentRequest: Request | null,
	target: ITarget,
) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	let activeBindings: Binding<any>[];
	let childRequest: Request;

	if (parentRequest === null) {
		activeBindings = _getActiveBindings(
			metadataReader,
			avoidConstraints,
			context,
			null,
			target,
		);

		childRequest = new Request(
			serviceIdentifier,
			context,
			null,
			activeBindings,
			target,
		);

		const thePlan = new Plan(context, childRequest);
		context.addPlan(thePlan);
	} else {
		activeBindings = _getActiveBindings(
			metadataReader,
			avoidConstraints,
			context,
			parentRequest,
			target,
		);
		// @ts-ignore
		childRequest = parentRequest.addChildRequest(
			target.serviceIdentifier,
			activeBindings,
			target,
		);
	}

	// biome-ignore lint/complexity/noForEach: <explanation>
	activeBindings.forEach((binding) => {
		let subChildRequest: Request | null = null;

		if (target.isArray()) {
			// @ts-ignore
			subChildRequest = childRequest.addChildRequest(
				binding.serviceIdentifier,
				binding,
				target,
			);
		} else {
			if (binding.cache) {
				return;
			}
			subChildRequest = childRequest;
		}

		if (
			binding.type === BindingTypeEnum.Instance &&
			binding.implementationType !== null
		) {
			const dependencies = getDependencies(
				metadataReader,
				binding.implementationType,
			);

			if (!context.container.options.skipBaseClassChecks) {
				// Throw if a derived class does not implement its constructor explicitly
				// We do this to prevent errors when a base class (parent) has dependencies
				// and one of the derived classes (children) has no dependencies
				const baseClassDependencyCount = getBaseClassDependencyCount(
					metadataReader,
					binding.implementationType,
				);

				if (dependencies.length < baseClassDependencyCount) {
					const error = ARGUMENTS_LENGTH_MISMATCH(
						getFunctionName(binding.implementationType),
					);
					throw new Error(error);
				}
			}

			// biome-ignore lint/complexity/noForEach: <explanation>
			dependencies.forEach((dependency: ITarget) => {
				_createSubRequests(
					metadataReader,
					false,
					dependency.serviceIdentifier,
					context,
					subChildRequest,
					dependency,
				);
			});
		}
	});
}

function getBindings<T>(
	container: ContainerInterface,
	serviceIdentifier: ServiceIdentifier<T>,
): Binding<T>[] {
	let bindings: Binding<T>[] = [];
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const bindingDictionary: Lookup<Binding<any>> =
		getBindingDictionary(container);

	if (bindingDictionary.hasKey(serviceIdentifier)) {
		bindings = bindingDictionary.get(serviceIdentifier);
	} else if (container.parent !== null) {
		// recursively try to get bindings from parent container
		bindings = getBindings<T>(container.parent, serviceIdentifier);
	}

	return bindings;
}

export function plan(
	metadataReader: MetadataReaderInterface,
	container: ContainerInterface,
	isMultiInject: boolean,
	targetType: TargetType,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	serviceIdentifier: ServiceIdentifier<any>,
	key?: string | number | symbol,
	value?: unknown,
	avoidConstraints = false,
): Context {
	const context = new Context(container);
	const target = _createTarget(
		isMultiInject,
		targetType,
		serviceIdentifier,
		"",
		key,
		value,
	);

	try {
		_createSubRequests(
			metadataReader,
			avoidConstraints,
			serviceIdentifier,
			context,
			null,
			target,
		);
		return context;
	} catch (error) {
		if (error instanceof Error && isStackOverflowExeption(error)) {
			if (context.plan) {
				circularDependencyToException(context.plan.rootRequest);
			}
		}
		throw error;
	}
}

export function createMockRequest(
	container: ContainerInterface,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	serviceIdentifier: ServiceIdentifier<any>,
	key: string | number | symbol,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	value: any,
): Request {
	const target = new Target(
		TargetTypeEnum.Variable,
		"",
		serviceIdentifier,
		new Metadata(key, value),
	);
	const context = new Context(container);
	const request = new Request(serviceIdentifier, context, null, [], target);
	return request;
}
