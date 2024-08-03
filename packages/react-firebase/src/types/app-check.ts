import type { AppCheck } from "firebase/app-check";

/**
 * @description option data type which contains only {@link appCheck}
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultOptionsOnlyAppCheck
 */
export interface DefaultOptionsOnlyAppCheck {
  /**
   * @description App Check instance
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {AppCheck}
   * @memberof DefaultOptionsOnlyAppCheck
   */
  appCheck?: AppCheck;
}
