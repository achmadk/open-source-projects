import { inject as __inject, injectable as __injectable } from "inversify-esm";
import { getContainer } from "./container";
import { generateIdName, getOrSetIdFromCache, idsCache } from "./id.helper";
import type { Constructor, Id } from "./inversify.types";
import { log } from "./log.helper";
import {
	cleanParameter,
	getParametersFromConstructor,
} from "./parameters.helper";

export function injectable() {
	// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
	return (constructor: Constructor) => __injectable()(constructor);
}

export function inject(customId?: Id, debug = false) {
	return (
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		target: any,
		methodName: string,
		indexOrDescriptor?: number | PropertyDescriptor,
	) => {
		log(debug, "DI: Registering", target, indexOrDescriptor, customId);
		log(debug, "DI: idsCache", idsCache);

		if (
			typeof indexOrDescriptor === "number" &&
			isParameterDecorator(indexOrDescriptor)
		) {
			return injectParameterDecorator(
				target,
				methodName,
				indexOrDescriptor,
				customId,
				debug,
			);
		}

		return injectPropertyDecorator(
			target,
			methodName,
			indexOrDescriptor as PropertyDescriptor,
			customId,
			debug,
		);
	};
}

export const Inject = inject;

export function isParameterDecorator(index: number): boolean {
	return index !== undefined ? typeof index === "number" : false;
}

function injectParameterDecorator(
	target: Constructor,
	methodName: string,
	index: number,
	customId?: Id,
	debug = false,
): void {
	log(debug, "DI: is parameter decorator", target, index, customId);

	let id = customId;

	if (!id) {
		const parameters = getParametersFromConstructor(target);
		log(debug, parameters);
		const currentParameter = parameters[index];
		log(debug, currentParameter);
		const cacheIdNameFromParameter = cleanParameter(currentParameter);
		log(debug, cacheIdNameFromParameter);
		id = getOrSetIdFromCache(generateIdName(cacheIdNameFromParameter));
		log(debug, id);
	}

	// biome-ignore lint/correctness/noVoidTypeReturn: <explanation>
	return __inject(id)(target, methodName, index);
}

function injectPropertyDecorator(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	target: any,
	methodName: string,
	descriptor: PropertyDescriptor,
	customId?: Id,
	debug = false,
) {
	log(debug, "DI: is method/property decorator", methodName, target, customId);

	let id = customId as Id;

	if (!id) {
		const cacheIdNameFromParameter = cleanParameter(methodName);
		id = getOrSetIdFromCache(generateIdName(cacheIdNameFromParameter));
	}

	if (descriptor) {
		log(debug, "has descriptor", descriptor);
		descriptor.get = () => getContainer().get(id);
	}

	return __inject(id)(target, methodName);
}
