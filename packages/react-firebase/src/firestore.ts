import {
  type Firestore,
  type FirestoreSettings,
  clearIndexedDbPersistence as firebaseClearIDBPersistence,
  disableNetwork as firebaseDisableNetwork,
  enableNetwork as firebaseEnableNetwork,
  getPersistentCacheIndexManager as firebaseGetPersistentCacheIndexManager,
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
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";
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
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options): Firestore {
  const app = useFirebaseApp(options?.context);
  return useMemo(() => getFirestore(app), [app]);
}

/**
 * @description data type options for {@link useInitializeFirestore} method
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @interface DefaultUseInitializeFirestoreOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 */
export interface DefaultUseInitializeFirestoreOptions
  extends DefaultReactFirebaseHooksOptions {
  /**
   * @description second parameter of {@link initializeFirestore} method
   * @author Achmad Kurnianto
   * @date 02/08/2024
   * @type {FirestoreSettings}
   * @memberof DefaultUseInitializeFirestoreOptions
   */
  settings?: FirestoreSettings;

  /**
   * @description third parameter of {@link initializeFirestore} method
   * @author Achmad Kurnianto
   * @date 02/08/2024
   * @type {string}
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
  const settings = opts?.settings ?? {};
  const app = useFirebaseApp(opts?.context);
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
 * @extends {DefaultReactFirebaseHooksOptions}
 * @extends {DefaultOptionsOnlyFirestore}
 */
export interface DefaultUseOnSnapshotInSyncOptions
  extends DefaultReactFirebaseHooksOptions,
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
>(observer: DefaultObserverType, options?: Options) {
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
 * @extends {DefaultReactFirebaseHooksOptions}
 * @extends {DefaultOptionsOnlyFirestore}
 */
export interface DefaultUseFirebaseFirestoreMethods
  extends DefaultReactFirebaseHooksOptions,
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

  const getPersistentCacheIndexManager = () =>
    firebaseGetPersistentCacheIndexManager(firestore);

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
    getPersistentCacheIndexManager,
    loadBundle,
    namedQuery,
    runTransaction,
    terminate,
    waitForPendingWrites,
    writeBatch,
  };
}
