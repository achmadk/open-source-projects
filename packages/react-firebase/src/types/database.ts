import { connectDatabaseEmulator } from "firebase/database";

import type { EmulatorMockTokenOptions } from "firebase/database";

/**
 * @description attributes for {@link connectDatabaseEmulator} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface ConnectDatabaseEmulatorOptions
 */
export interface ConnectDatabaseEmulatorOptions {
  /**
   * @description second parameter of {@link connectDatabaseEmulator} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string}
   * @memberof ConnectDatabaseEmulatorOptions
   */
  host: string;

  /**
   * @description third parameter of {@link connectDatabaseEmulator} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {number}
   * @memberof ConnectDatabaseEmulatorOptions
   */
  port: number;

  /**
   * @description fourth parameter of {@link connectDatabaseEmulator} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {{
   *     mockUserToken?: EmulatorMockTokenOptions;
   *   }}
   * @memberof ConnectDatabaseEmulatorOptions
   */
  options?: {
    mockUserToken?: EmulatorMockTokenOptions;
  };
}
