# Messaging module
We have several modules for firebase messaging instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`

| module name | module type | description |
| --- | --- | --- |
| `useFirebaseMessaging` | react hooks | hooks to get firebase analytics instance |
| `useOnMessage` | react hooks | hooks to easily implement `onMessage` method into your react app |
| `useFirebaseMessagingMethods` | react hooks | hooks to get methods which depends on firebase messaging instance. The available methods are `getToken` and `deleteToken` |

# Optimization

Please use either `@achmadk/react-firebase/messaging` or `@achmadk/react-firebase/server/messaging` instead of `@achmadk/react-firebase` when using analytics module, for example `useFirebaseMessaging`.

## A. Client-side
```diff
- import { useFirebaseMessaging } from '@achmadk/react-firebase'
+ import { useFirebaseMessaging } from '@achmadk/react-firebase/messaging'
// OR
- import { useFirebaseMessaging } from '@achmadk/react-firebase/nextjs'
+ import { useFirebaseMessaging } from '@achmadk/react-firebase/nextjs/messaging'
```

## B. Server-side
```diff
- import { useFirebaseMessaging } from '@achmadk/react-firebase/server'
+ import { useFirebaseMessaging } from '@achmadk/react-firebase/server/messaging'
```