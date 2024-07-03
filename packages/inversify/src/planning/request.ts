import type {
	Binding,
	Context,
	Request as IRequest,
	RequestScope,
	ServiceIdentifier,
	Target,
} from "../interfaces";
import { id } from "../utils/id";

export class Request implements IRequest {
	public id: number;
	public serviceIdentifier: ServiceIdentifier;
	public parentContext: Context;
	public parentRequest: IRequest | null;
	public bindings: Binding<unknown>[];
	public childRequests: IRequest[];
	public target: Target;
	public requestScope: RequestScope | null;

	public constructor(
		serviceIdentifier: ServiceIdentifier,
		parentContext: Context,
		parentRequest: IRequest | null,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		bindings: Binding<any> | Binding<any>[],
		target: Target,
	) {
		this.id = id();
		this.serviceIdentifier = serviceIdentifier;
		this.parentContext = parentContext;
		this.parentRequest = parentRequest;
		this.target = target;
		this.childRequests = [];
		this.bindings = Array.isArray(bindings) ? bindings : [bindings];

		// Set requestScope if Request is the root request
		this.requestScope = parentRequest === null ? new Map() : null;
	}

	public addChildRequest(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		serviceIdentifier: ServiceIdentifier<any>,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		bindings: Binding<any> | Binding<any>[],
		target: Target,
	): IRequest {
		const child = new Request(
			serviceIdentifier,
			this.parentContext,
			this,
			bindings,
			target,
		);
		this.childRequests.push(child);
		return child;
	}
}
