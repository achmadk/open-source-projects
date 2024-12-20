import { getMetadata, hasMetadata } from "@abraham/reflection";
import { Binding } from "../bindings/binding";
import {
  ASYNC_UNBIND_REQUIRED,
  CANNOT_UNBIND,
  CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE,
  CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE,
  CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK,
  CONTAINER_OPTIONS_MUST_BE_AN_OBJECT,
  INVALID_MIDDLEWARE_RETURN,
  LAZY_IN_SYNC,
  NO_MORE_SNAPSHOTS_AVAILABLE,
  ON_DEACTIVATION_ERROR,
} from "../constants/error_msgs";
import { BindingScopeEnum, TargetTypeEnum } from "../constants/literal_types";
import { NAMED_TAG, PRE_DESTROY } from "../constants/metadata_keys";
import type {
  AsyncContainerModuleInterface,
  BindingActivation,
  BindingDeactivation,
  Binding as BindingInterface,
  BindingToSyntax as BindingToSyntaxInterface,
  ContainerInterface,
  ContainerModuleBase,
  ContainerModuleInterface,
  ContainerOptions,
  ContainerResolution,
  ContainerSnapshot as ContainerSnapshotInterface,
  Metadata,
  MetadataReaderInterface,
  Middleware,
  ModuleActivationStoreInterface,
  Newable,
  Next,
  NextArgs,
  ServiceIdentifier,
} from "../interfaces";
import { MetadataReader } from "../planning/metadata_reader";
import {
  createMockRequest,
  getBindingDictionary,
  plan,
} from "../planning/planner";
import { resolve } from "../resolution/resolver";
import { BindingToSyntax } from "../syntax/binding_to_syntax";
import { isPromise, isPromiseOrContainsPromise } from "../utils";
import { id } from "../utils/id";
import { getServiceIdentifierAsString } from "../utils/serialization";
import { ContainerSnapshot } from "./container_snapshot";
import { Lookup } from "./lookup";
import { ModuleActivationStore } from "./module_activation_store";

type GetArgs<T> = Omit<NextArgs<T>, "contextInterceptor" | "targetType">;

export class Container implements ContainerInterface {
  public id: number;
  public parent: ContainerInterface | null;
  public readonly options: ContainerOptions;
  private _middleware: Next | null;
  private _bindingDictionary: Lookup<BindingInterface<unknown>>;
  private _activations: Lookup<BindingActivation<unknown>>;
  private _deactivations: Lookup<BindingDeactivation<unknown>>;
  private _snapshots: ContainerSnapshotInterface[];
  private _metadataReader: MetadataReaderInterface;
  private _moduleActivationStore: ModuleActivationStoreInterface;

  public static merge(
    container1: ContainerInterface,
    container2: ContainerInterface,
    ...containers: ContainerInterface[]
  ): ContainerInterface {
    const container = new Container() as unknown as ContainerInterface;
    const targetContainers: Lookup<BindingInterface<unknown>>[] = [
      container1,
      container2,
      ...containers,
    ].map(
      (targetContainer) =>
        getBindingDictionary(targetContainer) as unknown as Lookup<
          BindingInterface<unknown>
        >,
    );
    const bindingDictionary = getBindingDictionary(container);

    function copyDictionary(
      origin: Lookup<BindingInterface<unknown>>,
      destination: Lookup<BindingInterface<unknown>>,
    ) {
      origin.traverse((_key, value) => {
        for (const binding of value) {
          destination.add(binding.serviceIdentifier, binding.clone());
        }
      });
    }

    for (const targetBindingDictionary of targetContainers) {
      copyDictionary(
        targetBindingDictionary,
        bindingDictionary as Lookup<Binding<unknown>>,
      );
    }

    return container;
  }

