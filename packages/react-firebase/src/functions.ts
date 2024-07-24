import {
  connectFunctionsEmulator as firebaseConnectFunctionsEmulator,
  httpsCallable as firebaseHttpsCallable,
  httpsCallableFromURL as firebaseHttpsCallableFromURL,
  getFunctions,
} from "firebase/functions";

import {
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";
import type {
  DefaultConnectFunctionsEmulatorOptions,
  DefaultHttpsCallableFromURLOptions,
  DefaultHttpsCallableOptions,
} from "./types";

export interface DefaultUseFirebaseFunctionsOptions
  extends DefaultReactFirebaseHooksOptions {
  regionOrCustomDomain?: string;
}

export function useFirebaseFunctions<
  Options extends
    DefaultUseFirebaseFunctionsOptions = DefaultUseFirebaseFunctionsOptions,
>(options?: Options) {
  const app = useFirebaseApp(options?.context);
  return getFunctions(app, options?.regionOrCustomDomain);
}

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
