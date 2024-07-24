import { LazyServiceIdentifier } from "../annotation";
import {
  MISSING_INJECTABLE_ANNOTATION,
  MISSING_INJECT_ANNOTATION,
} from "../constants/error_msgs";
import { TargetTypeEnum } from "../constants/literal_types";
import {
  INJECT_TAG,
  MULTI_INJECT_TAG,
  NAME_TAG,
  UNMANAGED_TAG,
} from "../constants/metadata_keys";
import type {
  Target as ITarget,
  Metadata,
  MetadataMap,
  MetadataReaderInterface,
  ServiceIdentifier,
} from "../interfaces/interfaces";
import { getFunctionName } from "../utils/serialization";
import { Target } from "./target";

export { getFunctionName } from "../utils/serialization";

export function getDependencies(
  metadataReader: MetadataReaderInterface,
  func: NewableFunction,
): ITarget[] {
  const constructorName = getFunctionName(func);
  return getTargets(metadataReader, constructorName, func, false);
}

function getTargets(
  metadataReader: MetadataReaderInterface,
  constructorName: string,
  func: NewableFunction,
  isBaseClass: boolean,
): ITarget[] {
  const metadata = metadataReader.getConstructorMetadata(func);

  // TypeScript compiler generated annotations
  const serviceIdentifiers = metadata.compilerGeneratedMetadata;

  // All types resolved must be annotated with @injectable
  if (serviceIdentifiers === undefined) {
    const msg = `${MISSING_INJECTABLE_ANNOTATION} ${constructorName}.`;
    throw new Error(msg);
  }

  // User generated annotations
  const constructorArgsMetadata = metadata.userGeneratedMetadata;

  const keys = Object.keys(constructorArgsMetadata);
  const hasUserDeclaredUnknownInjections = func.length === 0 && keys.length > 0;
  const hasOptionalParameters = keys.length > func.length;

  const iterations =
    hasUserDeclaredUnknownInjections || hasOptionalParameters
      ? keys.length
      : func.length;

  // Target instances that represent constructor arguments to be injected
  const constructorTargets = getConstructorArgsAsTargets(
    isBaseClass,
    constructorName,
    serviceIdentifiers,
    constructorArgsMetadata,
    iterations,
  );

  // Target instances that represent properties to be injected
  const propertyTargets = getClassPropsAsTargets(
    metadataReader,
    func,
    constructorName,
  );

  const targets = [...constructorTargets, ...propertyTargets];

  return targets;
}
function getConstructorArgsAsTarget(
  index: number,
  isBaseClass: boolean,
  constructorName: string,
  serviceIdentifiers: ServiceIdentifier[],
  constructorArgsMetadata: MetadataMap,
) {
  // Create map from array of metadata for faster access to metadata
  const targetMetadata = constructorArgsMetadata[index.toString()] ?? [];
  const metadata = formatTargetMetadata(targetMetadata);
  const isManaged = metadata.unmanaged !== true;

  // Take types to be injected from user-generated metadata
  // if not available use compiler-generated metadata
  let serviceIdentifier = serviceIdentifiers[index];
  const injectIdentifier = metadata.inject ?? metadata.multiInject;
  serviceIdentifier = injectIdentifier ? injectIdentifier : serviceIdentifier;

  // we unwrap LazyServiceIdentifier wrappers to allow circular dependencies on symbols
  if (serviceIdentifier instanceof LazyServiceIdentifier) {
    // @ts-ignore
    serviceIdentifier = serviceIdentifier.unwrap();
  }

  // Types Object and Function are too ambiguous to be resolved
  // user needs to generate metadata manually for those
  if (isManaged) {
    const isObject = serviceIdentifier === Object;
    const isFunction = serviceIdentifier === Function;
    const isUndefined = serviceIdentifier === undefined;
    const isUnknownType = isObject || isFunction || isUndefined;

    if (!isBaseClass && isUnknownType) {
      const msg = `${MISSING_INJECT_ANNOTATION} argument ${index} in class ${constructorName}.`;
      throw new Error(msg);
    }

    const target = new Target(
      TargetTypeEnum.ConstructorArgument,
      metadata.targetName,
      serviceIdentifier,
    );
    target.metadata = targetMetadata;
    return target;
  }

  return null;
}

