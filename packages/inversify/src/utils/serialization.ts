import { CIRCULAR_DEPENDENCY } from "../constants/error_msgs";
import type {
	Binding,
	ContainerInterface,
	Request,
	ServiceIdentifier,
	Target,
} from "../interfaces";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getServiceIdentifierAsString<T = any>(
	serviceIdentifier: ServiceIdentifier<T>,
): string {
	if (typeof serviceIdentifier === "function") {
		const _serviceIdentifier = serviceIdentifier;
		return _serviceIdentifier.name;
	}
	if (typeof serviceIdentifier === "symbol") {
		return serviceIdentifier.toString();
	}
	// string
	const _serviceIdentifier = serviceIdentifier;
	return _serviceIdentifier?.toString() ?? (_serviceIdentifier as string);
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

		// biome-ignore lint/complexity/noForEach: <explanation>
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		registeredBindings.forEach((binding: Binding<any>) => {
			// Use "Object as name of constant value injections"
			let name = "Object";

			// Use function name if available
			if (binding.implementationType !== null) {
				name = getFunctionName(binding.implementationType);
			}

			registeredBindingsList = `${registeredBindingsList}\n ${name}`;

			if (binding.constraint.metaData) {
				registeredBindingsList = `${registeredBindingsList} - ${binding.constraint.metaData}`;
			}
		});
	}

	return registeredBindingsList;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function alreadyDependencyChain<T = any>(
	request: Request,
	serviceIdentifier: ServiceIdentifier<T>,
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
	// biome-ignore lint/complexity/noForEach: <explanation>
	request.childRequests.forEach((childRequest) => {
		if (alreadyDependencyChain(childRequest, childRequest.serviceIdentifier)) {
			const services = dependencyChainToString(childRequest);
			throw new Error(`${CIRCULAR_DEPENDENCY} ${services}`);
		}
		circularDependencyToException(childRequest);
	});
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
			// biome-ignore lint/complexity/noForEach: <explanation>
			otherTags.forEach((tag) => {
				m += `${tag.toString()}\n`;
			});
		}

		return ` ${serviceIdentifierString}\n ${serviceIdentifierString} - ${m}`;
	}
	return ` ${serviceIdentifierString}`;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function getFunctionName(v: any): string {
	if (v.name) {
		return v.name;
	}
	const name = v.toString();
	const match = name.match(/^function\s*([^\s(]+)/);
	return match ? match[1] : `Anonymous function: ${name}`;
}

export function getSymbolDescription(symbol: symbol) {
	return symbol.toString().slice(7, -1);
}
