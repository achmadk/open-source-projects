import { NAMED_TAG } from "../constants/metadata_keys";
import type { Binding, ConstraintFunction, Request } from "../interfaces";
import { Metadata } from "../planning/metadata";

export const traverseAncerstors = (
  request: Request | null,
  constraint: ConstraintFunction,
): boolean => {
  const parent = request?.parentRequest ?? null;
  if (parent === null) {
    return false;
  }
  return constraint(parent) ? true : traverseAncerstors(parent, constraint);
};

/**
 * This helpers use currying to help you to generate constraints
 *
 * @param key
 */
export const taggedConstraint =
  (key: string | number | symbol) => (value: unknown) => {
    const constraint: ConstraintFunction = (request?: Request | null) =>
      request?.target?.matchesTag(key)(value) ?? false;

    constraint.metaData = new Metadata(key, value);

    return constraint;
  };

export const namedConstraint = taggedConstraint(NAMED_TAG);

export const typeConstraint =
  (type: NewableFunction | string) => (request?: Request | null) => {
    // Using index 0 because constraints are applied
    // to one binding at a time (see Planner class)
    let binding: Binding<unknown> | null = null;

    if (request !== null) {
      binding = request?.bindings[0] as Binding<unknown>;
      if (typeof type === "string") {
        const serviceIdentifier = binding?.serviceIdentifier;
        return serviceIdentifier === type;
      }
      // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
      const constructor = request?.bindings[0].implementationType;
      return type === constructor;
    }

    return false;
  };
