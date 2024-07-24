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
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";
import type { ConnectDatabaseEmulatorOptions } from "./types";

export function useFirebaseDatabase<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options): Database {
  const app = useFirebaseApp(options?.context);
  return getDatabase(app);
}

export function useFirebaseDatabaseMethods<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
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
