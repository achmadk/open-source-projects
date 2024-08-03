# Remote Config module
We have several modules for firebase remote config instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`

useFirebaseRemoteConfig
useFirebaseRemoteConfigMethods
activate,
    ensureInitialized,
    fetchAndActivate,
    fetchConfig,
    getAll,
    getBoolean,
    getNumber,
    getString,
    getValue,
    setLogLevel,

| module name | module type | description |
| --- | --- | --- |
| `useFirebaseRemoteConfig` | react hooks | hooks to get firebase remote config instance |
`useFirebaseRemoteConfigMethods` | react hooks | hooks to get methods which depends on firebase analytics instance. The available methods are `activate`, `ensureInitialized`, `fetchAndActivate`, `fetchConfig`, `getAll`, `getBoolean`, `getNumber`, `getString`, `getValue`, and `setLogLevel` |

# Optimization

Please use either `@achmadk/react-firebase/remote-config` or `@achmadk/react-firebase/server/remote-config` instead of `@achmadk/react-firebase` when using remote config module, for example `useFirebaseRemoteConfig`.

## A. Client-side
```diff
- import { useFirebaseRemoteConfig } from '@achmadk/react-firebase'
+ import { useFirebaseRemoteConfig } from '@achmadk/react-firebase/remote-config'
// OR
- import { useFirebaseRemoteConfig } from '@achmadk/react-firebase/nextjs'
+ import { useFirebaseRemoteConfig } from '@achmadk/react-firebase/nextjs/remote-config'
```

## B. Server-side
```diff
- import { useFirebaseRemoteConfig } from '@achmadk/react-firebase/server'
+ import { useFirebaseRemoteConfig } from '@achmadk/react-firebase/server/remote-config'
```