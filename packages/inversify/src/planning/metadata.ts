import { NAMED_TAG } from "../constants/metadata_keys";
import type { Metadata as IMetadata } from "../interfaces";

export class Metadata implements IMetadata {
  public key: string | number | symbol;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public value: any;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public constructor(key: string | number | symbol, value: any) {
    this.key = key;
    this.value = value;
  }

  public toString() {
    if (this.key === NAMED_TAG) {
      return `named: ${this.value.toString()} `;
    }
    return `tagged: { key:${this.key.toString()}, value: ${this.value} }`;
  }
}
