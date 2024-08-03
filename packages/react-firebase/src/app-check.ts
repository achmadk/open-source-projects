import { useEffect, useMemo } from "react";

import {
  type AppCheck,
  type AppCheckOptions,
  type AppCheckTokenResult,
  type PartialObserver,
  getLimitedUseToken as firebaseGetLimitedUseToken,
  getToken as firebaseGetToken,
  setTokenAutoRefreshEnabled as firebaseSetTokenAutoRefreshEnabled,
  initializeAppCheck,
  onTokenChanged,
} from "firebase/app-check";

import {
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";
import type { DefaultOptionsOnlyAppCheck } from "./types";

/**
 * @description options for {@link useInitializeAppCheck} hooks
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultUseInitializeAppCheckOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 */
export interface DefaultUseInitializeAppCheckOptions
  extends DefaultReactFirebaseHooksOptions {
  /**
   * @description second parameter of {@link initializeAppCheck}
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {AppCheckOptions}
   * @memberof DefaultUseInitializeAppCheckOptions
   */
  options: AppCheckOptions;
}

/**
 * @description create your own firebase app check instance with {@link initializeAppCheck} behind.
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @template Options
 * @param {Options} opts
 * @returns {*}  {AppCheck}
 */
export function useInitializeAppCheck<
  Options extends
    DefaultUseInitializeAppCheckOptions = DefaultUseInitializeAppCheckOptions,
>(opts: Options): AppCheck {
  const app = useFirebaseApp(opts?.context);
  const appCheck = useMemo(
    () => initializeAppCheck(app, opts.options),
    [app, opts],
  );

  return appCheck;
}

/**
 * @description type data for {@link useOnTokenChanged} options. {@link options} and {@link appCheck} attribute is XOR relationship.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultUseOnTokenChangedOptions
 * @extends {DefaultUseInitializeAppCheckOptions}
 * @extends {DefaultOptionsOnlyAppCheck}
 */
export interface DefaultUseOnTokenChangedOptions
  extends DefaultUseInitializeAppCheckOptions,
    DefaultOptionsOnlyAppCheck {}

/**
 * @description use firebase {@link onTokenChanged} method easily in react app
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @template Options
 * @param {PartialObserver<AppCheckTokenResult>} callback second parameter of {@link onTokenChanged} method.
 * @param {Options} options provided options for {@link useInitializeAppCheck} hooks.
 */
export function useOnTokenChanged<
  Options extends
    DefaultUseOnTokenChangedOptions = DefaultUseOnTokenChangedOptions,
>(callback: PartialObserver<AppCheckTokenResult>, opts: Options) {
  const appCheck = opts?.appCheck ?? useInitializeAppCheck(opts);

  useEffect(() => {
    if (appCheck) {
      return onTokenChanged(appCheck, callback);
    }
  }, [appCheck, callback]);
}

/**
 * @description type data of options for {@link useFirebaseAppCheckMethods}. {@link options} and {@link appCheck} attribute
 * has XOR relationship.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultUseFirebaseAppCheckMethodsOptions
 * @extends {DefaultUseInitializeAppCheckOptions}
 * @extends {DefaultOptionsOnlyAppCheck}
 */
export interface DefaultUseFirebaseAppCheckMethodsOptions
  extends DefaultUseInitializeAppCheckOptions,
    DefaultOptionsOnlyAppCheck {}

/**
 * @description data type output from {@link useFirebaseAappCheckMethods} hooks
 * @author Achmad Kurnianto
 * @date 03/08/2024
 * @export
 * @interface DefaultUseFirebaseAppCheckMethodsOutput
 */
export interface DefaultUseFirebaseAppCheckMethodsOutput {
  /**
   * @description {@link firebaseGetLimitedUseToken} but no firebase auth instance at the first parameter.
   * @author Achmad Kurnianto
   * @date 03/08/2024
   * @returns {*}  {Promise<AppCheckTokenResult>}
   * @memberof DefaultUseFirebaseAppCheckMethodsOutput
   */
  getLimitedUseToken(): Promise<AppCheckTokenResult>;

  /**
   * @description
   * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
   * @date 03/08/2024
   * @param {boolean} [forceRefresh]
   * @returns {*}  {Promise<AppCheckTokenResult>}
   * @memberof DefaultUseFirebaseAppCheckMethodsOutput
   */
  getToken(forceRefresh?: boolean): Promise<AppCheckTokenResult>;
  setTokenAutoRefreshEnabled(value: boolean): void;
}

/**
 * @description use firebase app check methods which require app check instance easily in react app.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @template Options
 * @param {Options} options provided options when use {@link useInitializeAppCheck} hooks.
 * @returns {*}
 */
export function useFirebaseAppCheckMethods<
  Options extends
    DefaultUseFirebaseAppCheckMethodsOptions = DefaultUseFirebaseAppCheckMethodsOptions,
>(opts: Options): DefaultUseFirebaseAppCheckMethodsOutput {
  const appCheck = opts?.appCheck ?? useInitializeAppCheck(opts);

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
