import {
  MULTI_INJECT_TAG,
  NAMED_TAG,
  NON_CUSTOM_TAG_KEYS,
  OPTIONAL_TAG,
} from "../constants/metadata_keys";
import type {
  Metadata as IMetadata,
  QueryableString as IQueryableString,
  Target as ITarget,
  ServiceIdentifier,
  TargetType,
} from "../interfaces";
import { getSymbolDescription } from "../utils";
import { id } from "../utils/id";
import { Metadata } from "./metadata";
import { QueryableString } from "./queryable_string";

export class Target implements ITarget {
  public id: number;
  public type: TargetType;
  public serviceIdentifier: ServiceIdentifier;
  public name: IQueryableString;
  public identifier: string | symbol;
  public key!: string | symbol;
  public metadata: Metadata[];

  public constructor(
    type: TargetType,
    identifier: string | symbol,
    serviceIdentifier: ServiceIdentifier,
    namedOrTagged?: string | Metadata,
  ) {
    this.id = id();
    this.type = type;
    this.serviceIdentifier = serviceIdentifier;
    const queryableName =
      typeof identifier === "symbol"
        ? getSymbolDescription(identifier)
        : identifier;
    this.name = new QueryableString(queryableName ?? "");
    this.identifier = identifier;
    this.metadata = new Array<Metadata>();

    let metadataItem: IMetadata | null = null;

    // is named target
    if (typeof namedOrTagged === "string") {
      metadataItem = new Metadata(NAMED_TAG, namedOrTagged);
    } else if (namedOrTagged instanceof Metadata) {
      // is target with metadata
      metadataItem = namedOrTagged;
    }

    // target has metadata
    if (metadataItem !== null) {
      this.metadata.push(metadataItem);
    }
  }

  public hasTag(key: string): boolean {
    for (const m of this.metadata) {
      if (m.key === key) {
        return true;
      }
    }
    return false;
  }

  public isArray(): boolean {
    return this.hasTag(MULTI_INJECT_TAG);
  }

  public matchesArray(name: ServiceIdentifier<unknown>): boolean {
    return this.matchesTag(MULTI_INJECT_TAG)(name);
  }

  public isNamed(): boolean {
    return this.hasTag(NAMED_TAG);
  }

  public isTagged(): boolean {
    return this.metadata.some((metadata) =>
      NON_CUSTOM_TAG_KEYS.every((key) => metadata.key !== key),
    );
  }

  public isOptional(): boolean {
    return this.matchesTag(OPTIONAL_TAG)(true);
  }

  public getNamedTag(): IMetadata<string> | null {
    if (this.isNamed()) {
      return this.metadata.filter(
        (m) => m.key === NAMED_TAG,
      )[0] as IMetadata<string>;
    }
    return null;
  }

  public getCustomTags(): IMetadata[] | null {
    if (this.isTagged()) {
      return this.metadata.filter((metadata) =>
        NON_CUSTOM_TAG_KEYS.every((key) => metadata.key !== key),
      );
    }
    return null;
  }

  public matchesNamedTag(name: string): boolean {
    return this.matchesTag(NAMED_TAG)(name);
  }

  public matchesTag(key: string) {
    return (value: unknown) => {
      for (const m of this.metadata) {
        if (m.key === key && m.value === value) {
          return true;
        }
      }
      return false;
    };
  }
}
