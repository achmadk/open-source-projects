import { MULTIPLE_PRE_DESTROY_METHODS } from "../constants/error_msgs";
import { PRE_DESTROY } from "../constants/metadata_keys";
import { propertyEventDecorator } from "./property_event_decorator";

export const preDestroy = propertyEventDecorator(
	PRE_DESTROY,
	MULTIPLE_PRE_DESTROY_METHODS,
);