  public constructor(containerOptions?: ContainerOptions) {
    const options = containerOptions ?? {};
    if (typeof options !== "object") {
      throw new Error(`${CONTAINER_OPTIONS_MUST_BE_AN_OBJECT}`);
    }

    options.defaultScope ??= BindingScopeEnum.Transient;
    if (
      options.defaultScope !== BindingScopeEnum.Singleton &&
      options.defaultScope !== BindingScopeEnum.Transient &&
      options.defaultScope !== BindingScopeEnum.Request
    ) {
      throw new Error(`${CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE}`);
    }

    options.autoBindInjectable ??= false;
    if (typeof options.autoBindInjectable !== "boolean") {
      throw new Error(`${CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE}`);
    }

    options.skipBaseClassChecks ??= false;
    if (typeof options.skipBaseClassChecks !== "boolean") {
      throw new Error(`${CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK}`);
    }

    this.options = {
      autoBindInjectable: options.autoBindInjectable,
      defaultScope: options.defaultScope,
      skipBaseClassChecks: options.skipBaseClassChecks,
    };

    this.id = id();
    this._bindingDictionary = new Lookup<BindingInterface<unknown>>();
    this._snapshots = [];
    this._middleware = null;
    this._activations = new Lookup<BindingActivation<unknown>>();
    this._deactivations = new Lookup<BindingDeactivation<unknown>>();
    this.parent = null;
    this._metadataReader = new MetadataReader();
    this._moduleActivationStore = new ModuleActivationStore();
  }

  public load(...modules: ContainerModuleInterface[]) {
    const getHelpers = this._getContainerModuleHelpersFactory();

    for (const currentModule of modules) {
      const containerModuleHelpers = getHelpers(currentModule.id);

      currentModule.registry(
        // @ts-ignore
        containerModuleHelpers.bindFunction,
        containerModuleHelpers.unbindFunction,
        containerModuleHelpers.isboundFunction,
        containerModuleHelpers.rebindFunction,
        containerModuleHelpers.unbindAsyncFunction,
        containerModuleHelpers.onActivationFunction,
        containerModuleHelpers.onDeactivationFunction,
      );
    }
  }

  public async loadAsync(...modules: AsyncContainerModuleInterface[]) {
    const getHelpers = this._getContainerModuleHelpersFactory();

    for (const currentModule of modules) {
      const containerModuleHelpers = getHelpers(currentModule.id);

      await currentModule.registry(
        // @ts-ignore
        containerModuleHelpers.bindFunction,
        containerModuleHelpers.unbindFunction,
        containerModuleHelpers.isboundFunction,
        containerModuleHelpers.rebindFunction,
        containerModuleHelpers.unbindAsyncFunction,
        containerModuleHelpers.onActivationFunction,
        containerModuleHelpers.onDeactivationFunction,
      );
    }
  }

  public unload(...modules: ContainerModuleInterface[]): void {
    for (const module of modules) {
      const deactivations = this._removeModuleBindings(module.id);
      this._deactivateSingletons(deactivations);

      this._removeModuleHandlers(module.id);
    }
  }

  public async unloadAsync(
    ...modules: ContainerModuleInterface[]
  ): Promise<void> {
    for (const module of modules) {
      const deactivations = this._removeModuleBindings(module.id);
      await this._deactivateSingletonsAsync(deactivations);

      this._removeModuleHandlers(module.id);
    }
  }

  // Registers a type binding
  public bind<T>(
    serviceIdentifier: ServiceIdentifier<T>,
  ): BindingToSyntaxInterface<T> {
    const scope = this.options?.defaultScope ?? BindingScopeEnum.Transient;
    const binding = new Binding<T>(serviceIdentifier, scope);
    this._bindingDictionary.add(serviceIdentifier, binding as Binding<unknown>);
    return new BindingToSyntax<T>(binding);
  }

  public rebind<T>(
    serviceIdentifier: ServiceIdentifier<T>,
  ): BindingToSyntaxInterface<T> {
    this.unbind(serviceIdentifier);
    return this.bind(serviceIdentifier);
  }

