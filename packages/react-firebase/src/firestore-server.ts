import {
  type Firestore,
  type FirestoreSettings,
  clearIndexedDbPersistence as firebaseClearIDBPersistence,
  disableNetwork as firebaseDisableNetwork,
  enableNetwork as firebaseEnableNetwork,
  terminate as firebaseTerminate,
  waitForPendingWrites as firebaseWaitForPendingWrites,
  writeBatch as firebaseWriteBatch,
  collection as firestoreCollection,
  collectionGroup as firestoreCollectionGroup,
  connectFirestoreEmulator as firestoreConnectEmulator,
  doc as firestoreDoc,
  loadBundle as firestoreLoadBundle,
  namedQuery as firestoreNamedQuery,
  runTransaction as firestoreRunTransaction,
  getFirestore,
  initializeFirestore,
  onSnapshotsInSync,
} from "firebase/firestore";
import { useEffect, useMemo } from "react";

import {
  type DefaultReactFirebaseServerHooksOptions,
  useFirebaseServerApp,
} from "./ServerContext";
import type {
  DefaultCollectionOptions,
  DefaultConnectFirestoreEmulatorOptions,
  DefaultDocOptions,
  DefaultObserverType,
  DefaultOptionsOnlyFirestore,
  DefaultRunTransactionOptions,
} from "./types";

/**
 * @description get your firebase firestore instance easily in your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}  {Firestore}
 */
export function useFirebaseFirestore<
  Options extends
    DefaultReactFirebaseServerHooksOptions = DefaultReactFirebaseServerHooksOptions,
>(options?: Options): Firestore {
  const app = useFirebaseServerApp(options?.context);
  return useMemo(() => getFirestore(app), [app]);
}

/**
 * @description data type for firestore settings in server side app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @interface FirestoreServerSettings
 * @extends {(Omit<FirestoreSettings, 'experimentalForceLongPolling' | 'experimentalAutoDetectLongPolling' | 'experimentalLongPollingOptions'>)}
 */
export interface FirestoreServerSettings
  extends Omit<
    FirestoreSettings,
    | "experimentalForceLongPolling"
    | "experimentalAutoDetectLongPolling"
    | "experimentalLongPollingOptions"
  > {}

/**
 * @description data type options for {@link useInitializeFirestore} method
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @interface DefaultUseInitializeFirestoreOptions
 * @extends {DefaultReactFirebaseServerHooksOptions}
 */
export interface DefaultUseInitializeFirestoreOptions
  extends DefaultReactFirebaseServerHooksOptions {
  /**
   * @description second parameter of {@link initializeFirestore} method
   * @author Achmad Kurnianto
   * @date 02/08/2024
   * @type {FirestoreServerSettings}
   * @memberof DefaultUseInitializeFirestoreOptions
   */
  settings?: FirestoreServerSettings;

  /**
   * @description third parameter of {@link initializeFirestore} method
   * @author Achmad Kurnianto
   * @date 02/08/2024
   * @type {FirestoreServerSettings}
   * @memberof DefaultUseInitializeFirestoreOptions
   */
  databaseId?: string;
}

/**
 * @description create your own firebase firestore instance with {@link initializeFirestore} method under the hood.
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [opts]
 * @returns {*}  {Firestore}
 */
export function useInitializeFirestore<
  Options extends
    DefaultUseInitializeFirestoreOptions = DefaultUseInitializeFirestoreOptions,
>(opts?: Options): Firestore {
  const app = useFirebaseServerApp(opts?.context);
  const settings = opts?.settings ?? {};
  return useMemo(
    () => initializeFirestore(app, settings, opts?.databaseId),
    [app, opts, settings],
  );
}

/**
 * @description data type options for {@link useOnSnapshotInSync} hooks.
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @interface DefaultUseOnSnapshotInSyncOptions
 * @extends {DefaultReactFirebaseServerHooksOptions}
 * @extends {DefaultOptionsOnlyFirestore}
 */
export interface DefaultUseOnSnapshotInSyncOptions
  extends DefaultReactFirebaseServerHooksOptions,
    DefaultOptionsOnlyFirestore {}

