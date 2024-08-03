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
  DefaultOptionsOnlyAuth,
  DefaultSendPasswordResetEmailPayload,
  DefaultSendSignInLinkToEmailPayload,
} from "./types";

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
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options): Auth {
  const app = useFirebaseServerApp(options?.context);
  return useMemo(() => getAuth(app), [app]);
}

/**
 * @description type data used in {@link useInitializeAuth} method
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultUseInitializeAuthOptions
 * @extends {DefaultReactFirebaseServerHooksOptions}
 */
export interface DefaultUseInitializeAuthOptions
  extends DefaultReactFirebaseServerHooksOptions {
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
 * @returns {*}  {Auth}
 */
export function useInitializeAuth<
  Options extends
    DefaultUseInitializeAuthOptions = DefaultUseInitializeAuthOptions,
>(options?: Options): Auth {
  const app = useFirebaseServerApp(options?.context);
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
 * @extends {DefaultReactFirebaseServerHooksOptions}
 * @extends {DefaultOptionsOnlyAuth}
 */
export interface DefaultUseBeforeAuthStateChangedOptions
  extends DefaultReactFirebaseServerHooksOptions,
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
 * @extends {DefaultReactFirebaseServerHooksOptions}
 * @extends {DefaultOptionsOnlyAuth}
 */
export interface DefaultUseOnAuthStateChangedOptions
  extends DefaultReactFirebaseServerHooksOptions,
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
 * @param {Options} options
 */
export function useOnIdTokenChanged<
  Options extends
    DefaultUseOnIdTokenChangedOptions = DefaultUseOnIdTokenChangedOptions,
>(userObserver: NextOrObserver<User>, options: Options) {
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
 * @extends {DefaultReactFirebaseServerHooksOptions}
 * @extends {DefaultOptionsOnlyAuth}
 */
export interface DefaultUseFirebaseAuthMethodsOptions
  extends DefaultReactFirebaseServerHooksOptions,
    DefaultOptionsOnlyAuth {}

/**
 * @description easily get methods which depends on firebase auth instance.
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
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
