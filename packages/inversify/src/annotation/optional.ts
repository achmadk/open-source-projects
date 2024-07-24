import { OPTIONAL_TAG } from "../constants/metadata_keys";
import { Metadata } from "../planning/metadata";
import { createTaggedDecorator } from "./decorator_utils";

export function optional() {
  return createTaggedDecorator(new Metadata(OPTIONAL_TAG, true));
}
