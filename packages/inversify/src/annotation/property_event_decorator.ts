import { hasOwnMetadata, defineMetadata } from "@abraham/reflection";

import { Metadata } from "../planning/metadata";

export function propertyEventDecorator(eventKey: string, errorMessage: string) {
	return () => {
		return (target: { constructor: NewableFunction }, propertyKey: string) => {
			const metadata = new Metadata(eventKey, propertyKey);

			if (hasOwnMetadata(eventKey, target.constructor)) {
				throw new Error(errorMessage);
			}
			defineMetadata(eventKey, metadata, target.constructor);
		};
	};
}
