# Database module
We have several modules for firebase database instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`

| module name | module type | description |
| --- | --- | --- |
| `useFirebaseDatabase` | react hooks | hooks to get firebase database instance |
| `useFirebaseDatabaseMethods` | react hooks | hooks to get methods which depends on firebase database instance. The available methods are `connectDatabaseEmulator`, `goOffline`, `goOnline`, `ref`, and `refFromURL` |

# Optimization

Please use either `@achmadk/react-firebase/database` or `@achmadk/react-firebase/server/database` instead of `@achmadk/react-firebase` when using analytics module, for example `useFirebaseDatabase`.

## A. Client-side
```diff
- import { useFirebaseDatabase } from '@achmadk/react-firebase'
+ import { useFirebaseDatabase } from '@achmadk/react-firebase/database'
// OR
- import { useFirebaseDatabase } from '@achmadk/react-firebase/nextjs'
+ import { useFirebaseDatabase } from '@achmadk/react-firebase/nextjs/database'
```

## B. Server-side
```diff
- import { useFirebaseDatabase } from '@achmadk/react-firebase/server'
+ import { useFirebaseDatabase } from '@achmadk/react-firebase/server/database'
```