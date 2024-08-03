# Installations module
We have several modules for firebase installations instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`

| module name | module type | description |
| --- | --- | --- |
| `useFirebaseInstallations` | react hooks | hooks to get firebase installations instance |
| `DefaultUseOnIdChangeOptions` | TypeScript type definition | options for `useOnIdChange` hooks |
| `useOnIdChange` | react hooks | hooks to easily implement `onIdChange` method into your react app |
| `useFirebaseInstallationsMethods` | react hooks | hooks to get methods which depends on firebase installations instance. The available methods are `deleteInstallations`, `getId`, `getToken` |

# Optimization

Please use either `@achmadk/react-firebase/installations` or `@achmadk/react-firebase/server/installations` instead of `@achmadk/react-firebase` when using analytics module, for example `useFirebaseInstallations`.

## A. Client-side
```diff
- import { useFirebaseInstallations } from '@achmadk/react-firebase'
+ import { useFirebaseInstallations } from '@achmadk/react-firebase/installations'
// OR
- import { useFirebaseInstallations } from '@achmadk/react-firebase/nextjs'
+ import { useFirebaseInstallations } from '@achmadk/react-firebase/nextjs/installations'
```

## B. Server-side
```diff
- import { useFirebaseInstallations } from '@achmadk/react-firebase/server'
+ import { useFirebaseInstallations } from '@achmadk/react-firebase/server/installations'
```