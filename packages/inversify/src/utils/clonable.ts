import type { Clonable } from "../interfaces";

export function isClonable<T>(obj: unknown): obj is Clonable<T> {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "clone" in obj &&
    typeof (obj as Clonable<T>).clone === "function"
  );
}
