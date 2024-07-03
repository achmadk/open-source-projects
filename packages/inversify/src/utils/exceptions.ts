import { STACK_OVERFLOW } from "../constants/error_msgs";

export function isStackOverflowExeption(error: Error) {
	return error instanceof RangeError || error.message === STACK_OVERFLOW;
}

export const tryAndThrowErrorIfStackOverflow = <T>(
	fn: () => T,
	errorCallback: () => Error,
) => {
	try {
		return fn();
	} catch (error: unknown) {
		if (isStackOverflowExeption(error as Error)) {
			// biome-ignore lint/suspicious/noCatchAssign: <explanation>
			error = errorCallback(); // eslint-disable-line
		}
		throw error;
	}
};
