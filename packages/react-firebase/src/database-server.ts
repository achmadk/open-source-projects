import {
  type Database,
  connectDatabaseEmulator as firebaseConnectDatabaseEmulator,
  goOffline as firebaseGoOffline,
  goOnline as firebaseGoOnline,
  ref as firebaseRef,
  refFromURL as firebaseRefFromURL,
  getDatabase,
} from "firebase/database";

import {
  type DefaultReactFirebaseServerHooksOptions,
  useFirebaseServerApp,
} from "./ServerContext";
import type { ConnectDatabaseEmulatorOptions } from "./types";

export function useFirebaseDatabase<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options): Database {
  const app = useFirebaseServerApp(options?.context);
  return getDatabase(app);
}

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
