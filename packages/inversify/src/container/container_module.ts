import type {
  AsyncContainerModuleCallBack,
  AsyncContainerModuleInterface,
  ContainerModuleCallBack,
  ContainerModuleInterface,
} from "../interfaces";
import { id } from "../utils/id";

export class ContainerModule implements ContainerModuleInterface {
  public id: number;
  public registry: ContainerModuleCallBack;

  public constructor(registry: ContainerModuleCallBack) {
    this.id = id();
    this.registry = registry;
  }
}

export class AsyncContainerModule implements AsyncContainerModuleInterface {
  public id: number;
  public registry: AsyncContainerModuleCallBack;

  public constructor(registry: AsyncContainerModuleCallBack) {
    this.id = id();
    this.registry = registry;
  }
}