function getConstructorArgsAsTargets(
  isBaseClass: boolean,
  constructorName: string,
  serviceIdentifiers: ServiceIdentifier[],
  constructorArgsMetadata: MetadataMap,
  iterations: number,
) {
  const targets: ITarget[] = [];
  for (let i = 0; i < iterations; i++) {
    const index = i;
    const target = getConstructorArgsAsTarget(
      index,
      isBaseClass,
      constructorName,
      serviceIdentifiers,
      constructorArgsMetadata,
    );
    if (target !== null) {
      targets.push(target);
    }
  }

  return targets;
}

function _getServiceIdentifierForProperty(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  inject: any,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  multiInject: any,
  propertyName: string | symbol,
  className: string,
) {
  const serviceIdentifier = inject ?? multiInject;
  if (serviceIdentifier === undefined) {
    const msg = `${MISSING_INJECTABLE_ANNOTATION} for property ${String(
      propertyName,
    )} in class ${className}.`;
    throw new Error(msg);
  }
  return serviceIdentifier;
}

function getClassPropsAsTargets(
  metadataReader: MetadataReaderInterface,
  constructorFunc: NewableFunction,
  constructorName: string,
) {
  const classPropsMetadata =
    metadataReader.getPropertiesMetadata(constructorFunc);
  let targets: ITarget[] = [];
  const symbolKeys = Object.getOwnPropertySymbols(classPropsMetadata);
  const stringKeys: (string | symbol)[] = Object.keys(classPropsMetadata);
  const keys: (string | symbol)[] = stringKeys.concat(symbolKeys);

  for (const key of keys) {
    // the metadata for the property being injected
    const targetMetadata = classPropsMetadata[key] as Metadata[];

    // the metadata formatted for easier access
    const metadata = formatTargetMetadata(targetMetadata);

    // the name of the property being injected
    const identifier = metadata.targetName ?? key;

    // Take types to be injected from user-generated metadata
    const serviceIdentifier = _getServiceIdentifierForProperty(
      metadata.inject,
      metadata.multiInject,
      key,
      constructorName,
    );

    // The property target
    const target = new Target(
      TargetTypeEnum.ClassProperty,
      identifier,
      serviceIdentifier,
    );
    target.metadata = targetMetadata;
    targets.push(target);
  }

  // Check if base class has injected properties
  const baseConstructor = Object.getPrototypeOf(
    constructorFunc.prototype,
  ).constructor;

  if (baseConstructor !== Object) {
    const baseTargets = getClassPropsAsTargets(
      metadataReader,
      baseConstructor,
      constructorName,
    );

    targets = [...targets, ...baseTargets];
  }

  return targets;
}

export function getBaseClassDependencyCount(
  metadataReader: MetadataReaderInterface,
  func: NewableFunction,
): number {
  const baseConstructor = Object.getPrototypeOf(func.prototype).constructor;

  if (baseConstructor !== Object) {
    // get targets for base class
    const baseConstructorName = getFunctionName(baseConstructor);

    const targets = getTargets(
      metadataReader,
      baseConstructorName,
      baseConstructor,
      true,
    );

    // get unmanaged metadata
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const metadata: any[] = targets.map((t: ITarget) =>
      t.metadata.filter((m: Metadata) => m.key === UNMANAGED_TAG),
    );

    // Compare the number of constructor arguments with the number of
    // unmanaged dependencies unmanaged dependencies are not required
    const unmanagedCount = ([] as Metadata[]).concat.apply([], metadata).length;
    const dependencyCount = targets.length - unmanagedCount;

    if (dependencyCount > 0) {
      return dependencyCount;
    }
    return getBaseClassDependencyCount(metadataReader, baseConstructor);
  }
  return 0;
}

function formatTargetMetadata(targetMetadata: Metadata[]) {
  // Create map from array of metadata for faster access to metadata
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const targetMetadataMap: any = {};
  // biome-ignore lint/complexity/noForEach: <explanation>
  targetMetadata.forEach((m: Metadata) => {
    targetMetadataMap[m.key.toString()] = m.value;
  });

  // user generated metadata
  return {
    inject: targetMetadataMap[INJECT_TAG],
    multiInject: targetMetadataMap[MULTI_INJECT_TAG],
    targetName: targetMetadataMap[NAME_TAG],
    unmanaged: targetMetadataMap[UNMANAGED_TAG],
  };
}