  public async rebindAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
  ): Promise<BindingToSyntax<T>> {
    await this.unbindAsync(serviceIdentifier);
    // @ts-ignore
    return this.bind<T>(serviceIdentifier);
  }

  // Removes a type binding from the registry by its key
  public unbind(serviceIdentifier: ServiceIdentifier): void {
    if (this._bindingDictionary.hasKey(serviceIdentifier)) {
      const bindings = this._bindingDictionary.get(serviceIdentifier);

      this._deactivateSingletons(bindings);
    }

    this._removeServiceFromDictionary(serviceIdentifier);
  }

  public async unbindAsync(
    serviceIdentifier: ServiceIdentifier,
  ): Promise<void> {
    if (this._bindingDictionary.hasKey(serviceIdentifier)) {
      const bindings = this._bindingDictionary.get(serviceIdentifier);

      await this._deactivateSingletonsAsync(bindings);
    }

    this._removeServiceFromDictionary(serviceIdentifier);
  }

  // Removes all the type bindings from the registry
  public unbindAll(): void {
    this._bindingDictionary.traverse((_key, value) => {
      this._deactivateSingletons(value);
    });

    this._bindingDictionary = new Lookup<Binding<unknown>>();
  }

  public async unbindAllAsync(): Promise<void> {
    const promises: Promise<void>[] = [];

    this._bindingDictionary.traverse((_key, value) => {
      promises.push(this._deactivateSingletonsAsync(value));
    });

    await Promise.all(promises);

    this._bindingDictionary = new Lookup<Binding<unknown>>();
  }

  public onActivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    onActivation: BindingActivation<T>,
  ) {
    this._activations.add(
      serviceIdentifier,
      onActivation as BindingActivation<unknown>,
    );
  }

  public onDeactivation<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    onDeactivation: BindingDeactivation<T>,
  ) {
    this._deactivations.add(
      serviceIdentifier,
      onDeactivation as BindingDeactivation<unknown>,
    );
  }

  /**
   * @description Allows to check if there are bindings available for serviceIdentifier
   */
  public isBound(serviceIdentifier: ServiceIdentifier<unknown>): boolean {
    let bound = this._bindingDictionary.hasKey(serviceIdentifier);
    if (!bound && this.parent) {
      bound = this.parent.isBound(serviceIdentifier);
    }
    return bound;
  }

  /**
   * @description check binding dependency only in current container
   */
  public isCurrentBound<T>(serviceIdentifier: ServiceIdentifier<T>): boolean {
    return this._bindingDictionary.hasKey(serviceIdentifier);
  }

  public isBoundNamed(
    serviceIdentifier: ServiceIdentifier,
    named: string | number | symbol,
  ): boolean {
    return this.isBoundTagged(serviceIdentifier, NAMED_TAG, named);
  }

  /**
   * @description Check if a binding with a complex constraint is available without throwing a error. Ancestors are also verified.
   */
  public isBoundTagged(
    serviceIdentifier: ServiceIdentifier,
    key: string | number | symbol,
    value: unknown,
  ): boolean {
    let bound = false;

    // verify if there are bindings available for serviceIdentifier on current binding dictionary
    if (this._bindingDictionary.hasKey(serviceIdentifier)) {
      const bindings = this._bindingDictionary.get(serviceIdentifier);
      const request = createMockRequest(this, serviceIdentifier, key, value);
      bound = bindings.some((b) => b.constraint(request));
    }

    // verify if there is a parent container that could solve the request
    if (!bound && this.parent) {
      bound = this.parent.isBoundTagged(serviceIdentifier, key, value);
    }

    return bound;
  }

  public snapshot(): void {
    this._snapshots.push(
      ContainerSnapshot.of(
        this._bindingDictionary.clone(),
        this._middleware,
        this._activations.clone(),
        this._deactivations.clone(),
        this._moduleActivationStore.clone(),
      ),
    );
  }

  public restore(): void {
    const snapshot = this._snapshots.pop();
    if (snapshot === undefined) {
      throw new Error(NO_MORE_SNAPSHOTS_AVAILABLE);
    }
    // @ts-ignore
    this._bindingDictionary = snapshot.bindings;
    this._middleware = snapshot.middleware;
    // @ts-ignore
    this._activations = snapshot.activations;
    // @ts-ignore
    this._deactivations = snapshot.deactivations;
    this._middleware = snapshot.middleware;
    this._moduleActivationStore = snapshot.moduleActivationStore;
  }

  public createChild(containerOptions?: ContainerOptions): Container {
    const child = new Container(containerOptions ?? this.options);
    child.parent = this;
    return child;
  }

  public applyMiddleware(...middlewares: Middleware[]): void {
    const initial: Next = this._middleware ?? this._planAndResolve();
    this._middleware = middlewares.reduce((prev, curr) => curr(prev), initial);
  }

  public applyCustomMetadataReader(metadataReader: MetadataReader) {
    this._metadataReader = metadataReader;
  }

  /**
   * @description
   * Resolves a dependency by its runtime identifier
   * The runtime identifier must be associated with only one binding
   * use {@link getAll} when the runtime identifier is associated with multiple bindings
   */
  public get<T>(serviceIdentifier: ServiceIdentifier<T>): T {
    const getArgs = this._getNotAllArgs(serviceIdentifier, false);

    return this._getButThrowIfAsync<T>(getArgs) as T;
  }

  public async getAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
  ): Promise<T> {
    const getArgs = this._getNotAllArgs(serviceIdentifier, false);

    return this._get<T>(getArgs) as Promise<T> | T;
  }

  public getTagged<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    value: unknown,
  ): T {
    const getArgs = this._getNotAllArgs(serviceIdentifier, false, key, value);
    return this._getButThrowIfAsync<T>(getArgs) as T;
  }

  public async getTaggedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    value: unknown,
  ): Promise<T> {
    const getArgs = this._getNotAllArgs(serviceIdentifier, false, key, value);

    return this._get<T>(getArgs) as Promise<T> | T;
  }

  public getNamed<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol,
  ): T {
    return this.getTagged<T>(serviceIdentifier, NAMED_TAG, named);
  }

  public getNamedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol,
  ): Promise<T> {
    return this.getTaggedAsync<T>(serviceIdentifier, NAMED_TAG, named);
  }

  // Resolves a dependency by its runtime identifier
  // The runtime identifier can be associated with one or multiple bindings
  public getAll<T>(serviceIdentifier: ServiceIdentifier<T>): T[] {
    const getArgs = this._getAllArgs(serviceIdentifier);

    return this._getButThrowIfAsync<T>(getArgs) as T[];
  }

  public getAllAsync<T>(serviceIdentifier: ServiceIdentifier<T>): Promise<T[]> {
    const getArgs = this._getAllArgs(serviceIdentifier);

    return this._getAll(getArgs);
  }

  public getAllTagged<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    value: any,
  ): T[] {
    const getArgs = this._getNotAllArgs(serviceIdentifier, true, key, value);

    return this._getButThrowIfAsync<T>(getArgs) as T[];
  }

  public getAllTaggedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    key: string | number | symbol,
    value: unknown,
  ): Promise<T[]> {
    const getArgs = this._getNotAllArgs(serviceIdentifier, true, key, value);

    return this._getAll(getArgs);
  }

  public getAllNamed<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol,
  ): T[] {
    return this.getAllTagged<T>(serviceIdentifier, NAMED_TAG, named);
  }

  public getAllNamedAsync<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    named: string | number | symbol,
  ): Promise<T[]> {
    return this.getAllTaggedAsync<T>(serviceIdentifier, NAMED_TAG, named);
  }

  public resolve<T>(constructorFunction: Newable<T>) {
    const isBound = this.isBound(constructorFunction);
    if (!isBound) {
      this.bind<T>(constructorFunction).toSelf();
    }
    const resolved = this.get<T>(constructorFunction);
    if (!isBound) {
      this.unbind(constructorFunction);
    }
    return resolved;
  }

  private _preDestroy<T>(
    // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
    constructor: NewableFunction,
    instance: T,
  ): Promise<void> | void {
    if (hasMetadata(PRE_DESTROY, constructor)) {
      const data: Metadata = getMetadata(PRE_DESTROY, constructor) as Metadata;
      // @ts-ignore
      return (instance as InstanceType<T>)[data.value as string]?.();
    }
  }

  private _removeModuleHandlers(moduleId: number): void {
    const moduleActivationsHandlers =
      this._moduleActivationStore.remove(moduleId);

    this._activations.removeIntersection(
      moduleActivationsHandlers.onActivations,
    );
    this._deactivations.removeIntersection(
      moduleActivationsHandlers.onDeactivations,
    );
  }

  private _removeModuleBindings(moduleId: number): BindingInterface<unknown>[] {
    return this._bindingDictionary.removeByCondition(
      (binding) => binding.moduleId === moduleId,
    );
  }

  private _deactivate<T>(
    binding: Binding<T>,
    instance: T,
  ): void | Promise<void> {
    // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
    const constructor: NewableFunction =
      Object.getPrototypeOf(instance).constructor;

    try {
      if (this._deactivations.hasKey(binding.serviceIdentifier)) {
        const result = this._deactivateContainer(
          instance,
          this._deactivations.get(binding.serviceIdentifier).values(),
        );

        if (isPromise(result)) {
          return this._handleDeactivationError(
            result.then(() =>
              this._propagateContainerDeactivationThenBindingAndPreDestroyAsync(
                binding,
                instance,
                constructor,
              ),
            ),
            constructor,
          );
        }
      }

      const propagateDeactivationResult =
        this._propagateContainerDeactivationThenBindingAndPreDestroy(
          binding,
          instance,
          constructor,
        );

      if (isPromise(propagateDeactivationResult)) {
        return this._handleDeactivationError(
          propagateDeactivationResult,
          constructor,
        );
      }
    } catch (ex) {
      if (ex instanceof Error) {
        throw new Error(ON_DEACTIVATION_ERROR(constructor.name, ex.message));
      }
    }
  }

  private async _handleDeactivationError(
    asyncResult: Promise<void>,
    // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
    constructor: NewableFunction,
  ): Promise<void> {
    try {
      await asyncResult;
    } catch (ex) {
      if (ex instanceof Error) {
        throw new Error(ON_DEACTIVATION_ERROR(constructor.name, ex.message));
      }
    }
  }

  private _deactivateContainer<T>(
    instance: T,
    deactivationsIterator: IterableIterator<BindingDeactivation<unknown>>,
  ): void | Promise<void> {
    let deactivation = deactivationsIterator.next();

    while (deactivation.value) {
      const result = deactivation.value(instance);

      if (isPromise(result)) {
        return result.then(() =>
          this._deactivateContainerAsync(instance, deactivationsIterator),
        );
      }

      deactivation = deactivationsIterator.next();
    }
  }

  private async _deactivateContainerAsync<T>(
    instance: T,
    deactivationsIterator: IterableIterator<BindingDeactivation<unknown>>,
  ): Promise<void> {
    let deactivation = deactivationsIterator.next();

    while (deactivation.value) {
      await deactivation.value(instance);
      deactivation = deactivationsIterator.next();
    }
  }

  private _getContainerModuleHelpersFactory() {
    const setModuleId = (
      bindingToSyntax: BindingToSyntaxInterface<unknown>,
      moduleId: ContainerModuleBase["id"],
    ) => {
      (
        bindingToSyntax as unknown as {
          _binding: { moduleId: ContainerModuleBase["id"] };
        }
      )._binding.moduleId = moduleId;
    };

    const getBindFunction =
      (moduleId: ContainerModuleBase["id"]) =>
      (serviceIdentifier: ServiceIdentifier) => {
        const bindingToSyntax = this.bind(serviceIdentifier);
        setModuleId(bindingToSyntax, moduleId);
        return bindingToSyntax;
      };

    const getUnbindFunction = () => (serviceIdentifier: ServiceIdentifier) => {
      return this.unbind(serviceIdentifier);
    };

    const getUnbindAsyncFunction =
      () => (serviceIdentifier: ServiceIdentifier) => {
        return this.unbindAsync(serviceIdentifier);
      };

    const getIsboundFunction =
      (_moduleId: number) => (serviceIdentifier: ServiceIdentifier) => {
        return this.isBound(serviceIdentifier);
      };

    const getRebindFunction =
      (moduleId: number) => (serviceIdentifier: ServiceIdentifier) => {
        const bindingToSyntax = this.rebind(serviceIdentifier);
        setModuleId(bindingToSyntax, moduleId);
        return bindingToSyntax;
      };

    const getOnActivationFunction =
      (moduleId: ContainerModuleBase["id"]) =>
      (
        serviceIdentifier: ServiceIdentifier,
        onActivation: BindingActivation,
      ) => {
        this._moduleActivationStore.addActivation(
          moduleId,
          serviceIdentifier,
          onActivation,
        );
        this.onActivation(serviceIdentifier, onActivation);
      };

    const getOnDeactivationFunction =
      (moduleId: ContainerModuleBase["id"]) =>
      (
        serviceIdentifier: ServiceIdentifier,
        onDeactivation: BindingDeactivation,
      ) => {
        this._moduleActivationStore.addDeactivation(
          moduleId,
          serviceIdentifier,
          onDeactivation,
        );
        this.onDeactivation(serviceIdentifier, onDeactivation);
      };

    return (mId: ContainerModuleBase["id"]) => ({
      bindFunction: getBindFunction(mId),
      isboundFunction: getIsboundFunction(mId),
      onActivationFunction: getOnActivationFunction(mId),
      onDeactivationFunction: getOnDeactivationFunction(mId),
      rebindFunction: getRebindFunction(mId),
      unbindFunction: getUnbindFunction(),
      unbindAsyncFunction: getUnbindAsyncFunction(),
    });
  }

  private _getAll<T>(getArgs: GetArgs<T>): Promise<T[]> {
    return Promise.all(this._get<T>(getArgs) as (Promise<T> | T)[]);
  }

  // Prepares arguments required for resolution and
  // delegates resolution to _middleware if available
  // otherwise it delegates resolution to _planAndResolve
  private _get<T>(getArgs: GetArgs<T>): ContainerResolution<T> {
    const planAndResolveArgs: NextArgs<T> = {
      ...getArgs,
      contextInterceptor: (context) => context,
      targetType: TargetTypeEnum.Variable,
    };
    if (this._middleware) {
      const middlewareResult = this._middleware(planAndResolveArgs);
      if (middlewareResult === undefined || middlewareResult === null) {
        throw new Error(INVALID_MIDDLEWARE_RETURN);
      }
      return middlewareResult as ContainerResolution<T>;
    }

    return this._planAndResolve<T>()(planAndResolveArgs);
  }

  private _getButThrowIfAsync<T>(getArgs: GetArgs<T>): T | T[] {
    const result = this._get<T>(getArgs);

    if (isPromiseOrContainsPromise<T>(result)) {
      throw new Error(LAZY_IN_SYNC(getArgs.serviceIdentifier));
    }

    return result as T | T[];
  }

  private _getAllArgs<T>(serviceIdentifier: ServiceIdentifier<T>): GetArgs<T> {
    const getAllArgs: GetArgs<T> = {
      avoidConstraints: true,
      isMultiInject: true,
      serviceIdentifier,
    };

    return getAllArgs;
  }

  private _getNotAllArgs<T>(
    serviceIdentifier: ServiceIdentifier<T>,
    isMultiInject: boolean,
    key?: string | number | symbol,
    value?: unknown,
  ): GetArgs<T> {
    const getNotAllArgs: GetArgs<T> = {
      avoidConstraints: false,
      isMultiInject,
      serviceIdentifier,
      key,
      value,
    };

    return getNotAllArgs;
  }

  // Planner creates a plan and Resolver resolves a plan
  // one of the jobs of the Container is to links the Planner
  // with the Resolver and that is what this function is about
  private _planAndResolve<T = unknown>(): (
    args: NextArgs<T>,
  ) => ContainerResolution<T> {
    return (args: NextArgs<T>) => {
      // create a plan
      let context = plan(
        this._metadataReader,
        this,
        args.isMultiInject,
        args.targetType,
        args.serviceIdentifier,
        args.key,
        args.value,
        args.avoidConstraints,
      );

      // apply context interceptor
      context = args.contextInterceptor(context);

      // resolve plan
      const result = resolve<T>(context);
      return result;
    };
  }

  private _deactivateIfSingleton(
    binding: Binding<unknown>,
  ): Promise<void> | void {
    if (!binding.activated) {
      return;
    }

    if (isPromise(binding.cache)) {
      return binding.cache.then((resolved) =>
        this._deactivate(binding, resolved),
      );
    }

    return this._deactivate(binding, binding.cache);
  }

  private _deactivateSingletons(bindings: Binding<unknown>[]): void {
    for (const binding of bindings) {
      const result = this._deactivateIfSingleton(binding);

      if (isPromise(result)) {
        throw new Error(ASYNC_UNBIND_REQUIRED);
      }
    }
  }

  private async _deactivateSingletonsAsync(
    bindings: Binding<unknown>[],
  ): Promise<void> {
    await Promise.all(bindings.map((b) => this._deactivateIfSingleton(b)));
  }

  private _propagateContainerDeactivationThenBindingAndPreDestroy<T>(
    binding: Binding<T>,
    instance: T,
    // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
    constructor: NewableFunction,
  ): void | Promise<void> {
    if (this.parent) {
      return this._deactivate.bind(this.parent)(binding, instance);
    }
    return this._bindingDeactivationAndPreDestroy(
      binding,
      instance,
      constructor,
    );
  }

  private async _propagateContainerDeactivationThenBindingAndPreDestroyAsync<T>(
    binding: Binding<T>,
    instance: T,
    // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
    constructor: NewableFunction,
  ): Promise<void> {
    if (this.parent) {
      await this._deactivate.bind(this.parent)(binding, instance);
    } else {
      await this._bindingDeactivationAndPreDestroyAsync(
        binding,
        instance,
        constructor,
      );
    }
  }

  private _removeServiceFromDictionary(
    serviceIdentifier: ServiceIdentifier,
  ): void {
    try {
      this._bindingDictionary.remove(serviceIdentifier);
    } catch (e) {
      throw new Error(
        `${CANNOT_UNBIND} ${getServiceIdentifierAsString(serviceIdentifier)}`,
      );
    }
  }

  private _bindingDeactivationAndPreDestroy<T>(
    binding: Binding<T>,
    instance: T,
    // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
    constructor: NewableFunction,
  ): void | Promise<void> {
    if (typeof binding.onDeactivation === "function") {
      const result = binding.onDeactivation(instance);

      if (isPromise(result)) {
        return result.then(() => this._preDestroy(constructor, instance));
      }
    }

    return this._preDestroy(constructor, instance);
  }

  private async _bindingDeactivationAndPreDestroyAsync<T>(
    binding: Binding<T>,
    instance: T,
    // biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
    constructor: NewableFunction,
  ): Promise<void> {
    if (typeof binding.onDeactivation === "function") {
      await binding.onDeactivation(instance);
    }

    await this._preDestroy(constructor, instance);
  }
}
