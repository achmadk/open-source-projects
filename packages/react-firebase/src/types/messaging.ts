import type { MessagePayload, NextFn, Observer } from "firebase/messaging";

export type DefaultNextOrObserver<
  Payload extends MessagePayload = MessagePayload,
> = NextFn<Payload> | Observer<Payload>;
