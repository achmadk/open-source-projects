# Functions module
We have several modules for firebase functions instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`

| module name | module type | description |
| --- | --- | --- |
| `DefaultUseFirebaseFunctionsOptions` | TypeScript type definition | options for `useFirebaseFunctions` hooks |
| `useFirebaseFunctions` | react hooks | hooks to get firebase functions instance |
| `useFirebaseFunctionsMethods` | react hooks | hooks to get methods which depends on firebase analytics instance. The available methods are `connectFunctionsEmulator`, `httpsCallable`, `httpsCallableFromURL` |

# Optimization

Please use either `@achmadk/react-firebase/functions` or `@achmadk/react-firebase/server/functions` instead of `@achmadk/react-firebase` when using analytics module, for example `useFirebaseFunctions`.

## A. Client-side
```diff
- import { useFirebaseFunctions } from '@achmadk/react-firebase'
+ import { useFirebaseFunctions } from '@achmadk/react-firebase/functions'
// OR
- import { useFirebaseFunctions } from '@achmadk/react-firebase/nextjs'
+ import { useFirebaseFunctions } from '@achmadk/react-firebase/nextjs/functions'
```

## B. Server-side
```diff
- import { useFirebaseFunctions } from '@achmadk/react-firebase/server'
+ import { useFirebaseFunctions } from '@achmadk/react-firebase/server/functions'
```