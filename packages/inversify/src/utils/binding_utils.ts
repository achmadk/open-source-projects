import { BindingTypeEnum } from "../constants";
import { INVALID_BINDING_TYPE } from "../constants/error_msgs";
import type {
  Binding,
  ContainerInterface,
  FactoryDetails,
  ServiceIdentifier,
} from "../interfaces";
import { FactoryType } from "./factory_type";
import { getServiceIdentifierAsString } from "./serialization";

export const multiBindToService =
  (container: ContainerInterface) =>
  (service: ServiceIdentifier) =>
  (...types: ServiceIdentifier[]) => {
    for (const t of types) {
      container.bind(t).toService(service);
    }
  };

export const ensureFullyBound = <T = unknown>(binding: Binding<T>): void => {
  let boundValue: unknown = null;

  switch (binding.type) {
    case BindingTypeEnum.ConstantValue:
    case BindingTypeEnum.Function:
      boundValue = binding.cache;
      break;
    case BindingTypeEnum.Constructor:
    case BindingTypeEnum.Instance:
      boundValue = binding.implementationType;
      break;
    case BindingTypeEnum.DynamicValue:
      boundValue = binding.dynamicValue;
      break;
    case BindingTypeEnum.Provider:
      boundValue = binding.provider;
      break;
    case BindingTypeEnum.Factory:
      boundValue = binding.factory;
      break;
  }
  if (boundValue === null) {
    // The user probably created a binding but didn't finish it
    // e.g. container.bind<T>("Something"); missing BindingToSyntax
    const serviceIdentifierAsString = getServiceIdentifierAsString(
      binding.serviceIdentifier,
    );
    throw new Error(`${INVALID_BINDING_TYPE} ${serviceIdentifierAsString}`);
  }
};

export const getFactoryDetails = <T = unknown>(
  binding: Binding<T>,
): FactoryDetails => {
  switch (binding.type) {
    case BindingTypeEnum.Factory:
      return { factory: binding.factory, factoryType: FactoryType.Factory };
    case BindingTypeEnum.Provider:
      return { factory: binding.provider, factoryType: FactoryType.Provider };
    case BindingTypeEnum.DynamicValue:
      return {
        factory: binding.dynamicValue,
        factoryType: FactoryType.DynamicValue,
      };
    default:
      throw new Error(`Unexpected factory type ${binding.type}`);
  }
};
