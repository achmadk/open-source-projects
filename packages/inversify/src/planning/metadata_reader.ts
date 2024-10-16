import { getMetadata } from "@abraham/reflection";

import { PARAM_TYPES, TAGGED, TAGGED_PROP } from "../constants/metadata_keys";
import type {
  ConstructorMetadata,
  MetadataMap,
  MetadataReaderInterface,
} from "../interfaces";

export class MetadataReader implements MetadataReaderInterface {
  public getConstructorMetadata(
    constructorFunc: NewableFunction,
  ): ConstructorMetadata {
    const compilerGeneratedMetadata = getMetadata<
      NewableFunction[] | undefined
    >(PARAM_TYPES, constructorFunc);

    // User generated constructor annotations
    const userGeneratedMetadata = getMetadata<MetadataMap>(
      TAGGED,
      constructorFunc,
    );

    return {
      compilerGeneratedMetadata,
      userGeneratedMetadata: userGeneratedMetadata || {},
    };
  }

  public getPropertiesMetadata(constructorFunc: NewableFunction): MetadataMap {
    // User generated properties annotations
    const userGeneratedMetadata =
      getMetadata<MetadataMap>(TAGGED_PROP, constructorFunc) ??
      ([] as unknown as MetadataMap);
    return userGeneratedMetadata;
  }
}
