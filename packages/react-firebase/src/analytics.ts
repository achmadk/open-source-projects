import {
  type Analytics,
  type AnalyticsSettings,
  getGoogleAnalyticsClientId as firebaseGetGoogleAnalyticsClientId,
  logEvent as firebaseLogEvent,
  setAnalyticsCollectionEnabled as firebaseSetAnalyticsCollectionEnabled,
  setUserId as firebaseSetUserId,
  setUserProperties as firebaseSetUserProperties,
  getAnalytics,
  initializeAnalytics,
} from "firebase/analytics";

import {
  type DefaultReactFirebaseHooksOptions,
  FirebaseProvider,
  useFirebaseApp,
} from "./Context";

import { useMemo } from "react";
import type {
  DefaultOptionsOnlyAnalytics,
  LogEventOptions,
  SetUserIDOptions,
  SetUserPropertiesOptions,
} from "./types";

/**
 * @description get firebase analytics instance easily after add {@link FirebaseProvider} and your firebase app configurations to the top of your react app.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}  {Analytics}
 */
export function useFirebaseAnalytics<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options): Analytics {
  const app = useFirebaseApp(options?.context);
  return useMemo(() => getAnalytics(app), [app]);
}

/**
 * @description provided options when using {@link useInitializeAnalytics}
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultUseInitializeAnalyticsOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 */
export interface DefaultUseInitializeAnalyticsOptions
  extends DefaultReactFirebaseHooksOptions {
  /**
   * @description second parameter when using firebase {@link initializeAnalytics} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {AnalyticsSettings}
   * @memberof DefaultUseInitializeAnalyticsOptions
   */
  options?: AnalyticsSettings;
}

/**
 * @description create your own firebase analytics instance with the help of firebase {@link initializeAnalytics} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @template Options
 * @param {Options} [opts]
 * @returns {*}  {Analytics}
 */
export function useInitializeAnalytics<
  Options extends
    DefaultUseInitializeAnalyticsOptions = DefaultUseInitializeAnalyticsOptions,
>(opts?: Options): Analytics {
  const app = useFirebaseApp(opts?.context);
  return useMemo(() => initializeAnalytics(app, opts?.options), [app, opts]);
}

/**
 * @description options data type of {@link useFirebaseAnalyticsMethods}. Please note that {@link analytics} and {@link context} attribute
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultUseFirebaseAnalyticsMethodsOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 * @extends {DefaultOptionsOnlyAnalytics}
 */
export interface DefaultUseFirebaseAnalyticsMethodsOptions
  extends DefaultReactFirebaseHooksOptions,
    DefaultOptionsOnlyAnalytics {}

/**
 * @description easily use firebase analytics methods which depends on its instance inside your react app.
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
/* istanbul ignore next */
export function useFirebaseAnalyticsMethods<
  Options extends
    DefaultUseFirebaseAnalyticsMethodsOptions = DefaultUseFirebaseAnalyticsMethodsOptions,
>(options?: Options) {
  const analytics = options?.analytics ?? useFirebaseAnalytics(options);

  const getGoogleAnalyticsClientId = async () =>
    await firebaseGetGoogleAnalyticsClientId(analytics);

  const logEvent = <
    EventName extends string = string,
    Options extends LogEventOptions<EventName> = LogEventOptions<EventName>,
  >(
    opts: Options,
  ) => {
    const { eventName, eventParams, options: logEventOptions } = opts;
    return firebaseLogEvent(analytics, eventName, eventParams, logEventOptions);
  };

  const setAnalyticsCollectionEnabled = (enabled: boolean) =>
    firebaseSetAnalyticsCollectionEnabled(analytics, enabled);

  const setUserId = <Options extends SetUserIDOptions = SetUserIDOptions>(
    opts: Options,
  ) => {
    const { id = null, options: setUserIDOptions } = opts;
    return firebaseSetUserId(analytics, id, setUserIDOptions);
  };

  const setUserProperties = <
    Options extends SetUserPropertiesOptions = SetUserPropertiesOptions,
  >(
    opts: Options,
  ) => {
    const { properties, options: setUserPropertiesOptions } = opts;
    return firebaseSetUserProperties(
      analytics,
      properties,
      setUserPropertiesOptions,
    );
  };

  return {
    getGoogleAnalyticsClientId,
    logEvent,
    setAnalyticsCollectionEnabled,
    setUserId,
    setUserProperties,
  };
}
