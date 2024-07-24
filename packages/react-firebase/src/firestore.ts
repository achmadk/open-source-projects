import {
  type Firestore,
  type FirestoreError,
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
  DefaultRunTransactionOptions,
} from "./types";

export function useFirebaseFirestore<
  Options extends
    DefaultReactFirebaseHooksOptions = DefaultReactFirebaseHooksOptions,
>(options?: Options): Firestore {
  const app = useFirebaseApp(options?.context);
  return getFirestore(app);
}

export interface DefaultUseInitializeFirestoreOptions
  extends DefaultReactFirebaseHooksOptions {
  settings?: FirestoreSettings;
  databaseId?: string;
}

export function useInitializeFirestore<
  Options extends
    DefaultUseInitializeFirestoreOptions = DefaultUseInitializeFirestoreOptions,
>(opts?: Options): Firestore {
  const settings = opts?.settings ?? ({} as FirestoreSettings);
  const app = useFirebaseApp(opts?.context);
  return useMemo(
    () => initializeFirestore(app, settings, opts?.databaseId),
    [app, opts, settings],
  );
}

export interface DefaultUseFirebaseFirestoreOnSnapShotInSyncOptions
  extends DefaultReactFirebaseHooksOptions {
  observer:
    | (() => void)
    | {
        // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
        next?: (value: void) => void;
        error?: (error: FirestoreError) => void;
        complete?: () => void;
      };
  firestore?: Firestore;
}

export function useFirebaseFirestoreOnSnapshotInSync<
  Options extends
    DefaultUseFirebaseFirestoreOnSnapShotInSyncOptions = DefaultUseFirebaseFirestoreOnSnapShotInSyncOptions,
>(options: Options) {
  const { observer, ...firebaseFirestoreOptions } = options;

  const firestoreFallback = useFirebaseFirestore(firebaseFirestoreOptions);
  const firestore = options?.firestore ?? firestoreFallback;

  useEffect(() => {
    if (firestore) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return onSnapshotsInSync(firestore, observer as any);
    }
  }, [firestore, observer]);
}

export interface DefaultUseFirebaseFirestoreMethods
  extends DefaultReactFirebaseHooksOptions {
  firestore?: Firestore;
}

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
