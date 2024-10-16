import type {
  Binding,
  BindingActivation,
  BindingDeactivation,
  ContainerSnapshot as ContainerSnapshotInterface,
  Lookup,
  ModuleActivationStoreInterface,
  Next,
} from "../interfaces";

export class ContainerSnapshot implements ContainerSnapshotInterface {
  public bindings!: Lookup<Binding<unknown>>;
  public activations!: Lookup<BindingActivation<unknown>>;
  public deactivations!: Lookup<BindingDeactivation<unknown>>;
  public middleware!: Next | null;
  public moduleActivationStore!: ModuleActivationStoreInterface;

  public static of(
    bindings: Lookup<Binding<unknown>>,
    middleware: Next | null,
    activations: Lookup<BindingActivation<unknown>>,
    deactivations: Lookup<BindingDeactivation<unknown>>,
    moduleActivationStore: ModuleActivationStoreInterface,
  ) {
    const snapshot = new ContainerSnapshot();
    snapshot.bindings = bindings;
    snapshot.middleware = middleware;
    snapshot.deactivations = deactivations;
    snapshot.activations = activations;
    snapshot.moduleActivationStore = moduleActivationStore;
    return snapshot;
  }
}
