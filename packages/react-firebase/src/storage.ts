import {
  type EmulatorMockTokenOptions,
  type FirebaseStorage,
  connectStorageEmulator as firebaseConnectStorageEmulator,
  ref as firebaseRef,
  getStorage,
} from "firebase/storage";
import { useMemo } from "react";
import {
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";

/**
 * @description options provided for {@link useFirebaseStorage} and {@link useFirebaseStorageMethods} hooks.
 * @author Achmad Kurnianto
 * @date 31/07/2024
 * @export
 * @interface DefaultUseFirebaseStorageOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 */
export interface DefaultUseFirebaseStorageOptions
  extends DefaultReactFirebaseHooksOptions {
  /**
   * @description second parameter when use firebase {@link getStorage} method.
   * @author Achmad Kurnianto
   * @date 31/07/2024
   * @type {string}
   * @memberof DefaultUseFirebaseStorageOptions
   */
  bucketUrl?: string;
}

/**
 * @description easily get your firebase storage instance inside your react app
 * @author Achmad Kurnianto
 * @date 31/07/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}  {FirebaseStorage}
 */
export function useFirebaseStorage<
  Options extends
    DefaultUseFirebaseStorageOptions = DefaultUseFirebaseStorageOptions,
>(options?: Options): FirebaseStorage {
  const app = useFirebaseApp(options?.context);
  return useMemo(() => getStorage(app, options?.bucketUrl), [app, options]);
}

/**
 * @description options for `connectStorageEmulator` method inside {@link useFirebaseStorageMethods}
 * @author Achmad Kurnianto
 * @date 31/07/2024
 * @export
 * @interface DefaultConnectStorageEmulatorOptions
 */
export interface DefaultConnectStorageEmulatorOptions {
  /**
   * @description second parameter of original firebase {@link firebaseConnectStorageEmulator} method
   * @author Achmad Kurnianto
   * @date 31/07/2024
   * @type {string}
   * @memberof DefaultConnectStorageEmulatorOptions
   */
  host: string;

  /**
   * @description third parameter of original firebase {@link firebaseConnectStorageEmulator} method
   * @author Achmad Kurnianto
   * @date 31/07/2024
   * @type {number}
   * @memberof DefaultConnectStorageEmulatorOptions
   */
  port: number;

  /**
   * @description last parameter of original firebase {@link firebaseConnectStorageEmulator} method
   * @author Achmad Kurnianto
   * @date 31/07/2024
   * @type {({
   *     mockUserToken?: EmulatorMockTokenOptions | string
   *   })}
   * @memberof DefaultConnectStorageEmulatorOptions
   */
  options?: {
    mockUserToken?: EmulatorMockTokenOptions | string;
  };
}

/**
 * @description easily get firebase storage methods which depends on its instance for your react app.
 * @author Achmad Kurnianto
 * @date 31/07/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
export function useFirebaseStorageMethods<
  Options extends
    DefaultUseFirebaseStorageOptions = DefaultUseFirebaseStorageOptions,
>(options?: Options) {
  const storage = useFirebaseStorage(options);

  const ref = (url?: string) => firebaseRef(storage, url);

  const connectStorageEmulator = <
    Opts extends
      DefaultConnectStorageEmulatorOptions = DefaultConnectStorageEmulatorOptions,
  >(
    opts: Opts,
  ) => {
    const { host, port, options } = opts;
    firebaseConnectStorageEmulator(storage, host, port, options);
  };

  return {
    ref,
    connectStorageEmulator,
  };
}
