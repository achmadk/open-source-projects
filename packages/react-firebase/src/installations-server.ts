import {
  type IdChangeCallbackFn,
  deleteInstallations as firebaseDeleteInstallations,
  getId as firebaseGetId,
  getToken as firebaseGetToken,
  getInstallations,
  onIdChange,
} from "firebase/installations";
import { useEffect } from "react";

import {
  type DefaultReactFirebaseServerHooksOptions,
  useFirebaseServerApp,
} from "./ServerContext";

export function useFirebaseInstallations<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options) {
  const app = useFirebaseServerApp(options?.context);
  return getInstallations(app);
}

export interface DefaultUseOnIdChangeOptions
  extends DefaultReactFirebaseServerHooksOptions {
  callback: IdChangeCallbackFn;
}

export function useOnIdChange<
  Options extends DefaultUseOnIdChangeOptions = DefaultUseOnIdChangeOptions,
>(options: Options) {
  const { callback, ...useFirebaseInstallationsOptions } = options;
  const installations = useFirebaseInstallations(
    useFirebaseInstallationsOptions,
  );

  useEffect(() => {
    if (installations) {
      return onIdChange(installations, callback);
    }
  }, [installations, callback]);
}

export function useFirebaseInstallationsMethods<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options: Options) {
  const installations = useFirebaseInstallations(options);

  const deleteInstallations = async () =>
    await firebaseDeleteInstallations(installations);

  const getId = async () => await firebaseGetId(installations);

  const getToken = async (forceRefresh?: boolean) =>
    await firebaseGetToken(installations, forceRefresh);

  return {
    deleteInstallations,
    getId,
    getToken,
  };
}
