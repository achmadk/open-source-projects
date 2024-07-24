import type { Context, Plan as IPlan, Request } from "../interfaces";

export class Plan implements IPlan {
  public parentContext: Context;
  public rootRequest: Request;

  public constructor(parentContext: Context, rootRequest: Request) {
    this.parentContext = parentContext;
    this.rootRequest = rootRequest;
  }
}
