import {
  type GetTokenOptions,
  type MessagePayload,
  type Messaging,
  deleteToken as firebaseDeleteToken,
  getToken as firebaseGetToken,
  getMessaging,
  onMessage,
} from "firebase/messaging";
import { useEffect, useMemo } from "react";

import {
  type DefaultReactFirebaseServerHooksOptions,
  useFirebaseServerApp,
} from "./ServerContext";
import type { DefaultNextOrObserver } from "./types";

/**
 * @description get firebase messaging instance for your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}  {Messaging}
 */
export function useFirebaseMessaging<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options): Messaging {
  const app = useFirebaseServerApp(options?.context);
  return useMemo(() => getMessaging(app), [app]);
}

/**
 * @description implement {@link onMessage} method easily into your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Payload
 * @template Options
 * @param {DefaultNextOrObserver<Payload>} nextOrObserver second parameter of {@link onMessage} method.
 * @param {Options} options
 */
export function useOnMessage<
  Payload extends MessagePayload = MessagePayload,
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(nextOrObserver: DefaultNextOrObserver<Payload>, options: Options) {
  const messaging = useFirebaseMessaging(options);

  useEffect(() => {
    if (messaging) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return onMessage(messaging, nextOrObserver as any);
    }
  }, [messaging, nextOrObserver]);
}

/**
 * @description get methods which depends on firebase messaging installation instance to your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
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
