import { CIRCULAR_DEPENDENCY } from "../constants/error_msgs";
import type {
  Binding,
  ContainerInterface,
  Request,
  ServiceIdentifier,
  Target,
} from "../interfaces";

export function getServiceIdentifierAsString(
  serviceIdentifier: ServiceIdentifier,
): string {
  if (typeof serviceIdentifier === "function") {
    return serviceIdentifier.name;
  }
  if (typeof serviceIdentifier === "symbol") {
    return serviceIdentifier.toString();
  }
  // string
  return serviceIdentifier?.toString() ?? serviceIdentifier;
}

export function listRegisteredBindingsForServiceIdentifier(
  container: ContainerInterface,
  serviceIdentifier: string,
  getBindings: <T>(
    container: ContainerInterface,
    serviceIdentifier: ServiceIdentifier<T>,
  ) => Binding<T>[],
): string {
  let registeredBindingsList = "";
  const registeredBindings = getBindings(container, serviceIdentifier);

  if (registeredBindings.length !== 0) {
    registeredBindingsList = "\nRegistered bindings:";

    for (const binding of registeredBindings) {
      // Use "Object as name of constant value injections"
      let name = "Object";

      // Use function name if available
      if (binding.implementationType !== null) {
        name = getFunctionName(
          binding.implementationType as { name: string | null },
        );
      }

      registeredBindingsList = `${registeredBindingsList}\n ${name}`;

      if (binding.constraint.metaData) {
        registeredBindingsList = `${registeredBindingsList} - ${binding.constraint.metaData}`;
      }
    }
  }

  return registeredBindingsList;
}

function alreadyDependencyChain(
  request: Request,
  serviceIdentifier: ServiceIdentifier,
): boolean {
  if (request.parentRequest === null) {
    return false;
  }
  if (request.parentRequest.serviceIdentifier === serviceIdentifier) {
    return true;
  }
  return alreadyDependencyChain(request.parentRequest, serviceIdentifier);
}

function dependencyChainToString(request: Request) {
  function _createStringArr(req: Request, result: string[] = []): string[] {
    const serviceIdentifier = getServiceIdentifierAsString(
      req.serviceIdentifier,
    );
    result.push(serviceIdentifier);
    if (req.parentRequest !== null) {
      return _createStringArr(req.parentRequest, result);
    }
    return result;
  }

  const stringArr = _createStringArr(request);
  return stringArr.reverse().join(" --> ");
}

export function circularDependencyToException(request: Request) {
  for (const childRequest of request.childRequests) {
    if (alreadyDependencyChain(childRequest, childRequest.serviceIdentifier)) {
      const services = dependencyChainToString(childRequest);
      throw new Error(`${CIRCULAR_DEPENDENCY} ${services}`);
    }
    circularDependencyToException(childRequest);
  }
}

export function listMetadataForTarget(
  serviceIdentifierString: string,
  target: Target,
): string {
  if (target.isTagged() || target.isNamed()) {
    let m = "";

    const namedTag = target.getNamedTag();
    const otherTags = target.getCustomTags();

    if (namedTag !== null) {
      m += `${namedTag.toString()}\n`;
    }

    if (otherTags !== null) {
      for (const tag of otherTags) {
        m += `${tag.toString()}\n`;
      }
    }

    return ` ${serviceIdentifierString}\n ${serviceIdentifierString} - ${m}`;
  }
  return ` ${serviceIdentifierString}`;
}

export function getFunctionName(v: { name: string | null }): string {
  if (v.name) {
    return v.name;
  }
  const name = v.toString();
  const match = name.match(/^function\s*([^\s(]+)/);
  return match ? match[1] : `Anonymous function: ${name}`;
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export function getSymbolDescription(symbol: Symbol) {
  return symbol.toString().slice(7, -1);
}