/**
 * @description use {@link onSnapshotsInSync} method easily in your react app
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {DefaultObserverType} observer second parameter of {@link onSnapshotsInSync} method
 * @param {Options} options
 */
export function useOnSnapshotInSync<
  Options extends
    DefaultUseOnSnapshotInSyncOptions = DefaultUseOnSnapshotInSyncOptions,
>(observer: DefaultObserverType, options: Options) {
  const firestoreFallback = useFirebaseFirestore(options);
  const firestore = options?.firestore ?? firestoreFallback;

  useEffect(() => {
    if (firestore) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return onSnapshotsInSync(firestore, observer as any);
    }
  }, [firestore, observer]);
}

/**
 * @description data type options used for {@link useFirebaseFirestoreMethods} method
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @interface DefaultUseFirebaseFirestoreMethods
 * @extends {DefaultReactFirebaseServerHooksOptions}
 * @extends {DefaultOptionsOnlyFirestore}
 */
export interface DefaultUseFirebaseFirestoreMethods
  extends DefaultReactFirebaseServerHooksOptions,
    DefaultOptionsOnlyFirestore {}

/**
 * @description easily get methods which depends on firebase firestore instance.
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
export function useFirebaseFirestoreMethods<
  Options extends
    DefaultUseFirebaseFirestoreMethods = DefaultUseFirebaseFirestoreMethods,
>(options?: Options) {
  const firestoreFallback = useFirebaseFirestore(options);
  const firestore = options?.firestore ?? firestoreFallback;

  const runTransaction = async <
    T = unknown,
    RunTransactionOptions extends
      DefaultRunTransactionOptions<T> = DefaultRunTransactionOptions<T>,
  >(
    opts: RunTransactionOptions,
  ) => {
    const { updateFunction, options: runTransactionOptions } = opts;
    return await firestoreRunTransaction<T>(
      firestore,
      updateFunction,
      runTransactionOptions,
    );
  };

  const clearIndexedDbPersistence = async () =>
    await firebaseClearIDBPersistence(firestore);

  const collection = <
    Options extends DefaultCollectionOptions = DefaultCollectionOptions,
  >(
    opts: Options,
  ) => {
    const { path, pathSegments } = opts;
    return firestoreCollection(firestore, path, ...pathSegments);
  };

  const collectionGroup = (collectionId: string) =>
    firestoreCollectionGroup(firestore, collectionId);

  const connectFirestoreEmulator = <
    Options extends
      DefaultConnectFirestoreEmulatorOptions = DefaultConnectFirestoreEmulatorOptions,
  >(
    opts: Options,
  ) => {
    const { host, port, options: connectFirestoreOptions } = opts;
    return firestoreConnectEmulator(
      firestore,
      host,
      port,
      connectFirestoreOptions,
    );
  };

  const disableNetwork = async () => await firebaseDisableNetwork(firestore);

  const doc = <Options extends DefaultDocOptions = DefaultDocOptions>(
    opts: Options,
  ) => {
    const { path, pathSegments } = opts;
    return firestoreDoc(firestore, path, ...pathSegments);
  };

  const enableNetwork = async () => await firebaseEnableNetwork(firestore);

  const loadBundle = (payload: Parameters<typeof firestoreLoadBundle>[1]) =>
    firestoreLoadBundle(firestore, payload);

  const namedQuery = async (name: string) =>
    await firestoreNamedQuery(firestore, name);

  const terminate = async () => await firebaseTerminate(firestore);

  const waitForPendingWrites = async () =>
    await firebaseWaitForPendingWrites(firestore);

  const writeBatch = async () => await firebaseWriteBatch(firestore);

  return {
    clearIndexedDbPersistence,
    collection,
    collectionGroup,
    connectFirestoreEmulator,
    disableNetwork,
    doc,
    enableNetwork,
    loadBundle,
    namedQuery,
    runTransaction,
    terminate,
    waitForPendingWrites,
    writeBatch,
  };
}
