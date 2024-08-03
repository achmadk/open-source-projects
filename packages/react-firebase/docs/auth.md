# Auth module
We have several modules for firebase auth instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`.

| module name | module type | description |
| --- | --- | --- |
| `useFirebaseAuth` | react hooks | hooks to get firebase auth instance |
| `DefaultUseInitializeAuthOptions` | TypeScript type definition | options for `useInitializeAuth` hooks |
| `useInitializeAuth` | react hooks | hooks to easily create your own firebase analytics instances with `initializeAuth` method |
| `DefaultUseBeforeAuthStateChangedOptions` | TypeScript type definition | options for `useBeforeAuthStateChanged` hooks |
| `useBeforeAuthStateChanged` | react hooks | hooks to easily integrate `beforeAuthStateChanged` method into your react app. |
| `DefaultUseOnAuthStateChangedOptions` | TypeScript type definition | options for `useOnAuthStateChanged` hooks |
| `useOnAuthStateChanged` | react hooks | hooks to easily integrate `onAuthStateChanged` method into your react app. |
| `DefaultUseOnIdTokenChangedOptions` | TypeScript type definition | options for `useOnIdTokenChanged` hooks |
| `useOnIdTokenChanged` | react hooks | hooks to easily integrate `onIdTokenChanged` method into your react app. |
| `DefaultUseFirebaseAuthMethodsOptions` | TypeScript type definition | options for `useFirebaseAuthMethods` hooks |
| `useFirebaseAuthMethods` | react hooks | hooks to get methods which depends on firebase auth instance. |

Not all methods inside `useFirebaseAuthMethods` from `@achmadk/react-firebase/server` accesible like in `@achmadk/react-firebase`. According to the firebase docs:
> This method is not supported by Auth instances created with a `FirebaseServerApp`.

| Methods inside `useFirebaseAuthMethods` | `@achmadk/react-firebase` | `@achmadk/react-firebase/server` |
| --- | --- | --- |
| `applyActionCode` | ✅ | ✅ |
| `checkActionCode` | ✅ | ✅ |
| `createUserWithEmailAndPassword` | ✅ | ❌ |
| `confirmPasswordReset` | ✅ | ✅ |
| `connectAuthEmulator` | ✅ | ✅ |
| `getMultiFactorResolver` | ✅ | ✅ |
| `getRedirectResult` | ✅ | ❌ |
| `initializeRecaptchaConfig` | ✅ | ❌ |
| `isSignInWithEmailLink` | ✅ | ✅ |
| `revokeAccessToken` | ✅ | ✅ |
| `sendPasswordResetEmail` | ✅ | ✅ |
| `sendSignInLinkToEmail` | ✅ | ✅ |
| `setPersistence` | ✅ | ❌ |
| `signInAnonymously` | ✅ | ❌ |
| `signInWithEmailLink` | ✅ | ❌ |
| `signInWithCredential` | ✅ | ❌ |
| `signInWithCustomToken` | ✅ | ❌ |
| `signInWithEmailAndPassword` | ✅ | ❌ |
| `signInWithPhoneNumber` | ✅ | ❌ |
| `signInWithPopup` | ✅ | ❌ |
| `signInWithRedirect` | ✅ | ❌ |
| `signOut` | ✅ | ❌ |
| `updateCurrentUser` | ✅ | ❌ |
| `validatePassword` | ✅ | ✅ |

For example, you have successfully create a web app with AstroJS, ReactJS and `@achmadk/react-firebase/server`. And then you want to add sign in anonumously feature. You have to add `@achmadk/react-firebase` (`@achmadk/react-firebase/nextjs` for NextJS) for implementing that feature.

# Optimization

Please use either `@achmadk/react-firebase/auth` or `@achmadk/react-firebase/server/auth` instead of `@achmadk/react-firebase` when using auth module, for example `useFirebaseAuth`.

## A. Client-side
```diff
- import { useFirebaseAuth } from '@achmadk/react-firebase'
+ import { useFirebaseAuth } from '@achmadk/react-firebase/auth'
// OR
- import { useFirebaseAuth } from '@achmadk/react-firebase/nextjs'
+ import { useFirebaseAuth } from '@achmadk/react-firebase/nextjs/auth'
```

## B. Server-side
```diff
- import { useFirebaseAuth } from '@achmadk/react-firebase/server'
+ import { useFirebaseAuth } from '@achmadk/react-firebase/server/auth'
```