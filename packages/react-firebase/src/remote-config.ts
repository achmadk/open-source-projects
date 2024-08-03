import {
  type LogLevel,
  type RemoteConfig,
  activate as firebaseActivate,
  ensureInitialized as firebaseEnsureInitialized,
  fetchAndActivate as firebaseFetchAndActivate,
  fetchConfig as firebaseFetchConfig,
  getAll as firebaseGetAll,
  getBoolean as firebaseGetBoolean,
  getNumber as firebaseGetNumber,
  getString as firebaseGetString,
  getValue as firebaseGetValue,
  setLogLevel as firebaseSetLogLevel,
  getRemoteConfig,
} from "firebase/remote-config";

import { useMemo } from "react";
import {
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";

/**
 * @description easily get firebase remote config instance in your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}  {RemoteConfig}
 */
export function useFirebaseRemoteConfig<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options): RemoteConfig {
  const app = useFirebaseApp(options?.context);
  return useMemo(() => getRemoteConfig(app), [app]);
}

/**
 * @description get methods which depends on firebase remote config instance to your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
export function useFirebaseRemoteConfigMethods<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options) {
  const remoteConfig = useFirebaseRemoteConfig(options);

  const activate = async () => await firebaseActivate(remoteConfig);

  const ensureInitialized = async () =>
    await firebaseEnsureInitialized(remoteConfig);

  const fetchAndActivate = async () =>
    await firebaseFetchAndActivate(remoteConfig);

  const fetchConfig = async () => await firebaseFetchConfig(remoteConfig);

  const getAll = () => firebaseGetAll(remoteConfig);

  const getBoolean = (key: string) => firebaseGetBoolean(remoteConfig, key);

  const getNumber = (key: string) => firebaseGetNumber(remoteConfig, key);

  const getString = (key: string) => firebaseGetString(remoteConfig, key);

  const getValue = (key: string) => firebaseGetValue(remoteConfig, key);

  const setLogLevel = (logLevel: LogLevel) =>
    firebaseSetLogLevel(remoteConfig, logLevel);

  return {
    activate,
    ensureInitialized,
    fetchAndActivate,
    fetchConfig,
    getAll,
    getBoolean,
    getNumber,
    getString,
    getValue,
    setLogLevel,
  };
}
