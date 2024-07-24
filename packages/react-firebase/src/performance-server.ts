import {
  type FirebasePerformance,
  type PerformanceSettings,
  type PerformanceTrace,
  trace as firebaseTrace,
  getPerformance,
  initializePerformance,
} from "firebase/performance";
import { useMemo } from "react";

import {
  type DefaultReactFirebaseServerHooksOptions,
  useFirebaseServerApp,
} from "./ServerContext";

export function useFirebasePerformance<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options): FirebasePerformance {
  const app = useFirebaseServerApp(options?.context);
  return getPerformance(app);
}

export interface DefaultUseInitializePerformanceOptions
  extends DefaultReactFirebaseServerHooksOptions {
  options?: PerformanceSettings;
}

export function useInitializePerformance<
  Options extends
    DefaultUseInitializePerformanceOptions = DefaultUseInitializePerformanceOptions,
>(opts?: Options): FirebasePerformance {
  const app = useFirebaseServerApp(opts?.context);
  return useMemo(() => initializePerformance(app, opts?.options), [app, opts]);
}

export interface DefaultUseFirebasePerformanceMethodsOptions
  extends DefaultReactFirebaseServerHooksOptions {
  performance?: FirebasePerformance;
}

export function useFirebasePerformanceMethods<
  Options extends
    DefaultUseFirebasePerformanceMethodsOptions = DefaultUseFirebasePerformanceMethodsOptions,
>(options?: Options) {
  const performanceFallback = useFirebasePerformance(options);
  const performance = options?.performance ?? performanceFallback;

  const trace = (name: string): PerformanceTrace =>
    firebaseTrace(performance, name);

  return {
    trace,
  };
}
