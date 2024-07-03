import {
	type MemberDecorator,
	defineMetadata,
	getMetadata,
	hasOwnMetadata,
	decorate as reflectionDecorate,
} from "@abraham/reflection";

import {
	DUPLICATED_METADATA,
	INVALID_DECORATOR_OPERATION,
} from "../constants/error_msgs";
import { TAGGED, TAGGED_PROP } from "../constants/metadata_keys";
import type { Metadata, MetadataOrMetadataArray } from "../interfaces";
import { getFirstArrayDuplicate } from "../utils";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
function targetIsConstructorFunction<T = Object>(
	target: DecoratorTarget<T>,
): target is ConstructorFunction<T> {
	return (target as ConstructorFunction<T>).prototype !== undefined;
}

type Prototype<T> = {
	[Property in keyof T]: T[Property] extends NewableFunction
		? T[Property]
		: T[Property] | undefined;
} & { constructor: NewableFunction };

interface ConstructorFunction<T = Record<string, unknown>> {
	new (...args: unknown[]): T;
	prototype: Prototype<T>;
}

export type DecoratorTarget<T = unknown> =
	| ConstructorFunction<T>
	| Prototype<T>;

function _throwIfMethodParameter(
	parameterName: string | symbol | undefined,
): void {
	if (parameterName !== undefined) {
		throw new Error(INVALID_DECORATOR_OPERATION);
	}
}

export function tagParameter(
	annotationTarget: DecoratorTarget,
	parameterName: string | symbol | undefined,
	parameterIndex: number,
	metadata: MetadataOrMetadataArray,
) {
	_throwIfMethodParameter(parameterName);
	_tagParameterOrProperty(
		TAGGED,
		annotationTarget as ConstructorFunction,
		parameterIndex.toString(),
		metadata,
	);
}

export function tagProperty(
	annotationTarget: DecoratorTarget,
	propertyName: string | symbol,
	metadata: MetadataOrMetadataArray,
) {
	if (targetIsConstructorFunction(annotationTarget)) {
		throw new Error(INVALID_DECORATOR_OPERATION);
	}
	_tagParameterOrProperty(
		TAGGED_PROP,
		annotationTarget.constructor,
		propertyName,
		metadata,
	);
}

function _ensureNoMetadataKeyDuplicates(
	metadata: MetadataOrMetadataArray,
): Metadata[] {
	let metadatas: Metadata[] = [];
	if (Array.isArray(metadata)) {
		metadatas = metadata;
		const duplicate = getFirstArrayDuplicate(metadatas.map((md) => md.key));
		if (duplicate !== undefined) {
			throw new Error(`${DUPLICATED_METADATA} ${duplicate.toString()}`);
		}
	} else {
		metadatas = [metadata];
	}
	return metadatas;
}

function _tagParameterOrProperty(
	metadataKey: string,
	annotationTarget: NewableFunction,
	key: string | symbol,
	metadata: MetadataOrMetadataArray,
) {
	const metadatas: Metadata[] = _ensureNoMetadataKeyDuplicates(metadata);
	let paramsOrPropertiesMetadata: Record<
		string | symbol,
		Metadata[] | undefined
	> = {};

	// read metadata if available
	if (hasOwnMetadata(metadataKey, annotationTarget)) {
		paramsOrPropertiesMetadata = getMetadata(
			metadataKey,
			annotationTarget,
		) as Record<string | symbol, Metadata[]>;
	}

	// get metadata for the decorated parameter by its index
	let paramOrPropertyMetadata: Metadata[] | undefined =
		paramsOrPropertiesMetadata[key];

	if (paramOrPropertyMetadata === undefined) {
		paramOrPropertyMetadata = [];
	} else {
		for (const m of paramOrPropertyMetadata) {
			if (metadatas.some((md) => md.key === m.key)) {
				throw new Error(`${DUPLICATED_METADATA} ${m.key.toString()}`);
			}
		}
	}

	// set metadata
	paramOrPropertyMetadata.push(...metadatas);
	paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
	defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
}

export function createTaggedDecorator(metadata: MetadataOrMetadataArray) {
	return <T>(
		target: DecoratorTarget,
		targetKey?: string | symbol,
		indexOrPropertyDescriptor?: number | TypedPropertyDescriptor<T>,
	) => {
		if (typeof indexOrPropertyDescriptor === "number") {
			tagParameter(target, targetKey, indexOrPropertyDescriptor, metadata);
		} else {
			tagProperty(target, targetKey as string | symbol, metadata);
		}
	};
}

function _decorate(
	decorators: (DecoratorTarget | ParameterDecorator | MethodDecorator)[],
	target: NewableFunction,
): void {
	reflectionDecorate(decorators as ClassDecorator[], target);
}

function _param(paramIndex: number, decorator: ParameterDecorator) {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (target: any, key: string) => {
		decorator(target, key, paramIndex);
	};
}

/**
 * Allows VanillaJS developers to use decorators:
 *
 * @export
 * @param {((ClassDecorator | ParameterDecorator | MethodDecorator))} decorator
 * @param {*} target
 * @param {(number | string)} [parameterIndex]
 * @example
 * decorate(injectable("Foo", "Bar"), FooBar);
 * decorate(targetName("foo", "bar"), FooBar);
 * decorate(named("foo"), FooBar, 0);
 * decorate(tagged("bar"), FooBar, 1);
 */
export function decorate(
	decorator:
		| ClassDecorator
		| ParameterDecorator
		| MethodDecorator
		| MemberDecorator,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	target: any,
	parameterIndex?: number | string,
): void {
	if (typeof parameterIndex === "number") {
		_decorate(
			[_param(parameterIndex, decorator as ParameterDecorator)],
			target,
		);
	} else if (typeof parameterIndex === "string") {
		reflectionDecorate([decorator as MemberDecorator], target, parameterIndex);
	} else {
		_decorate([decorator as ClassDecorator], target);
	}
}
