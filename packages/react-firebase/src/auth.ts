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
  DefaultOptionsOnlyAuth,
  DefaultSendPasswordResetEmailPayload,
  DefaultSendSignInLinkToEmailPayload,
} from "./types";

/**
 * @description payload for {@link firebaseCreateUserWithEmailAndPassword} and {@link firebaseSignInWithEmailAndPassword} method.
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultSignInWithEmailAndPasswordPayload
 */
export interface DefaultSignInWithEmailAndPasswordPayload {
  /**
   * @description second parameter of either {@link firebaseCreateUserWithEmailAndPassword} or {@link firebaseSignInWithEmailAndPassword} method.
   * @author Achmad Kurnianto
   * @date 01/08/2024
   * @type {string}
   * @memberof DefaultSignInWithEmailAndPasswordPayload
   */
  email: string;

  /**
   * @description third parameter of either {@link firebaseCreateUserWithEmailAndPassword} or {@link firebaseSignInWithEmailAndPassword} method.
   * @author Achmad Kurnianto
   * @date 01/08/2024
   * @type {string}
   * @memberof DefaultSignInWithEmailAndPasswordPayload
   */
  password: string;
}

/**
 * @description payload for {@link firebaseSignInWithEmailLink} method
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultSignInWithEmailLinkPayload
 */
export interface DefaultSignInWithEmailLinkPayload {
  /**
   * @description second parameter of {@link firebaseSignInWithEmailLink} method
   * @author Achmad Kurnianto
   * @date 01/08/2024
   * @type {string}
   * @memberof DefaultSignInWithEmailLinkPayload
   */
  email: string;

  /**
   * @description third parameter of {@link firebaseSignInWithEmailLink} method
   * @default undefined
   * @author Achmad Kurnianto
   * @date 01/08/2024
   * @type {string}
   * @memberof DefaultSignInWithEmailLinkPayload
   */
  emailLink?: string;
}

/**
 * @description payload for {@link firebaseSignInWithPhoneNumber} method.
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultSignInWithPhoneNumberPayload
 */
export interface DefaultSignInWithPhoneNumberPayload {
  /**
   * @description second parameter of {@link firebaseSignInWithPhoneNumber} method.
   * @author Achmad Kurnianto
   * @date 01/08/2024
   * @type {string}
   * @memberof DefaultSignInWithPhoneNumberPayload
   */
  phoneNumber: string;

  /**
   * @description third parameter of {@link firebaseSignInWithPhoneNumber} method.
   * @author Achmad Kurnianto
   * @date 01/08/2024
   * @type {ApplicationVerifier}
   * @memberof DefaultSignInWithPhoneNumberPayload
   */
  appVerifier: ApplicationVerifier;
}

/**
 * @description payload for {@link firebaseSignInWithPopup} and {@link firebaseSignInWithRedirect} method
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultSignInWithPopupPayload
 */
export interface DefaultSignInWithPopupPayload {
  /**
   * @description second parameter of {@link firebaseSignInWithPopup} method
   * @author Achmad Kurnianto
   * @date 01/08/2024
   * @type {AuthProvider}
   * @memberof DefaultSignInWithPopupPayload
   */
  provider: AuthProvider;

  /**
   * @description third parameter of {@link firebaseSignInWithPopup} method
   * @default undefined
   * @author Achmad Kurnianto
   * @date 01/08/2024
   * @type {PopupRedirectResolver}
   * @memberof DefaultSignInWithPopupPayload
   */
  resolver?: PopupRedirectResolver;
}

/**
 * @description payload for {@link firebaseSignInWithRedirect} method
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultSignInWithRedirectPayload
 * @extends {DefaultSignInWithPopupPayload}
 */
export interface DefaultSignInWithRedirectPayload
  extends DefaultSignInWithPopupPayload {}

/**
 * @description get firebase auth instance for your react app
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}  {Auth}
 */
export function useFirebaseAuth<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options): Auth {
  const app = useFirebaseApp(options?.context);
  return useMemo(() => getAuth(app), [app]);
}

/**
 * @description type data used in {@link useInitializeAuth} method
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultUseInitializeAuthOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 */
export interface DefaultUseInitializeAuthOptions
  extends DefaultReactFirebaseHooksOptions {
  /**
   * @description second parameter of {@link initializeAuth} method
   * @author Achmad Kurnianto
   * @date 01/08/2024
   * @type {Dependencies}
   * @memberof DefaultUseInitializeAuthOptions
   */
  dependencies?: Dependencies;
}

