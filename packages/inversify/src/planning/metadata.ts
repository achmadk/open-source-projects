import { NAMED_TAG } from "../constants/metadata_keys";
import type { Metadata as IMetadata } from "../interfaces";

export class Metadata implements IMetadata {
  public key: string | number | symbol;
  public value: unknown;

  public constructor(key: string | number | symbol, value: unknown) {
    this.key = key;
    this.value = value;
  }

  public toString() {
    if (this.key === NAMED_TAG) {
      return `named: ${String(this.value).toString()} `;
    }
    return `tagged: { key:${this.key.toString()}, value: ${String(this.value)} }`;
  }
}
