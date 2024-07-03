import type {
	Context as ContextInterface,
	ContainerInterface,
	Plan,
	Request,
} from "../interfaces";
import { id } from "../utils/id";

export class Context implements ContextInterface {
	public id: number;
	public container: ContainerInterface;
	public plan!: Plan;
	public currentRequest!: Request;

	public constructor(container: ContainerInterface) {
		this.id = id();
		this.container = container;
	}

	public addPlan(plan: Plan) {
		this.plan = plan;
	}

	public setCurrentRequest(currentRequest: Request) {
		this.currentRequest = currentRequest;
	}
}
