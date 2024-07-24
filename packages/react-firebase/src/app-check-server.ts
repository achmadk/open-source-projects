import { useEffect, useMemo } from "react";

import {
  type AppCheck,
  type AppCheckOptions,
  type AppCheckTokenResult,
  type PartialObserver,
  getLimitedUseToken as firebaseGetLimitedUseToken,
  getToken as firebaseGetToken,
  initializeAppCheck as firebaseInitializeAppCheck,
  setTokenAutoRefreshEnabled as firebaseSetTokenAutoRefreshEnabled,
  onTokenChanged,
} from "firebase/app-check";

import {
  type DefaultReactFirebaseServerHooksOptions,
  useFirebaseServerApp,
} from "./ServerContext";

export interface DefaultUseFirebaseAppCheckOptions
  extends DefaultReactFirebaseServerHooksOptions {
  options: AppCheckOptions;
}

export function useFirebaseAppCheck<
  Options extends
    DefaultUseFirebaseAppCheckOptions = DefaultUseFirebaseAppCheckOptions,
>(options: Options): AppCheck {
  const app = useFirebaseServerApp(options?.context);
  const appCheck = useMemo(
    () => firebaseInitializeAppCheck(app, options.options),
    [app, options],
  );

  return appCheck;
}

export function useOnTokenChanged<
  Options extends
    DefaultUseFirebaseAppCheckOptions = DefaultUseFirebaseAppCheckOptions,
>(callback: PartialObserver<AppCheckTokenResult>, options: Options) {
  const appCheck = useFirebaseAppCheck(options);

  useEffect(() => {
    if (appCheck) {
      return onTokenChanged(appCheck, callback);
    }
  }, [appCheck, callback]);
}

export function useFirebaseAppCheckMethods<
  Options extends
    DefaultUseFirebaseAppCheckOptions = DefaultUseFirebaseAppCheckOptions,
>(options: Options) {
  const appCheck = useFirebaseAppCheck(options);

  const getLimitedUseToken = async () =>
    await firebaseGetLimitedUseToken(appCheck);

  const getToken = async (forceRefresh = false) =>
    await firebaseGetToken(appCheck, forceRefresh);

  const setTokenAutoRefreshEnabled = (value: boolean) =>
    firebaseSetTokenAutoRefreshEnabled(appCheck, value);

  return {
    getLimitedUseToken,
    getToken,
    setTokenAutoRefreshEnabled,
  };
}
