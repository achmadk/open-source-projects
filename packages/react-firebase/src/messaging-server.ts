import {
  type GetTokenOptions,
  type MessagePayload,
  type Messaging,
  type NextFn,
  type Observer,
  deleteToken as firebaseDeleteToken,
  getToken as firebaseGetToken,
  getMessaging,
  onMessage,
} from "firebase/messaging";
import { useEffect } from "react";

import {
  type DefaultReactFirebaseServerHooksOptions,
  useFirebaseServerApp,
} from "./ServerContext";

export function useFirebaseMessaging<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options): Messaging {
  const app = useFirebaseServerApp(options?.context);
  return getMessaging(app);
}

export interface DefaultUseOnMessageOptions
  extends DefaultReactFirebaseServerHooksOptions {
  nextOrObserver: NextFn<MessagePayload> | Observer<MessagePayload>;
}

export function useOnMessage<
  Options extends DefaultUseOnMessageOptions = DefaultUseOnMessageOptions,
>(options: Options) {
  const { nextOrObserver, ...firebaseMessagingOptions } = options;

  const messaging = useFirebaseMessaging(firebaseMessagingOptions);

  useEffect(() => {
    if (messaging) {
      return onMessage(messaging, nextOrObserver);
    }
  }, [messaging, nextOrObserver]);
}

export function useFirebaseMessagingMethods<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options) {
  const messaging = useFirebaseMessaging(options);

  const getToken = async (payload: GetTokenOptions) =>
    await firebaseGetToken(messaging, payload);

  const deleteToken = async () => await firebaseDeleteToken(messaging);

  return {
    getToken,
    deleteToken,
  };
}
