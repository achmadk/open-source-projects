import { MULTIPLE_POST_CONSTRUCT_METHODS } from "../constants/error_msgs";
import { POST_CONSTRUCT } from "../constants/metadata_keys";
import { propertyEventDecorator } from "./property_event_decorator";

export const postConstruct = propertyEventDecorator(
	POST_CONSTRUCT,
	MULTIPLE_POST_CONSTRUCT_METHODS,
);
