import { CIRCULAR_DEPENDENCY_IN_FACTORY } from "../constants/error_msgs";
import { BindingTypeEnum } from "../constants/literal_types";
import type {
  Binding,
  BindingActivation,
  ContainerInterface,
  Context,
  FactoryTypeFunction,
  Lookup,
  Newable,
  Request,
  RequestScope,
  ServiceIdentifier,
} from "../interfaces/interfaces";
import { getBindingDictionary } from "../planning/planner";
import { saveToScope, tryGetFromScope } from "../scope";
import { ensureFullyBound, getFactoryDetails, isPromise } from "../utils";
import { tryAndThrowErrorIfStackOverflow } from "../utils/exceptions";
import { resolveInstance } from "./instantiation";

const _resolveRequest =
  <T>(requestScope: RequestScope) =>
  (request: Request): undefined | T | Promise<T> | (T | Promise<T>)[] => {
    request.parentContext.setCurrentRequest(request);

    const bindings = request.bindings;
    const childRequests = request.childRequests;

    const targetIsAnArray = request.target?.isArray();

    const targetParentIsNotAnArray =
      !request.parentRequest ||
      !request.parentRequest.target ||
      !request.target ||
      !request.parentRequest.target.matchesArray(
        request.target.serviceIdentifier,
      );

    if (targetIsAnArray && targetParentIsNotAnArray) {
      // Create an array instead of creating an instance
      return childRequests.map((childRequest: Request) => {
        const _f = _resolveRequest(requestScope);
        return _f(childRequest) as T | Promise<T>;
      });
    }
    if (request.target.isOptional() && bindings.length === 0) {
      return undefined;
    }

    const binding = bindings[0];

    return _resolveBinding<T>(
      requestScope,
      request,
      binding as unknown as Binding<T>,
    );
  };

const _resolveFactoryFromBinding = <T>(
  binding: Binding<T>,
  context: Context,
): T | Promise<T> => {
  const factoryDetails = getFactoryDetails(binding);
  return tryAndThrowErrorIfStackOverflow(
    () =>
      (factoryDetails.factory as FactoryTypeFunction<T>).bind(binding)(context),
    () =>
      new Error(
        CIRCULAR_DEPENDENCY_IN_FACTORY(
          factoryDetails.factoryType,
          context.currentRequest.serviceIdentifier.toString(),
        ),
      ),
  );
};

const _getResolvedFromBinding = <T = unknown>(
  requestScope: RequestScope,
  request: Request,
  binding: Binding<T>,
): T | Promise<T> => {
  const childRequests = request.childRequests;

  ensureFullyBound(binding);

  switch (binding.type) {
    case BindingTypeEnum.ConstantValue:
    case BindingTypeEnum.Function:
      return binding.cache as T | Promise<T>;
    case BindingTypeEnum.Constructor:
      return binding.implementationType as T;
    case BindingTypeEnum.Instance:
      return resolveInstance<T>(
        binding,
        binding.implementationType as Newable<T>,
        childRequests,
        _resolveRequest<T>(requestScope),
      );
    default:
      return _resolveFactoryFromBinding(binding, request.parentContext);
  }
};

const _resolveInScope = <T>(
  requestScope: RequestScope,
  binding: Binding<T>,
  resolveFromBinding: () => T | Promise<T>,
): T | Promise<T> => {
  let result = tryGetFromScope<T>(requestScope, binding);
  if (result !== null) {
    return result;
  }
  result = resolveFromBinding();
  saveToScope(requestScope, binding, result);
  return result;
};

const _resolveBinding = <T>(
  requestScope: RequestScope,
  request: Request,
  binding: Binding<T>,
): T | Promise<T> => {
  return _resolveInScope<T>(requestScope, binding, () => {
    const result = _getResolvedFromBinding(requestScope, request, binding);
    if (isPromise(result)) {
      return result.then((resolved) =>
        _onActivation(request, binding, resolved),
      );
    }
    return _onActivation<T>(request, binding, result);
  });
};

