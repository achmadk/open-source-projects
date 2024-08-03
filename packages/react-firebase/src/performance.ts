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
import type { DefaultOptionsOnlyPerformance } from "./types";

/**
 * @description get firebase performance instance instantly in your react app.
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}  {FirebasePerformance}
 */
export function useFirebasePerformance<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options): FirebasePerformance {
  const app = useFirebaseApp(options?.context);
  return useMemo(() => getPerformance(app), [app]);
}

/**
 * @description data type options for {@link useInitializePerformance} hooks
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @interface DefaultUseInitializePerformanceOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 */
export interface DefaultUseInitializePerformanceOptions
  extends DefaultReactFirebaseHooksOptions {
  /**
   * @description second parameter of {@link initializePerformance} method
   * @author Achmad Kurnianto
   * @date 02/08/2024
   * @type {PerformanceSettings}
   * @memberof DefaultUseInitializePerformanceOptions
   */
  options?: PerformanceSettings;
}

/**
 * @description create your own firebase performance instance with {@link initializePerformance} method under the hood.
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [opts]
 * @returns {*}  {FirebasePerformance}
 */
export function useInitializePerformance<
  Options extends
    DefaultUseInitializePerformanceOptions = DefaultUseInitializePerformanceOptions,
>(opts?: Options): FirebasePerformance {
  const app = useFirebaseApp(opts?.context);
  return useMemo(() => initializePerformance(app, opts?.options), [app, opts]);
}

/**
 * @description data type options for {@link useFirebasePerformanceMethods} hooks
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @interface DefaultUseFirebasePerformanceMethodsOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 * @extends {DefaultOptionsOnlyPerformance}
 */
export interface DefaultUseFirebasePerformanceMethodsOptions
  extends DefaultReactFirebaseHooksOptions,
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
  const performanceFallback = useFirebasePerformance(options);
  const performance = options?.performance ?? performanceFallback;

  const trace = (name: string): PerformanceTrace =>
    firebaseTrace(performance, name);

  return {
    trace,
  };
}
