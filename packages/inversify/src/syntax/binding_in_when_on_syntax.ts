import type {
  Binding,
  BindingWhenOnSyntax,
  Context,
  BindingInSyntax as IBindingInSyntax,
  BindingOnSyntax as IBindingOnSyntax,
  BindingWhenSyntax as IBindingWhenSyntax,
  Request,
} from "../interfaces";
import { BindingInSyntax } from "./binding_in_syntax";
import { BindingOnSyntax } from "./binding_on_syntax";
import { BindingWhenSyntax } from "./binding_when_syntax";

export class BindingInWhenOnSyntax<T>
  implements IBindingInSyntax<T>, IBindingWhenSyntax<T>, IBindingOnSyntax<T>
{
  _bindingInSyntax: IBindingInSyntax<T>;
  _bindingWhenSyntax: IBindingWhenSyntax<T>;
  _bindingOnSyntax: IBindingOnSyntax<T>;
  _binding: Binding<T>;

  public constructor(binding: Binding<T>) {
    this._binding = binding;
    this._bindingWhenSyntax = new BindingWhenSyntax<T>(this._binding);
    this._bindingOnSyntax = new BindingOnSyntax<T>(this._binding);
    this._bindingInSyntax = new BindingInSyntax<T>(binding);
  }

  public inRequestScope(): BindingWhenOnSyntax<T> {
    return this._bindingInSyntax.inRequestScope();
  }

  public inSingletonScope(): BindingWhenOnSyntax<T> {
    return this._bindingInSyntax.inSingletonScope();
  }

  public inTransientScope(): BindingWhenOnSyntax<T> {
    return this._bindingInSyntax.inTransientScope();
  }

  public when(constraint: (request: Request) => boolean): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.when(constraint);
  }

  public whenTargetNamed(name: string): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenTargetNamed(name);
  }

  public whenTargetIsDefault(): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenTargetIsDefault();
  }

  public whenTargetTagged(tag: string, value: unknown): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenTargetTagged(tag, value);
  }

  public whenInjectedInto(
    parent: NewableFunction | string,
  ): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenInjectedInto(parent);
  }

  public whenParentNamed(name: string): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenParentNamed(name);
  }

  public whenParentTagged(tag: string, value: unknown): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenParentTagged(tag, value);
  }

  public whenAnyAncestorIs(
    ancestor: NewableFunction | string,
  ): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
  }

  public whenNoAncestorIs(
    ancestor: NewableFunction | string,
  ): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
  }

  public whenAnyAncestorNamed(name: string): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
  }

  public whenAnyAncestorTagged(
    tag: string,
    value: unknown,
  ): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
  }

  public whenNoAncestorNamed(name: string): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenNoAncestorNamed(name);
  }

  public whenNoAncestorTagged(
    tag: string,
    value: unknown,
  ): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenNoAncestorTagged(tag, value);
  }

  public whenAnyAncestorMatches(
    constraint: (request: Request) => boolean,
  ): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenAnyAncestorMatches(constraint);
  }

  public whenNoAncestorMatches(
    constraint: (request: Request) => boolean,
  ): IBindingOnSyntax<T> {
    return this._bindingWhenSyntax.whenNoAncestorMatches(constraint);
  }

  public onActivation(
    handler: (context: Context, injectable: T) => T,
  ): IBindingWhenSyntax<T> {
    return this._bindingOnSyntax.onActivation(handler);
  }

  public onDeactivation(
    handler: (injectable: T) => void | Promise<void>,
  ): IBindingWhenSyntax<T> {
    return this._bindingOnSyntax.onDeactivation(handler);
  }
}
