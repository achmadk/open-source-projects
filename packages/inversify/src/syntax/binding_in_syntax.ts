import { BindingScopeEnum } from "../constants/literal_types";
import type {
	Binding,
	BindingInSyntax as IBindingInSyntax,
	BindingWhenOnSyntax as IBindingWhenOnSyntax,
} from "../interfaces";
import { BindingWhenOnSyntax } from "./binding_when_on_syntax";

export class BindingInSyntax<T> implements IBindingInSyntax<T> {
	private _binding: Binding<T>;

	public constructor(binding: Binding<T>) {
		this._binding = binding;
	}

	public inRequestScope(): IBindingWhenOnSyntax<T> {
		this._binding.scope = BindingScopeEnum.Request;
		return new BindingWhenOnSyntax<T>(this._binding);
	}

	public inSingletonScope(): IBindingWhenOnSyntax<T> {
		this._binding.scope = BindingScopeEnum.Singleton;
		return new BindingWhenOnSyntax<T>(this._binding);
	}

	public inTransientScope(): IBindingWhenOnSyntax<T> {
		this._binding.scope = BindingScopeEnum.Transient;
		return new BindingWhenOnSyntax<T>(this._binding);
	}
}
