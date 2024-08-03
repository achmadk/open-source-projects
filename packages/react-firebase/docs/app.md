# App module
## A. Client-side
We have several modules for firebase app instance from `@achmadk/react-firebase` and `@achmadk/react-firebase/nextjs`

| module name | module type | description |
| --- | --- | --- |
| `FirebaseContext` | react context | default value of `context` props inside `FirebaseProvider` |
| `FirebaseContextType` | TypeScript type definition | type definition for your custom react firebase context |
| `FirebaseProvider` | react component | wrapper component which store your firebase configurations |
| `FirebaseProviderProps` | TypeScript type definition | props for `FirebaseProvider` component |
| `useFirebaseApp` | react hooks | hooks to get your firebase app instance |
| `DefaultReactFirebaseHooksOptions` | TypeScript type definition | options for `useFirebaseApp` hooks |

## B. Server-side
We have several modules for firebase app instance from `@achmadk/react-firebase/server`

| module name | module type | description |
| --- | --- | --- |
| `FirebaseServerContext` | react context | default value of `context` props inside `FirebaseServerProvider` |
| `FirebaseServerContextType` | TypeScript type definition | type definition for your custom react firebase context |
| `FirebaseServerProvider` | react component | wrapper component which store your firebase configurations |
| `FirebaseServerProviderProps` | TypeScript type definition | props for `FirebaseServerProvider` component |
| `useFirebaseServerApp` | react hooks | hooks to get your firebase app instance |
| `DefaultReactFirebaseServerHooksOptions` | TypeScript type definition | options for `useFirebaseServerApp` hooks |

# Optimization

Please use `@achmadk/react-firebase/app` instead of `@achmadk/react-firebase` when using `FirebaseProvider`.

## A. Client-side
```diff
- import { FirebaseProvider } from '@achmadk/react-firebase'
+ import { FirebaseProvider } from '@achmadk/react-firebase/app'
// OR
+ import { FirebaseProvider } from '@achmadk/react-firebase/nextjs/app'
```

## B. Server-side
```diff
- import { FirebaseProvider } from '@achmadk/react-firebase/server'
+ import { FirebaseProvider } from '@achmadk/react-firebase/server/app'
```