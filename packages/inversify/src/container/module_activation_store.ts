import type {
  BindingActivation,
  BindingDeactivation,
  ModuleActivationHandlers,
  ModuleActivationStoreInterface,
  ServiceIdentifier,
} from "../interfaces";
import { Lookup } from "./lookup";

export class ModuleActivationStore implements ModuleActivationStoreInterface {
  private _map = new Map<number, ModuleActivationHandlers>();

  public remove(moduleId: number): ModuleActivationHandlers {
    if (this._map.has(moduleId)) {
      const handlers = this._map.get(moduleId);
      this._map.delete(moduleId);
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      return handlers!;
    }
    return this._getEmptyHandlersStore();
  }

  public addDeactivation(
    moduleId: number,
    serviceIdentifier: ServiceIdentifier<unknown>,
    onDeactivation: BindingDeactivation<unknown>,
  ) {
    this._getModuleActivationHandlers(moduleId).onDeactivations.add(
      serviceIdentifier,
      onDeactivation,
    );
  }

  public addActivation(
    moduleId: number,
    serviceIdentifier: ServiceIdentifier<unknown>,
    onActivation: BindingActivation<unknown>,
  ) {
    this._getModuleActivationHandlers(moduleId).onActivations.add(
      serviceIdentifier,
      onActivation,
    );
  }

  public clone(): ModuleActivationStore {
    const clone = new ModuleActivationStore();

    this._map.forEach((handlersStore, moduleId) => {
      clone._map.set(moduleId, {
        onActivations: handlersStore.onActivations.clone(),
        onDeactivations: handlersStore.onDeactivations.clone(),
      });
    });

    return clone;
  }

  private _getModuleActivationHandlers(
    moduleId: number,
  ): ModuleActivationHandlers {
    let moduleActivationHandlers: ModuleActivationHandlers | undefined =
      this._map.get(moduleId);

    if (moduleActivationHandlers === undefined) {
      moduleActivationHandlers = this._getEmptyHandlersStore();
      this._map.set(moduleId, moduleActivationHandlers);
    }

    return moduleActivationHandlers;
  }

  private _getEmptyHandlersStore(): ModuleActivationHandlers {
    const handlersStore: ModuleActivationHandlers = {
      onActivations: new Lookup(),
      onDeactivations: new Lookup(),
    };
    return handlersStore;
  }
}
