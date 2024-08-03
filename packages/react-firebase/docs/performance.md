# Performance module
We have several modules for firebase performance instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`

| module name | module type | description |
| --- | --- | --- |
`DefaultUseInitializePerformanceOptions` | TypeScript type definition | options for `useInitializePerformance` hooks |
| `useInitializePerformance` | react hooks | hooks to easily create your own firebase analytics instances with `initializePerformance` method under the hood |
| `DefaultUseFirebasePerformanceMethodsOptions` | TypeScript type definition | options for `useInitializePerformanceMethods` hooks |
| `useInitializePerformanceMethods` | react hooks | hooks to get methods which depends on firebase analytics instance. The available methods are `trace` |

# Optimization

Please use either `@achmadk/react-firebase/performance` or `@achmadk/react-firebase/server/performance` instead of `@achmadk/react-firebase` when using analytics module, for example `useInitializePerformance`.

## A. Client-side
```diff
- import { useInitializePerformance } from '@achmadk/react-firebase'
+ import { useInitializePerformance } from '@achmadk/react-firebase/performance'
// OR
- import { useInitializePerformance } from '@achmadk/react-firebase/nextjs'
+ import { useInitializePerformance } from '@achmadk/react-firebase/nextjs/performance'
```

## B. Server-side
```diff
- import { useInitializePerformance } from '@achmadk/react-firebase/server'
+ import { useInitializePerformance } from '@achmadk/react-firebase/server/performance'
```