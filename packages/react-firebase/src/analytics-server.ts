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
import { useMemo } from "react";

import {
  type DefaultReactFirebaseServerHooksOptions,
  useFirebaseServerApp,
} from "./ServerContext";

import type {
  LogEventOptions,
  SetUserIDOptions,
  SetUserPropertiesOptions,
} from "./types";

export function useFirebaseAnalytics<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options) {
  const app = useFirebaseServerApp(options?.context);
  return getAnalytics(app);
}

export interface DefaultUseInitializeAnalyticsOptions
  extends DefaultReactFirebaseServerHooksOptions {
  options?: AnalyticsSettings;
}

export function useInitializeAnalytics<
  Options extends
    DefaultUseInitializeAnalyticsOptions = DefaultUseInitializeAnalyticsOptions,
>(opts?: Options) {
  const app = useFirebaseServerApp(opts?.context);
  return useMemo(() => initializeAnalytics(app, opts?.options), [app, opts]);
}

export interface DefaultUseFirebaseAnalyticsMethodsOptions
  extends DefaultReactFirebaseServerHooksOptions {
  analytics?: Analytics;
}

export function useFirebaseAnalyticsMethods<
  Options extends
    DefaultUseFirebaseAnalyticsMethodsOptions = DefaultUseFirebaseAnalyticsMethodsOptions,
>(opts?: Options) {
  const analyticsfallback = useFirebaseAnalytics(opts);
  const analytics = opts?.analytics ?? analyticsfallback;

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
