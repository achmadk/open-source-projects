import { NAMED_TAG } from "../constants/metadata_keys";
import { Metadata } from "../planning/metadata";
import { createTaggedDecorator } from "./decorator_utils";

/**
 * Used to add named metadata which is used to resolve name-based contextual bindings.
 *
 * @export
 * @param {(string | number | symbol)} name
 * @return {*}
 */
export function named(name: string | number | symbol) {
	return createTaggedDecorator(new Metadata(NAMED_TAG, name));
}
