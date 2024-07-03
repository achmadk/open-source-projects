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
	private _bindingInSyntax: IBindingInSyntax<T>;
	private _bindingWhenSyntax: IBindingWhenSyntax<T>;
	private _bindingOnSyntax: IBindingOnSyntax<T>;
	private _binding: Binding<T>;

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

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public whenTargetTagged(tag: string, value: any): IBindingOnSyntax<T> {
		return this._bindingWhenSyntax.whenTargetTagged(tag, value);
	}

	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	public whenInjectedInto(parent: Function | string): IBindingOnSyntax<T> {
		return this._bindingWhenSyntax.whenInjectedInto(parent);
	}

	public whenParentNamed(name: string): IBindingOnSyntax<T> {
		return this._bindingWhenSyntax.whenParentNamed(name);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public whenParentTagged(tag: string, value: any): IBindingOnSyntax<T> {
		return this._bindingWhenSyntax.whenParentTagged(tag, value);
	}

	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	public whenAnyAncestorIs(ancestor: Function | string): IBindingOnSyntax<T> {
		return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
	}

	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	public whenNoAncestorIs(ancestor: Function | string): IBindingOnSyntax<T> {
		return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
	}

	public whenAnyAncestorNamed(name: string): IBindingOnSyntax<T> {
		return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public whenAnyAncestorTagged(tag: string, value: any): IBindingOnSyntax<T> {
		return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
	}

	public whenNoAncestorNamed(name: string): IBindingOnSyntax<T> {
		return this._bindingWhenSyntax.whenNoAncestorNamed(name);
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	public whenNoAncestorTagged(tag: string, value: any): IBindingOnSyntax<T> {
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
