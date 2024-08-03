import {
  connectFunctionsEmulator as firebaseConnectFunctionsEmulator,
  httpsCallable as firebaseHttpsCallable,
  httpsCallableFromURL as firebaseHttpsCallableFromURL,
  getFunctions,
} from "firebase/functions";

import { useMemo } from "react";
import {
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";
import type {
  DefaultConnectFunctionsEmulatorOptions,
  DefaultHttpsCallableFromURLOptions,
  DefaultHttpsCallableOptions,
} from "./types";

/**
 * @description data type options for {@link useFirebaseFunctions} hooks
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @interface DefaultUseFirebaseFunctionsOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 */
export interface DefaultUseFirebaseFunctionsOptions
  extends DefaultReactFirebaseHooksOptions {
  /**
   * @description second parameter of {@link getFunctions} method
   * @author Achmad Kurnianto
   * @date 02/08/2024
   * @type {string}
   * @memberof DefaultUseFirebaseFunctionsOptions
   */
  regionOrCustomDomain?: string;
}

/**
 * @description easily get your firebase functions instance for your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
export function useFirebaseFunctions<
  Options extends
    DefaultUseFirebaseFunctionsOptions = DefaultUseFirebaseFunctionsOptions,
>(options?: Options) {
  const app = useFirebaseApp(options?.context);
  return useMemo(
    () => getFunctions(app, options?.regionOrCustomDomain),
    [app, options],
  );
}

/**
 * @description get methods which depends on firebase functions instance to your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
export function useFirebaseFunctionsMethods<
  Options extends
    DefaultUseFirebaseFunctionsOptions = DefaultUseFirebaseFunctionsOptions,
>(options?: Options) {
  const functions = useFirebaseFunctions(options);

  const connectFunctionsEmulator = <
    Options extends
      DefaultConnectFunctionsEmulatorOptions = DefaultConnectFunctionsEmulatorOptions,
  >(
    opts: Options,
  ) => {
    const { host, port } = opts;
    return firebaseConnectFunctionsEmulator(functions, host, port);
  };

  const httpsCallable = <
    RequestData = unknown,
    ResponseData = unknown,
    Options extends DefaultHttpsCallableOptions = DefaultHttpsCallableOptions,
  >(
    opts: Options,
  ) => {
    const { name, options: httpsCallableOptions } = opts;
    return firebaseHttpsCallable<RequestData, ResponseData>(
      functions,
      name,
      httpsCallableOptions,
    );
  };

  const httpsCallableFromURL = <
    RequestData = unknown,
    ResponseData = unknown,
    Options extends
      DefaultHttpsCallableFromURLOptions = DefaultHttpsCallableFromURLOptions,
  >(
    opts: Options,
  ) => {
    const { url, options: httpsCallableFromURLOptions } = opts;
    return firebaseHttpsCallableFromURL<RequestData, ResponseData>(
      functions,
      url,
      httpsCallableFromURLOptions,
    );
  };

  return {
    connectFunctionsEmulator,
    httpsCallable,
    httpsCallableFromURL,
  };
}
