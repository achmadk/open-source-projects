import type { ActionCodeSettings } from "firebase/auth";

export interface DefaultConnectAuthEmulatorOptions {
  url: string;
  /**
   * @default false
   */
  disableWarnings?: boolean;
}

export interface DefaultConfirmPasswordResetPayload {
  confirmationCode: string;
  newPassword: string;
}

export interface DefaultSendPasswordResetEmailPayload {
  email: string;
  actionCodeSettings?: ActionCodeSettings;
}

export interface DefaultSendSignInLinkToEmailPayload {
  email: string;
  actionCodeSettings: ActionCodeSettings;
}
