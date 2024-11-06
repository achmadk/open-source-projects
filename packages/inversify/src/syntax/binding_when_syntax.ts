import type {
  Binding,
  ConstraintFunction,
  BindingOnSyntax as IBindingOnSyntax,
  BindingWhenSyntax as IBindingWhenSyntax,
  Request,
} from "../interfaces";
import { BindingOnSyntax } from "./binding_on_syntax";
import {
  namedConstraint,
  taggedConstraint,
  traverseAncerstors,
  typeConstraint,
} from "./constraint_helpers";

export class BindingWhenSyntax<T> implements IBindingWhenSyntax<T> {
  private _binding: Binding<T>;

  public constructor(binding: Binding<T>) {
    this._binding = binding;
  }

  public when(constraint: (request: Request) => boolean): IBindingOnSyntax<T> {
    this._binding.constraint = constraint as ConstraintFunction;
    return new BindingOnSyntax<T>(
      this._binding,
    ) as unknown as IBindingOnSyntax<T>;
  }

  public whenTargetNamed(name: string | number | symbol): IBindingOnSyntax<T> {
    this._binding.constraint = namedConstraint(name);
    return new BindingOnSyntax<T>(
      this._binding,
    ) as unknown as IBindingOnSyntax<T>;
  }

  public whenTargetIsDefault(): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) => {
      const targetIsDefault =
        request?.target !== null &&
        !request?.target.isNamed() &&
        !request?.target.isTagged();

      return targetIsDefault;
    };

    return new BindingOnSyntax<T>(this._binding);
  }

  public whenTargetTagged(
    tag: string | number | symbol,
    value: unknown,
  ): IBindingOnSyntax<T> {
    this._binding.constraint = taggedConstraint(tag)(value);
    return new BindingOnSyntax<T>(this._binding);
  }

  public whenInjectedInto(
    parent: NewableFunction | string,
  ): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) =>
      request !== null && typeConstraint(parent)(request.parentRequest);
    return new BindingOnSyntax<T>(this._binding);
  }

  public whenParentNamed(name: string | number | symbol): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) =>
      request !== null && namedConstraint(name)(request.parentRequest);
    return new BindingOnSyntax<T>(this._binding);
  }

  public whenParentTagged(
    tag: string | number | symbol,
    value: unknown,
  ): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) =>
      request !== null && taggedConstraint(tag)(value)(request.parentRequest);
    return new BindingOnSyntax<T>(this._binding);
  }

  public whenAnyAncestorIs(
    ancestor: NewableFunction | string,
  ): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) =>
      request !== null && traverseAncerstors(request, typeConstraint(ancestor));
    return new BindingOnSyntax<T>(this._binding);
  }

  public whenNoAncestorIs(
    ancestor: NewableFunction | string,
  ): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) =>
      request !== null &&
      !traverseAncerstors(request, typeConstraint(ancestor));
    return new BindingOnSyntax<T>(this._binding);
  }

  public whenAnyAncestorNamed(
    name: string | number | symbol,
  ): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) =>
      request !== null && traverseAncerstors(request, namedConstraint(name));

    return new BindingOnSyntax<T>(this._binding);
  }

  public whenNoAncestorNamed(
    name: string | number | symbol,
  ): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) =>
      request !== null && !traverseAncerstors(request, namedConstraint(name));

    return new BindingOnSyntax<T>(this._binding);
  }

  public whenAnyAncestorTagged(
    tag: string | number | symbol,
    value: unknown,
  ): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) =>
      request !== null &&
      traverseAncerstors(request, taggedConstraint(tag)(value));

    return new BindingOnSyntax<T>(this._binding);
  }

  public whenNoAncestorTagged(
    tag: string | number | symbol,
    value: unknown,
  ): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) =>
      request !== null &&
      !traverseAncerstors(request, taggedConstraint(tag)(value));

    return new BindingOnSyntax<T>(this._binding);
  }

  public whenAnyAncestorMatches(
    constraint: (request: Request) => boolean,
  ): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) =>
      request !== null &&
      traverseAncerstors(request, constraint as ConstraintFunction);

    return new BindingOnSyntax<T>(this._binding);
  }

  public whenNoAncestorMatches(
    constraint: (request: Request) => boolean,
  ): IBindingOnSyntax<T> {
    this._binding.constraint = (request: Request | null) =>
      request !== null &&
      !traverseAncerstors(request, constraint as ConstraintFunction);

    return new BindingOnSyntax<T>(this._binding);
  }
}
