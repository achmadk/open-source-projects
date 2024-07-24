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
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";

export interface DefaultUseInitializeAppCheckOptions
  extends DefaultReactFirebaseHooksOptions {
  options: AppCheckOptions;
}

export function useInitializeAppCheck<
  Options extends
    DefaultUseInitializeAppCheckOptions = DefaultUseInitializeAppCheckOptions,
>(opts: Options): AppCheck {
  const app = useFirebaseApp(opts?.context);
  const appCheck = useMemo(
    () => firebaseInitializeAppCheck(app, opts.options),
    [app, opts],
  );

  return appCheck;
}

export function useOnTokenChanged<
  Options extends
    DefaultUseInitializeAppCheckOptions = DefaultUseInitializeAppCheckOptions,
>(callback: PartialObserver<AppCheckTokenResult>, options: Options) {
  const appCheck = useInitializeAppCheck(options);

  useEffect(() => {
    if (appCheck) {
      return onTokenChanged(appCheck, callback);
    }
  }, [appCheck, callback]);
}

export function useFirebaseAppCheckMethods<
  Options extends
    DefaultUseInitializeAppCheckOptions = DefaultUseInitializeAppCheckOptions,
>(options: Options) {
  const appCheck = useInitializeAppCheck(options);

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
