import {
  type IdChangeCallbackFn,
  deleteInstallations as firebaseDeleteInstallations,
  getId as firebaseGetId,
  getToken as firebaseGetToken,
  getInstallations,
  onIdChange,
} from "firebase/installations";
import { useEffect, useMemo } from "react";

import {
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";

/**
 * @description easily get firebase installation instance to your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
export function useFirebaseInstallations<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options) {
  const app = useFirebaseApp(options?.context);
  return useMemo(() => getInstallations(app), [app]);
}

/**
 * @description data type options for {@link useOnIdChange} hooks.
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @interface DefaultUseOnIdChangeOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 */
export interface DefaultUseOnIdChangeOptions
  extends DefaultReactFirebaseHooksOptions {}

/**
 * @description easily implement {@link onIdChange} method into your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {IdChangeCallbackFn} callback second parameter of {@link onIdChange} method
 * @param {Options} [options]
 */
export function useOnIdChange<
  Options extends DefaultUseOnIdChangeOptions = DefaultUseOnIdChangeOptions,
>(callback: IdChangeCallbackFn, options?: Options) {
  const installations = useFirebaseInstallations(options);

  useEffect(() => {
    if (installations) {
      return onIdChange(installations, callback);
    }
  }, [installations, callback]);
}

/**
 * @description get methods which depends on firebase functions installation instance to your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
export function useFirebaseInstallationsMethods<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options) {
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