function _onActivation<T>(
  request: Request,
  binding: Binding<T>,
  resolved: T,
): T | Promise<T> {
  let result = _bindingActivation(request.parentContext, binding, resolved);

  const containersIterator = _getContainersIterator(
    request.parentContext.container,
  );

  let container: ContainerInterface;
  let containersIteratorResult = containersIterator.next();

  do {
    container = containersIteratorResult.value;
    const context = request.parentContext;
    const serviceIdentifier = request.serviceIdentifier;
    const activationsIterator = _getContainerActivationsForService(
      container,
      serviceIdentifier,
    );

    if (isPromise(result)) {
      result = _activateContainerAsync<T>(
        activationsIterator as Iterator<BindingActivation<T>>,
        context,
        result,
      );
    } else {
      result = _activateContainer<T>(
        activationsIterator as Iterator<BindingActivation<T>>,
        context,
        result,
      );
    }

    containersIteratorResult = containersIterator.next();

    // make sure if we are currently on the container that owns the binding, not to keep looping down to child containers
  } while (
    containersIteratorResult.done !== true &&
    !getBindingDictionary(container).hasKey(request.serviceIdentifier)
  );

  return result;
}

const _bindingActivation = <T>(
  context: Context,
  binding: Binding<T>,
  previousResult: T,
): T | Promise<T> => {
  // use activation handler if available
  if (typeof binding.onActivation === "function") {
    return binding.onActivation(context, previousResult);
  }
  return previousResult;
};

const _activateContainer = <T>(
  activationsIterator: Iterator<BindingActivation<T>>,
  context: Context,
  initialResult: T,
): T | Promise<T> => {
  let activation = activationsIterator.next();
  let result = initialResult;

  while (!activation.done) {
    result = activation.value(context, result) as T;

    if (isPromise<T>(result)) {
      return _activateContainerAsync(activationsIterator, context, result);
    }

    activation = activationsIterator.next();
  }

  return result;
};

const _activateContainerAsync = async <T>(
  activationsIterator: Iterator<BindingActivation<T>>,
  context: Context,
  resultPromise: Promise<T>,
): Promise<T> => {
  let result = await resultPromise;
  let activation = activationsIterator.next();

  while (!activation.done) {
    result = await activation.value(context, result);

    activation = activationsIterator.next();
  }

  return result;
};

const _getContainerActivationsForService = <T>(
  container: ContainerInterface,
  serviceIdentifier: ServiceIdentifier<T>,
) => {
  // smell accessing _activations, but similar pattern is done in planner.getBindingDictionary()
  const activations = (
    container as unknown as { _activations: Lookup<BindingActivation<unknown>> }
  )._activations;

  return activations.hasKey(serviceIdentifier)
    ? activations.get(serviceIdentifier).values()
    : [].values();
};

const _getContainersIterator = (
  container: ContainerInterface,
): Iterator<ContainerInterface> => {
  const containersStack: ContainerInterface[] = [container];

  let parent = container.parent;

  while (parent !== null) {
    containersStack.push(parent);

    parent = parent.parent;
  }

  const getNextContainer: () => IteratorResult<ContainerInterface> = () => {
    const nextContainer = containersStack.pop();

    if (nextContainer !== undefined) {
      return { done: false, value: nextContainer };
    }
    return { done: true, value: undefined };
  };

  const containersIterator: Iterator<ContainerInterface> = {
    next: getNextContainer,
  };

  return containersIterator;
};

export function resolve<T>(
  context: Context,
): T | Promise<T> | (T | Promise<T>)[] {
  const _f = _resolveRequest<T>(
    context.plan.rootRequest.requestScope as RequestScope,
  );
  return _f(context.plan.rootRequest) as T | Promise<T> | (T | Promise<T>)[];
}
