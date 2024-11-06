import { STACK_OVERFLOW } from "../constants/error_msgs";

export function isStackOverflowExeption(error: unknown): error is RangeError {
  return (
    error instanceof RangeError || (error as Error).message === STACK_OVERFLOW
  );
}

export const tryAndThrowErrorIfStackOverflow = <T>(
  fn: () => T,
  errorCallback: () => Error,
) => {
  try {
    return fn();
  } catch (error: unknown) {
    if (isStackOverflowExeption(error)) {
      // biome-ignore lint/suspicious/noCatchAssign: <explanation>
      error = errorCallback();
    }
    throw error;
  }
};
