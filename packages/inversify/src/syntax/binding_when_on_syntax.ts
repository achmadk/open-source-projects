import type {
  Binding,
  Context,
  BindingOnSyntax as IBindingOnSyntax,
  BindingWhenSyntax as IBindingWhenSyntax,
  Request,
} from "../interfaces";
import { BindingOnSyntax } from "./binding_on_syntax";
import { BindingWhenSyntax } from "./binding_when_syntax";

export class BindingWhenOnSyntax<T>
  implements IBindingWhenSyntax<T>, IBindingOnSyntax<T>
{
  private _bindingWhenSyntax: IBindingWhenSyntax<T>;
  private _bindingOnSyntax: IBindingOnSyntax<T>;
  private _binding: Binding<T>;

  public constructor(binding: Binding<T>) {
    this._binding = binding;
    this._bindingWhenSyntax = new BindingWhenSyntax<T>(this._binding);
    this._bindingOnSyntax = new BindingOnSyntax<T>(
      this._binding,
    ) as unknown as IBindingOnSyntax<T>;
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
    handler: (injectable: T) => Promise<void> | void,
  ): IBindingWhenSyntax<T> {
    return this._bindingOnSyntax.onDeactivation(handler);
  }
}
