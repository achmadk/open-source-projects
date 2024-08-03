# Firestore module
We have several modules for firebase firestore instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`

| module name | module type | description |
| --- | --- | --- |
| `useFirebaseFirestore` | react hooks | hooks to get firebase firestore instance |
| `DefaultUseInitializeFirestoreOptions` | TypeScript type definition | options for `useInitializeFirestore` hooks |
| `useInitializeFirestore` | react hooks | hooks to easily create your own firebase firestore instances with `initializeFirestore` method under the hood. |
| `DefaultUseOnSnapshotInSyncOptions` | TypeScript type definition | options for `useOnSnapshotInSync` hooks |
| `useOnSnapshotInSync` | react hooks | hooks to easily implement `onSnapshotInSync` method in your react app. |
| `DefaultUseFirebaseFirestoreMethods` | TypeScript type definition | options for `useFirebaseFirestoreMethods` hooks |
| `useFirebaseFirestoreMethods` | react hooks | hooks to get methods which depends on firebase firestore instance. The available methods are `clearIndexedDbPersistence`, `collection`, `collectionGroup`, `connectFirestoreEmulator`, `disableNetwork`, `doc`, `enableNetwork`, `getPersistentCacheIndexManager`, `loadBundle`, `namedQuery`, `runTransaction`, `terminate`, `waitForPendingWrites`, and `writeBatch` |

# Optimization

Please use either `@achmadk/react-firebase/firestore` or `@achmadk/react-firebase/server/firestore` instead of `@achmadk/react-firebase` when using analytics module, for example `useFirebaseFirestore`.

## A. Client-side
```diff
- import { useFirebaseFirestore } from '@achmadk/react-firebase'
+ import { useFirebaseFirestore } from '@achmadk/react-firebase/firestore'
// OR
- import { useFirebaseFirestore } from '@achmadk/react-firebase/nextjs'
+ import { useFirebaseFirestore } from '@achmadk/react-firebase/nextjs/firestore'
```

## B. Server-side
```diff
- import { useFirebaseFirestore } from '@achmadk/react-firebase/server'
+ import { useFirebaseFirestore } from '@achmadk/react-firebase/server/firestore'
```