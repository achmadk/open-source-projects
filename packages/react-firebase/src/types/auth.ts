import {
  confirmPasswordReset,
  connectAuthEmulator,
  getAuth,
  initializeAuth,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
} from "firebase/auth";

import type { ActionCodeSettings, Auth } from "firebase/auth";

/**
 * @description option data type which contains only {@link auth}
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultOptionsOnlyAuth
 */
export interface DefaultOptionsOnlyAuth {
  /**
   * @description used firebase auth instance, either from {@link getAuth} or {@link initializeAuth} under the hood.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {Auth}
   * @memberof DefaultOptionsOnlyAuth
   */
  auth?: Auth;
}

/**
 * @description attributes for {@link connectAuthEmulator} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultConnectAuthEmulatorOptions
 */
export interface DefaultConnectAuthEmulatorOptions {
  /**
   * @description second parameter of {@link connectAuthEmulator} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string}
   * @memberof DefaultConnectAuthEmulatorOptions
   */
  url: string;
  /**
   */
  /**
   * @description certain attribute of the third parameter of {@link connectAuthEmulator} method.
   * @default false
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {boolean}
   * @memberof DefaultConnectAuthEmulatorOptions
   */
  disableWarnings?: boolean;
}

/**
 * @description attributes for {@link confirmPasswordReset} method
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultConfirmPasswordResetPayload
 */
export interface DefaultConfirmPasswordResetPayload {
  /**
   * @description second parameter of {@link confirmPasswordReset} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string}
   * @memberof DefaultConfirmPasswordResetPayload
   */
  confirmationCode: string;

  /**
   * @description third parameter of {@link confirmPasswordReset} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string}
   * @memberof DefaultConfirmPasswordResetPayload
   */
  newPassword: string;
}

/**
 * @description attributes for {@link sendPasswordResetEmail} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultSendPasswordResetEmailPayload
 */
export interface DefaultSendPasswordResetEmailPayload {
  /**
   * @description second parameter of {@link sendPasswordResetEmail} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string}
   * @memberof DefaultSendPasswordResetEmailPayload
   */
  email: string;

  /**
   * @description third parameter of {@link sendPasswordResetEmail} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {ActionCodeSettings}
   * @memberof DefaultSendPasswordResetEmailPayload
   */
  actionCodeSettings?: ActionCodeSettings;
}

/**
 * @description attributes for {@link sendSignInLinkToEmail} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultSendSignInLinkToEmailPayload
 */
export interface DefaultSendSignInLinkToEmailPayload {
  /**
   * @description second parameter of {@link sendSignInLinkToEmail} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string}
   * @memberof DefaultSendSignInLinkToEmailPayload
   */
  email: string;

  /**
   * @description third parameter of {@link sendSignInLinkToEmail} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {ActionCodeSettings}
   * @memberof DefaultSendSignInLinkToEmailPayload
   */
  actionCodeSettings: ActionCodeSettings;
}
