import {
  type ApplicationVerifier,
  type Auth,
  type AuthCredential,
  type AuthProvider,
  type Dependencies,
  type MultiFactorError,
  type NextOrObserver,
  type Persistence,
  type PopupRedirectResolver,
  type User,
  beforeAuthStateChanged,
  applyActionCode as firebaseApplyActionCode,
  checkActionCode as firebaseCheckActionCode,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  connectAuthEmulator as firebaseConnectAuthEmulator,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
  getMultiFactorResolver as firebaseGetMultiFactorResolver,
  getRedirectResult as firebaseGetRedirectResult,
  initializeRecaptchaConfig as firebaseInitializeRecaptchaConfig,
  isSignInWithEmailLink as firebaseIsSignInWithEmailLink,
  revokeAccessToken as firebaseRevokeAccessToken,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  sendSignInLinkToEmail as firebaseSendSignInLinkToEmail,
  setPersistence as firebaseSetPersistence,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithCredential as firebaseSignInWithCredential,
  signInWithCustomToken as firebaseSignInWithCustomToken,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signInWithEmailLink as firebaseSignInWithEmailLink,
  signInWithPhoneNumber as firebaseSignInWithPhoneNumber,
  signInWithPopup as firebaseSignInWithPopup,
  signInWithRedirect as firebaseSignInWithRedirect,
  signOut as firebaseSignOut,
  updateCurrentUser as firebaseUpdateCurrentUser,
  validatePassword as firebaseValidatePassword,
  getAuth,
  initializeAuth,
  onAuthStateChanged,
  onIdTokenChanged,
} from "firebase/auth";
import { useEffect, useMemo } from "react";

import {
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";
import type {
  DefaultConfirmPasswordResetPayload,
  DefaultConnectAuthEmulatorOptions,
  DefaultSendPasswordResetEmailPayload,
  DefaultSendSignInLinkToEmailPayload,
} from "./types";

export interface DefaultSignInWithEmailAndPasswordPayload {
  email: string;
  password: string;
}

export interface DefaultSignInWithEmailLinkPayload {
  email: string;
  /**
   * @default undefined
   */
  emailLink?: string;
}

export interface DefaultSignInWithPhoneNumberPayload {
  phoneNumber: string;
  appVerifier: ApplicationVerifier;
}

export interface DefaultSignInWithPopupPayload {
  provider: AuthProvider;
  resolver?: PopupRedirectResolver;
}

export interface DefaultSignInWithRedirectPayload
  extends DefaultSignInWithPopupPayload {}

export function useFirebaseAuth<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options) {
  const app = useFirebaseApp(options?.context);
  return getAuth(app);
}

export interface DefaultUseInitializeAuthOptions
  extends DefaultReactFirebaseHooksOptions {
  dependencies?: Dependencies;
}

export function useInitializeAuth<
  Options extends
    DefaultUseInitializeAuthOptions = DefaultUseInitializeAuthOptions,
>(options?: Options) {
  const app = useFirebaseApp(options?.context);
  return useMemo(
    () => initializeAuth(app, options?.dependencies),
    [app, options],
  );
}

export interface DefaultUseBeforeAuthStateChangedOptions
  extends DefaultReactFirebaseHooksOptions {
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
  extends DefaultReactFirebaseHooksOptions {
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
  extends DefaultReactFirebaseHooksOptions {
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

  const createUserWithEmailAndPassword = async <
    EmailAndPasswordPayload extends
      DefaultSignInWithEmailAndPasswordPayload = DefaultSignInWithEmailAndPasswordPayload,
  >(
    payload: EmailAndPasswordPayload,
  ) => {
    const { email, password } = payload;
    return await firebaseCreateUserWithEmailAndPassword(auth, email, password);
  };

  const getMultiFactorResolver = (error: MultiFactorError) =>
    firebaseGetMultiFactorResolver(auth, error);

  const getRedirectResult = async (resolver?: PopupRedirectResolver) =>
    await firebaseGetRedirectResult(auth, resolver);

  const initializeRecaptchaConfig = async () =>
    await firebaseInitializeRecaptchaConfig(auth);

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

  const setPersistence = async (persistence: Persistence) =>
    await firebaseSetPersistence(auth, persistence);

  const signInAnonymously = async () => await firebaseSignInAnonymously(auth);

  const signInWithCredential = async (credential: AuthCredential) =>
    await firebaseSignInWithCredential(auth, credential);

  const signInWithCustomToken = async (customToken: string) =>
    await firebaseSignInWithCustomToken(auth, customToken);

  const signInWithEmailLink = async <
    SignInWithEmailLinkPayload extends
      DefaultSignInWithEmailLinkPayload = DefaultSignInWithEmailLinkPayload,
  >(
    payload: SignInWithEmailLinkPayload,
  ) => {
    const { email, emailLink = undefined } = payload;
    return await firebaseSignInWithEmailLink(auth, email, emailLink);
  };

  const signInWithEmailAndPassword = async <
    EmailAndPasswordPayload extends
      DefaultSignInWithEmailAndPasswordPayload = DefaultSignInWithEmailAndPasswordPayload,
  >(
    payload: EmailAndPasswordPayload,
  ) => {
    const { email, password } = payload;
    return await firebaseSignInWithEmailAndPassword(auth, email, password);
  };

  const signInWithPhoneNumber = async <
    SignInWithPhoneNumberPayload extends
      DefaultSignInWithPhoneNumberPayload = DefaultSignInWithPhoneNumberPayload,
  >(
    payload: SignInWithPhoneNumberPayload,
  ) => {
    const { phoneNumber, appVerifier } = payload;
    return await firebaseSignInWithPhoneNumber(auth, phoneNumber, appVerifier);
  };

  const signInWithPopup = async <
    SignInWithPopupPayload extends
      DefaultSignInWithPopupPayload = DefaultSignInWithPopupPayload,
  >(
    payload: SignInWithPopupPayload,
  ) => {
    const { provider, resolver = undefined } = payload;
    return await firebaseSignInWithPopup(auth, provider, resolver);
  };

  const signInWithRedirect = async <
    Payload extends
      DefaultSignInWithRedirectPayload = DefaultSignInWithRedirectPayload,
  >(
    payload: Payload,
  ) => {
    const { provider, resolver = undefined } = payload;
    return await firebaseSignInWithRedirect(auth, provider, resolver);
  };

  const signOut = async () => await firebaseSignOut(auth);

  const updateCurrentUser = async (user: User | null = null) =>
    await firebaseUpdateCurrentUser(auth, user);

  const validatePassword = async (password: string) =>
    await firebaseValidatePassword(auth, password);

  return {
    applyActionCode,
    checkActionCode,
    createUserWithEmailAndPassword,
    confirmPasswordReset,
    connectAuthEmulator,
    getMultiFactorResolver,
    getRedirectResult,
    initializeRecaptchaConfig,
    isSignInWithEmailLink,
    revokeAccessToken,
    sendPasswordResetEmail,
    sendSignInLinkToEmail,
    setPersistence,
    signInAnonymously,
    signInWithEmailLink,
    signInWithCredential,
    signInWithCustomToken,
    signInWithEmailAndPassword,
    signInWithPhoneNumber,
    signInWithPopup,
    signInWithRedirect,
    signOut,
    updateCurrentUser,
    validatePassword,
  };
}
