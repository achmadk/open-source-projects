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
  useFirebaseApp,
} from "./Context";

import { useMemo } from "react";
import type {
  LogEventOptions,
  SetUserIDOptions,
  SetUserPropertiesOptions,
} from "./types";

/**
 * Description placeholder
 *
 * @export
 * @template {DefaultReactFirebaseHooksOptions} [Options=DefaultReactFirebaseHooksOptions]
 * @param {?Options} [options]
 * @returns {Analytics}
 */
export function useFirebaseAnalytics<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options): Analytics {
  const app = useFirebaseApp(options?.context);
  return getAnalytics(app);
}

/**
 * Description placeholder
 *
 * @export
 * @interface DefaultUseInitializeAnalyticsOptions
 * @typedef {DefaultUseInitializeAnalyticsOptions}
 * @extends {DefaultReactFirebaseHooksOptions}
 */
export interface DefaultUseInitializeAnalyticsOptions
  extends DefaultReactFirebaseHooksOptions {
  options?: AnalyticsSettings;
}

/**
 * Description placeholder
 *
 * @export
 * @template {DefaultUseInitializeAnalyticsOptions} [Options=DefaultUseInitializeAnalyticsOptions]
 * @param {?Options} [opts]
 * @returns {Analytics}
 */
export function useInitializeAnalytics<
  Options extends
    DefaultUseInitializeAnalyticsOptions = DefaultUseInitializeAnalyticsOptions,
>(opts?: Options): Analytics {
  const app = useFirebaseApp(opts?.context);
  return useMemo(() => initializeAnalytics(app, opts?.options), [app, opts]);
}

export interface DefaultUseFirebaseAnalyticsMethodsOptions
  extends DefaultReactFirebaseHooksOptions {
  analytics?: Analytics;
}

/* istanbul ignore next */
export function useFirebaseAnalyticsMethods<
  Options extends
    DefaultUseFirebaseAnalyticsMethodsOptions = DefaultUseFirebaseAnalyticsMethodsOptions,
>(options?: Options) {
  const analyticsFallback = useFirebaseAnalytics(options);
  const analytics = options?.analytics ?? analyticsFallback;

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
    const { id, options: setUserIDOptions } = opts;
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
