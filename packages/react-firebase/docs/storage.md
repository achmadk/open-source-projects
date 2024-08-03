# Storage module
We have several modules for firebase storage instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`

| module name | module type | description |
| --- | --- | --- |
| `useFirebaseStorage` | react hooks | hooks to get firebase storage instance |
| `useFirebaseStorageMethods` | react hooks | hooks to get methods which depends on firebase storage instance. The available methods are `ref` and `connectStorageEmulator` |

# Optimization

Please use either `@achmadk/react-firebase/storage` or `@achmadk/react-firebase/server/storage` instead of `@achmadk/react-firebase` when using analytics module, for example `useFirebaseStorage`.

## A. Client-side
```diff
- import { useFirebaseStorage } from '@achmadk/react-firebase'
+ import { useFirebaseStorage } from '@achmadk/react-firebase/storage'
// OR
- import { useFirebaseStorage } from '@achmadk/react-firebase/nextjs'
+ import { useFirebaseStorage } from '@achmadk/react-firebase/nextjs/storage'
```

## B. Server-side
```diff
- import { useFirebaseStorage } from '@achmadk/react-firebase/server'
+ import { useFirebaseStorage } from '@achmadk/react-firebase/server/storage'
```