/**
 * @description create your own firebase auth instance with {@link initializeAuth} under the hood.
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
export function useInitializeAuth<
  Options extends
    DefaultUseInitializeAuthOptions = DefaultUseInitializeAuthOptions,
>(options?: Options): Auth {
  const app = useFirebaseApp(options?.context);
  return useMemo(
    () => initializeAuth(app, options?.dependencies),
    [app, options],
  );
}

/**
 * @description type data options for {@link useBeforeAuthStateChanged} hooks
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultUseBeforeAuthStateChangedOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 * @extends {DefaultOptionsOnlyAuth}
 */
export interface DefaultUseBeforeAuthStateChangedOptions
  extends DefaultReactFirebaseHooksOptions,
    DefaultOptionsOnlyAuth {
  /**
   * @description third parameter of {@link beforeAuthStateChanged} method
   * @default undefined
   * @author Achmad Kurnianto
   * @date 01/08/2024
   * @memberof DefaultUseBeforeAuthStateChangedOptions
   */
  onAbort?: () => void;
}

/**
 * @description apply {@link beforeAuthStateChanged} method easily in your react app
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @template Options
 * @param {((user: User | null) => void | Promise<void>)} callback second parameter of {@link beforeAuthStateChanged} method
 * @param {Options} [options]
 */
export function useBeforeAuthStateChanged<
  Options extends
    DefaultUseBeforeAuthStateChangedOptions = DefaultUseBeforeAuthStateChangedOptions,
>(callback: (user: User | null) => void | Promise<void>, options?: Options) {
  const onAbort = options?.onAbort ?? undefined;
  const authFallback = useFirebaseAuth(options);
  const auth = options?.auth ?? authFallback;

  useEffect(() => {
    if (auth) {
      return beforeAuthStateChanged(auth, callback, onAbort);
    }
  }, [auth, callback, onAbort]);
}

/**
 * @description type data options for {@link useOnAuthStateChanged} and {@link useOnIdTokenChanged} hooks
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultUseOnAuthStateChangedOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 * @extends {DefaultOptionsOnlyAuth}
 */
export interface DefaultUseOnAuthStateChangedOptions
  extends DefaultReactFirebaseHooksOptions,
    DefaultOptionsOnlyAuth {}

/**
 * @description easily use {@link onAuthStateChanged} method inside your react app
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @template Options
 * @param {NextOrObserver<User>} userObserver second parameter of {@link onAuthStateChanged} method.
 * @param {Options} [options]
 */
export function useOnAuthStateChanged<
  Options extends
    DefaultUseOnAuthStateChangedOptions = DefaultUseOnAuthStateChangedOptions,
>(userObserver: NextOrObserver<User>, options?: Options) {
  const authFallback = useFirebaseAuth(options);
  const auth = options?.auth ?? authFallback;

  useEffect(() => {
    if (auth) {
      return onAuthStateChanged(auth, userObserver);
    }
  }, [auth, userObserver]);
}

/**
 * @description data type options for {@link useOnIdTokenChanged} hooks.
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultUseOnIdTokenChangedOptions
 * @extends {DefaultUseOnAuthStateChangedOptions}
 */
export interface DefaultUseOnIdTokenChangedOptions
  extends DefaultUseOnAuthStateChangedOptions {}

/**
 * @description easily use {@link onIdTokenChanged} method into your react app.
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @template Options
 * @param {NextOrObserver<User>} userObserver second parameter of {@link onIdTokenChanged} method
 * @param {Options} [options]
 */
export function useOnIdTokenChanged<
  Options extends
    DefaultUseOnIdTokenChangedOptions = DefaultUseOnIdTokenChangedOptions,
>(userObserver: NextOrObserver<User>, options?: Options) {
  const authFallback = useFirebaseAuth(options);
  const auth = options?.auth ?? authFallback;

  useEffect(() => {
    if (auth) {
      return onIdTokenChanged(auth, userObserver);
    }
  }, [auth, userObserver]);
}

/**
 * @description data type options for {@link useFirebaseAuthMethods} hooks
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultUseFirebaseAuthMethodsOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 * @extends {DefaultOptionsOnlyAuth}
 */
export interface DefaultUseFirebaseAuthMethodsOptions
  extends DefaultReactFirebaseHooksOptions,
    DefaultOptionsOnlyAuth {}

/**
 * @description easily get methods which depends on firebase auth instance.
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @template Options
 * @param {Options} [opts]
 * @returns {*}
 */
export function useFirebaseAuthMethods<
  Options extends
    DefaultUseFirebaseAuthMethodsOptions = DefaultUseFirebaseAuthMethodsOptions,
>(opts?: Options) {
  const authFallback = useFirebaseAuth(opts);
  const auth = opts?.auth ?? authFallback;

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
