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
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";

export function useFirebaseMessaging<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options): Messaging {
  const app = useFirebaseApp(options?.context);
  return getMessaging(app);
}

export interface DefaultUseFirebaseMessagingOnMessageOptions
  extends DefaultReactFirebaseHooksOptions {
  nextOrObserver: NextFn<MessagePayload> | Observer<MessagePayload>;
}

export function useFirebaseMessagingOnMessage<
  Options extends
    DefaultUseFirebaseMessagingOnMessageOptions = DefaultUseFirebaseMessagingOnMessageOptions,
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
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
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
