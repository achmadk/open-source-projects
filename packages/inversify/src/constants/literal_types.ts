import type {
  BindingScopeEnumInterface,
  BindingTypeEnumInterface,
  TargetTypeEnumInterface,
} from "../interfaces";

export const BindingScopeEnum: BindingScopeEnumInterface = {
  Request: "Request",
  Singleton: "Singleton",
  Transient: "Transient",
};

export const BindingTypeEnum: BindingTypeEnumInterface = {
  ConstantValue: "ConstantValue",
  Constructor: "Constructor",
  DynamicValue: "DynamicValue",
  Factory: "Factory",
  Function: "Function",
  Instance: "Instance",
  Invalid: "Invalid",
  Provider: "Provider",
};

export const TargetTypeEnum: TargetTypeEnumInterface = {
  ClassProperty: "ClassProperty",
  ConstructorArgument: "ConstructorArgument",
  Variable: "Variable",
};
