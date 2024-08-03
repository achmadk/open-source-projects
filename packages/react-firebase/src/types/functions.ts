import {
  connectFunctionsEmulator,
  httpsCallable,
  httpsCallableFromURL,
} from "firebase/functions";

import type { HttpsCallableOptions } from "firebase/functions";

/**
 * @description attibutes for {@link connectFunctionsEmulator} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultConnectFunctionsEmulatorOptions
 */
export interface DefaultConnectFunctionsEmulatorOptions {
  /**
   * @description second parameter of {@link connectFunctionsEmulator} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string}
   * @memberof DefaultConnectFunctionsEmulatorOptions
   */
  host: string;

  /**
   * @description third parameter of {@link connectFunctionsEmulator} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {number}
   * @memberof DefaultConnectFunctionsEmulatorOptions
   */
  port: number;
}

/**
 * @description attributes for {@link httpsCallable} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultHttpsCallableOptions
 */
export interface DefaultHttpsCallableOptions {
  /**
   * @description second parameter of {@link httpsCallable} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string}
   * @memberof DefaultHttpsCallableOptions
   */
  name: string;

  /**
   * @description third parameter of {@link httpsCallable} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {HttpsCallableOptions}
   * @memberof DefaultHttpsCallableOptions
   */
  options?: HttpsCallableOptions;
}

/**
 * @description attributes for {@link httpsCallableFromURL} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultHttpsCallableFromURLOptions
 */
export interface DefaultHttpsCallableFromURLOptions {
  /**
   * @description second parameter of {@link httpsCallableFromURL} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string}
   * @memberof DefaultHttpsCallableFromURLOptions
   */
  url: string;

  /**
   * @description third parameter of {@link httpsCallableFromURL} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {HttpsCallableOptions}
   * @memberof DefaultHttpsCallableFromURLOptions
   */
  options?: HttpsCallableOptions;
}
