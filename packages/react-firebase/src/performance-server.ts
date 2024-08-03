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
import type { DefaultOptionsOnlyPerformance } from "./types";

export function useFirebasePerformance<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options): FirebasePerformance {
  const app = useFirebaseServerApp(options?.context);
  return useMemo(() => getPerformance(app), [app]);
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

/**
 * @description data type options for {@link useFirebasePerformanceMethods} hooks
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @interface DefaultUseFirebasePerformanceMethodsOptions
 * @extends {DefaultReactFirebaseServerHooksOptions}
 * @extends {DefaultOptionsOnlyPerformance}
 */
export interface DefaultUseFirebasePerformanceMethodsOptions
  extends DefaultReactFirebaseServerHooksOptions,
    DefaultOptionsOnlyPerformance {}

/**
 * @description get methods which depends on firebase performance instance
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
export function useFirebasePerformanceMethods<
  Options extends
    DefaultUseFirebasePerformanceMethodsOptions = DefaultUseFirebasePerformanceMethodsOptions,
>(options?: Options) {
  const performance = options?.performance ?? useFirebasePerformance(options);

  const trace = (name: string): PerformanceTrace =>
    firebaseTrace(performance, name);

  return {
    trace,
  };
}
