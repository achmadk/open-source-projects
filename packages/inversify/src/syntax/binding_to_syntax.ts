import {
  INVALID_FUNCTION_BINDING,
  INVALID_TO_SELF_VALUE,
} from "../constants/error_msgs";
import { BindingScopeEnum, BindingTypeEnum } from "../constants/literal_types";
import type {
  Abstract,
  Binding,
  Context,
  FactoryCreator,
  BindingInWhenOnSyntax as IBindingInWhenOnSyntax,
  BindingToSyntax as IBindingToSyntax,
  BindingWhenOnSyntax as IBindingWhenOnSyntax,
  Newable,
  ProviderCreator,
  ServiceIdentifier,
} from "../interfaces";
import { BindingInWhenOnSyntax } from "./binding_in_when_on_syntax";
import { BindingWhenOnSyntax } from "./binding_when_on_syntax";

export class BindingToSyntax<T> implements IBindingToSyntax<T> {
  private _binding: Binding<T>;

  public constructor(binding: Binding<T>) {
    this._binding = binding;
  }

  // @ts-ignore
  public to(
    // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
    constructor: new (...args: never[]) => T,
  ): BindingInWhenOnSyntax<T> {
    this._binding.type = BindingTypeEnum.Instance;
    // @ts-ignore
    this._binding.implementationType = constructor;
    return new BindingInWhenOnSyntax<T>(this._binding);
  }

  public toSelf(): IBindingInWhenOnSyntax<T> {
    if (typeof this._binding.serviceIdentifier !== "function") {
      throw new Error(`${INVALID_TO_SELF_VALUE}`);
    }
    const self = this._binding.serviceIdentifier;
    // @ts-ignore
    return this.to(self);
  }

  public toConstantValue(value: T): IBindingWhenOnSyntax<T> {
    this._binding.type = BindingTypeEnum.ConstantValue;
    this._binding.cache = value;
    this._binding.dynamicValue = null;
    this._binding.implementationType = null;
    this._binding.scope = BindingScopeEnum.Singleton;
    // @ts-ignore
    return new BindingWhenOnSyntax<T>(this._binding);
  }

  public toDynamicValue(
    func: (context: Context) => T,
  ): IBindingInWhenOnSyntax<T> {
    this._binding.type = BindingTypeEnum.DynamicValue;
    this._binding.cache = null;
    this._binding.dynamicValue = func;
    this._binding.implementationType = null;
    // @ts-ignore
    return new BindingInWhenOnSyntax<T>(this._binding);
  }

  // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
  public toConstructor<T2>(constructor: Newable<T2>): IBindingWhenOnSyntax<T> {
    this._binding.type = BindingTypeEnum.Constructor;
    this._binding.implementationType = constructor as unknown as T;
    this._binding.scope = BindingScopeEnum.Singleton;
    // @ts-ignore
    return new BindingWhenOnSyntax<T>(this._binding);
  }

  public toFactory<T2>(factory: FactoryCreator<T2>): IBindingWhenOnSyntax<T> {
    this._binding.type = BindingTypeEnum.Factory;
    this._binding.factory = factory;
    this._binding.scope = BindingScopeEnum.Singleton;
    // @ts-ignore
    return new BindingWhenOnSyntax<T>(this._binding);
  }

  public toFunction(func: T): IBindingWhenOnSyntax<T> {
    // toFunction is an alias of toConstantValue
    if (typeof func !== "function") {
      throw new Error(INVALID_FUNCTION_BINDING);
    }
    const bindingWhenOnSyntax = this.toConstantValue(func);
    this._binding.type = BindingTypeEnum.Function;
    this._binding.scope = BindingScopeEnum.Singleton;
    return bindingWhenOnSyntax;
  }

  public toAutoFactory<T2>(
    serviceIdentifier: ServiceIdentifier<T2>,
  ): IBindingWhenOnSyntax<T> {
    this._binding.type = BindingTypeEnum.Factory;
    this._binding.factory = (context) => {
      const autofactory = () => context.container.get<T2>(serviceIdentifier);
      return autofactory;
    };
    this._binding.scope = BindingScopeEnum.Singleton;
    // @ts-ignore
    return new BindingWhenOnSyntax<T>(this._binding);
  }

  // @ts-ignore
  public toAutoNamedFactory<T2>(
    serviceIdentifier: ServiceIdentifier<T2>,
  ): BindingWhenOnSyntax<T> {
    this._binding.type = BindingTypeEnum.Factory;
    this._binding.factory = (context) => {
      return (named: unknown) =>
        context.container.getNamed<T2>(serviceIdentifier, named as string);
    };
    return new BindingWhenOnSyntax<T>(this._binding);
  }

  public toProvider<T2>(
    provider: ProviderCreator<T2>,
  ): IBindingWhenOnSyntax<T> {
    this._binding.type = BindingTypeEnum.Provider;
    this._binding.provider = provider;
    // @ts-ignore
    return new BindingWhenOnSyntax<T>(this._binding);
  }

  public toService(service: string | symbol | Newable<T> | Abstract<T>): void {
    this.toDynamicValue((context) => context.container.get<T>(service));
  }
}
