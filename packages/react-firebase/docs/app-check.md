# App Check module
We have several modules for firebase app check instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`

| module name | module type | description |
| --- | --- | --- |
| `DefaultUseInitializeAppCheckOptions` | TypeScript type definition | options for `useInitializeAppCheck` hooks |
| `useInitializeAppCheck` | react hooks | hooks to easily create your own firebase app check instances with `initializeAppCheck` method |
| `DefaultUseOnTokenChangedOptions` | TypeScript type definition | options for `useOnTokenChanged` hooks |
| `useOnTokenChanged` | react hooks | hooks to track app check token value with firebase app check `onTokenChanged` method |
| `DefaultUseFirebaseAppCheckMethodsOptions` | TypeScript type definition | options for `useFirebaseAppCheckMethods` hooks |
| `useFirebaseAppCheckMethods` | react hooks | hooks to get methods which depends on firebase app check instance. The available methods are `getLimitedUseToken`, `getToken`, and `setTokenAutoRefreshEnabled` |

# Optimization

Please use either `@achmadk/react-firebase/app-check` or `@achmadk/react-firebase/server/app-check` instead of `@achmadk/react-firebase` when using app check module, for example `useInitializeAppCheck`.

## A. Client-side
```diff
- import { useInitializeAppCheck } from '@achmadk/react-firebase'
+ import { useInitializeAppCheck } from '@achmadk/react-firebase/app-check'
// OR
- import { useInitializeAppCheck } from '@achmadk/react-firebase/nextjs'
+ import { useInitializeAppCheck } from '@achmadk/react-firebase/nextjs/app-check'
```

## B. Server-side
```diff
- import { useInitializeAppCheck } from '@achmadk/react-firebase/server'
+ import { useInitializeAppCheck } from '@achmadk/react-firebase/server/app-check'
```