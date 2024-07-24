import { getMetadata } from "@abraham/reflection";

import { PARAM_TYPES, TAGGED, TAGGED_PROP } from "../constants/metadata_keys";
import type {
  ConstructorMetadata,
  MetadataMap,
  MetadataReaderInterface,
} from "../interfaces";

export class MetadataReader implements MetadataReaderInterface {
  public getConstructorMetadata(
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    constructorFunc: Function,
  ): ConstructorMetadata {
    // TypeScript compiler generated annotations
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    const compilerGeneratedMetadata = getMetadata<Function[] | undefined>(
      PARAM_TYPES,
      constructorFunc,
    );

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

  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  public getPropertiesMetadata(constructorFunc: Function): MetadataMap {
    // User generated properties annotations
    const userGeneratedMetadata =
      getMetadata<MetadataMap>(TAGGED_PROP, constructorFunc) ||
      ([] as unknown as MetadataMap);
    return userGeneratedMetadata;
  }
}
