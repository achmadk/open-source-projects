import {
  type Auth,
  type Dependencies,
  type MultiFactorError,
  type NextOrObserver,
  type User,
  beforeAuthStateChanged,
  applyActionCode as firebaseApplyActionCode,
  checkActionCode as firebaseCheckActionCode,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  connectAuthEmulator as firebaseConnectAuthEmulator,
  getMultiFactorResolver as firebaseGetMultiFactorResolver,
  isSignInWithEmailLink as firebaseIsSignInWithEmailLink,
  revokeAccessToken as firebaseRevokeAccessToken,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  sendSignInLinkToEmail as firebaseSendSignInLinkToEmail,
  validatePassword as firebaseValidatePassword,
  getAuth,
  initializeAuth,
  onAuthStateChanged,
  onIdTokenChanged,
} from "firebase/auth";
import { useEffect, useMemo } from "react";

import {
  type DefaultReactFirebaseServerHooksOptions,
  useFirebaseServerApp,
} from "./ServerContext";
import type {
  DefaultConfirmPasswordResetPayload,
  DefaultConnectAuthEmulatorOptions,
  DefaultSendPasswordResetEmailPayload,
  DefaultSendSignInLinkToEmailPayload,
} from "./types";

export function useFirebaseAuth<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options) {
  const app = useFirebaseServerApp(options?.context);
  return getAuth(app);
}

export interface DefaultUseInitializeAuthOptions
  extends DefaultReactFirebaseServerHooksOptions {
  dependencies?: Dependencies;
}

export function useInitializeAuth<
  Options extends
    DefaultUseInitializeAuthOptions = DefaultUseInitializeAuthOptions,
>(options?: Options) {
  const app = useFirebaseServerApp(options?.context);
  return useMemo(
    () => initializeAuth(app, options?.dependencies),
    [app, options],
  );
}

export interface DefaultUseBeforeAuthStateChangedOptions
  extends DefaultReactFirebaseServerHooksOptions {
  callback: (user: User | null) => void | Promise<void>;
  onAbort?: () => void;
  auth?: Auth;
}

export function useBeforeAuthStateChanged<
  Options extends
    DefaultUseBeforeAuthStateChangedOptions = DefaultUseBeforeAuthStateChangedOptions,
>(options: Options) {
  const { callback, onAbort = undefined, ...firebaseAuthOptions } = options;
  const authFallback = useFirebaseAuth(firebaseAuthOptions);
  const auth = options?.auth ?? authFallback;

  useEffect(() => {
    if (auth) {
      return beforeAuthStateChanged(auth, callback, onAbort);
    }
  }, [auth, callback, onAbort]);
}

export interface DefaultUseOnAuthStateChangedOptions
  extends DefaultReactFirebaseServerHooksOptions {
  userObserver: NextOrObserver<User>;
  auth?: Auth;
}

export function useOnAuthStateChanged<
  Options extends
    DefaultUseOnAuthStateChangedOptions = DefaultUseOnAuthStateChangedOptions,
>(options: Options) {
  const { userObserver, ...firebaseAuthOptions } = options;
  const authFallback = useFirebaseAuth(firebaseAuthOptions);
  const auth = options?.auth ?? authFallback;

  useEffect(() => {
    if (auth) {
      return onAuthStateChanged(auth, userObserver);
    }
  }, [auth, userObserver]);
}

export type DefaultUseOnIdTokenChangedOptions =
  DefaultUseOnAuthStateChangedOptions;

export function useOnIdTokenChanged<
  Options extends
    DefaultUseOnIdTokenChangedOptions = DefaultUseOnIdTokenChangedOptions,
>(options: Options) {
  const { userObserver, ...firebaseAuthOptions } = options;
  const authFallback = useFirebaseAuth(firebaseAuthOptions);
  const auth = options?.auth ?? authFallback;

  useEffect(() => {
    if (auth) {
      return onIdTokenChanged(auth, userObserver);
    }
  }, [auth, userObserver]);
}

export interface DefaultUseFirebaseAuthMethodsOptions
  extends DefaultReactFirebaseServerHooksOptions {
  auth?: Auth;
}

export function useFirebaseAuthMethods<
  Options extends
    DefaultUseFirebaseAuthMethodsOptions = DefaultUseFirebaseAuthMethodsOptions,
>(options?: Options) {
  const authFallback = useFirebaseAuth(options);
  const auth = options?.auth ?? authFallback;

  const applyActionCode = async (verificationCode: string) =>
    await firebaseApplyActionCode(auth, verificationCode);

  const checkActionCode = async (verificationCode: string) =>
    await firebaseCheckActionCode(auth, verificationCode);

  const connectAuthEmulator = async <
    ConnectAuthEmulatorOptions extends
      DefaultConnectAuthEmulatorOptions = DefaultConnectAuthEmulatorOptions,
  >(
    options: ConnectAuthEmulatorOptions,
  ) => {
    const { url, disableWarnings = false } = options;
    return await firebaseConnectAuthEmulator(auth, url, { disableWarnings });
  };

  const confirmPasswordReset = async <
    ConfirmPasswordResetPayload extends
      DefaultConfirmPasswordResetPayload = DefaultConfirmPasswordResetPayload,
  >(
    payload: ConfirmPasswordResetPayload,
  ) => {
    const { confirmationCode, newPassword } = payload;
    return await firebaseConfirmPasswordReset(
      auth,
      confirmationCode,
      newPassword,
    );
  };

  const getMultiFactorResolver = (error: MultiFactorError) =>
    firebaseGetMultiFactorResolver(auth, error);

  const isSignInWithEmailLink = (emailLink: string) =>
    firebaseIsSignInWithEmailLink(auth, emailLink);

  const revokeAccessToken = async (token: string) =>
    await firebaseRevokeAccessToken(auth, token);

  const sendPasswordResetEmail = async <
    Payload extends
      DefaultSendPasswordResetEmailPayload = DefaultSendPasswordResetEmailPayload,
  >(
    payload: Payload,
  ) => {
    const { email, actionCodeSettings = undefined } = payload;
    return await firebaseSendPasswordResetEmail(
      auth,
      email,
      actionCodeSettings,
    );
  };

  const sendSignInLinkToEmail = async <
    Payload extends
      DefaultSendSignInLinkToEmailPayload = DefaultSendSignInLinkToEmailPayload,
  >(
    payload: Payload,
  ) => {
    const { email, actionCodeSettings } = payload;
    return firebaseSendSignInLinkToEmail(auth, email, actionCodeSettings);
  };

  const validatePassword = async (password: string) =>
    await firebaseValidatePassword(auth, password);

  return {
    applyActionCode,
    checkActionCode,
    confirmPasswordReset,
    connectAuthEmulator,
    getMultiFactorResolver,
    isSignInWithEmailLink,
    revokeAccessToken,
    sendPasswordResetEmail,
    sendSignInLinkToEmail,
    validatePassword,
  };
}
