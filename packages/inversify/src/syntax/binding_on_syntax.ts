import type {
	Binding,
	BindingDeactivation,
	Context,
	BindingOnSyntax as IBindingOnSyntax,
	BindingWhenSyntax as IBindingWhenSyntax,
} from "../interfaces";
import { BindingWhenSyntax } from "./binding_when_syntax";

export class BindingOnSyntax<T> implements IBindingOnSyntax<T> {
	#binding: Binding<T>;

	public constructor(binding: Binding<T>) {
		this.#binding = binding;
	}

	public onActivation(
		handler: (context: Context, injectable: T) => T,
	): IBindingWhenSyntax<T> {
		this.#binding.onActivation = handler;
		return new BindingWhenSyntax<T>(this.#binding);
	}

	public onDeactivation(
		handler: BindingDeactivation<T>,
	): IBindingWhenSyntax<T> {
		this.#binding.onDeactivation = handler;
		return new BindingWhenSyntax<T>(this.#binding);
	}
}
