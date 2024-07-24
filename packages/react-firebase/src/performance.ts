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
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";

export function useFirebasePerformance<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options): FirebasePerformance {
  const app = useFirebaseApp(options?.context);
  return getPerformance(app);
}

export interface DefaultUseInitializePerformanceOptions
  extends DefaultReactFirebaseHooksOptions {
  options?: PerformanceSettings;
}

export function useInitializePerformance<
  Options extends
    DefaultUseInitializePerformanceOptions = DefaultUseInitializePerformanceOptions,
>(opts?: Options): FirebasePerformance {
  const app = useFirebaseApp(opts?.context);
  return useMemo(() => initializePerformance(app, opts?.options), [app, opts]);
}

export interface DefaultUseFirebasePerformanceMethodsOptions
  extends DefaultReactFirebaseHooksOptions {
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
