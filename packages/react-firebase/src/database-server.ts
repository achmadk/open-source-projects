import {
  type Database,
  connectDatabaseEmulator as firebaseConnectDatabaseEmulator,
  goOffline as firebaseGoOffline,
  goOnline as firebaseGoOnline,
  ref as firebaseRef,
  refFromURL as firebaseRefFromURL,
  getDatabase,
} from "firebase/database";

import { useMemo } from "react";
import {
  type DefaultReactFirebaseServerHooksOptions,
  useFirebaseServerApp,
} from "./ServerContext";
import type { ConnectDatabaseEmulatorOptions } from "./types";

/**
 * @description get firebase database instance easily in your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}  {Database}
 */
export function useFirebaseDatabase<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options): Database {
  const app = useFirebaseServerApp(options?.context);
  return useMemo(() => getDatabase(app), [app]);
}

/**
 * @description get methods which depends on firebase database instance easily in your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
export function useFirebaseDatabaseMethods<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options) {
  const database = useFirebaseDatabase(options);

  const connectDatabaseEmulator = <
    ConnectOptions extends
      ConnectDatabaseEmulatorOptions = ConnectDatabaseEmulatorOptions,
  >(
    opts: ConnectOptions,
  ) => {
    const { host, port, options: connectDatabaseEmulatorOptions } = opts;
    return firebaseConnectDatabaseEmulator(
      database,
      host,
      port,
      connectDatabaseEmulatorOptions,
    );
  };

  const goOffline = () => firebaseGoOffline(database);

  const goOnline = () => firebaseGoOnline(database);

  const ref = (path?: string) => firebaseRef(database, path);

  const refFromURL = (url: string) => firebaseRefFromURL(database, url);

  return {
    connectDatabaseEmulator,
    goOffline,
    goOnline,
    ref,
    refFromURL,
  };
}
