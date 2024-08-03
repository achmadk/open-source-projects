# Analytics module
We have several modules for firebase analytics instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`

| module name | module type | description |
| --- | --- | --- |
| `useFirebaseAnalytics` | react hooks | hooks to get firebase analytics instance |
| `DefaultUseInitializeAnalyticsOptions` | TypeScript type definition | options for `useInitializeAnalytics` hooks |
| `useInitializeAnalytics` | react hooks | hooks to easily create your own firebase analytics instances with `initializeAnalytics` method |
| `DefaultUseFirebaseAnalyticsMethodsOptions` | TypeScript type definition | options for `useFirebaseAnalyticsMethods` hooks |
| `useFirebaseAnalyticsMethods` | react hooks | hooks to get methods which depends on firebase analytics instance. The available methods are `getGoogleAnalyticsClientId`, `logEvent`, `setAnalyticsCollectionEnabled`, `setUserId`, and  `setUserProperties` |

# Optimization

Please use either `@achmadk/react-firebase/analytics` or `@achmadk/react-firebase/server/analytics` instead of `@achmadk/react-firebase` when using analytics module, for example `useFirebaseAnalytics`.

## A. Client-side
```diff
- import { useFirebaseAnalytics } from '@achmadk/react-firebase'
+ import { useFirebaseAnalytics } from '@achmadk/react-firebase/analytics'
// OR
- import { useFirebaseAnalytics } from '@achmadk/react-firebase/nextjs'
+ import { useFirebaseAnalytics } from '@achmadk/react-firebase/nextjs/analytics'
```

## B. Server-side
```diff
- import { useFirebaseAnalytics } from '@achmadk/react-firebase/server'
+ import { useFirebaseAnalytics } from '@achmadk/react-firebase/server/analytics'
```