# `@achmadk/react-firebase`

Easy integration between [React](https://react.dev) and [Firebase JavaScript SDK v10](https://firebase.google.com/docs/web/setup), both on client-side and server-side React applications.

## Table of Contents
- [Installation](#installation)
- [Usages](#usages)
  + [Inside client-side react application (`ViteJS + React`, or CRA)](#a-inside-client-side-react-application-vitejs--react-or-cra)
  + [Inside server-side react application (`nextJS`, `remix`, or `Astro + React`)](#b-inside-server-side-react-application-nextjs-remix-or-astro--react)
- [Comparisons between other react firebase integration libraries](#comparisons-between-other-react-firebase-integration-libraries)
- [Documentations](#documentations)

## Installation

```sh
# add `react` and `firebase` as peer dependencies of @achmadk/react-firebase
pnpm add react firebase @achmadk/react-firebase
# add `@types/react` as dev dependencies for TypeScript
pnpm add -D @types/react
```

## Usages

### a. Inside client-side react application (`ViteJS + React` or `CRA`)

```tsx
import { StrictMode } from 'react'
import { FirebaseProvider } from '@achmadk/react-firebase'

import { createRoot } from 'react-dom/client'

import { App } from './app'

const firebaseConfig = {} // copy your firebase config here

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <FirebaseProvider options={firebaseConfig}>
      <App />
    </FirebaseProvider>
  </StrictMode>
)
```

### b. Inside server-side react application (`nextJS`, `remix`, or `Astro + React`)

Please use `@achmadk/react-firebase/server` then import `FirebaseServerProvider`.

```tsx
import { FirebaseServerProvider } from '@achmadk/react-firebase/server'

import { App } from './app'

const firebaseConfig = {} // copy your firebase config here

    <FirebaseServerProvider options={firebaseConfig}>
      <App />
    </FirebaseServerProvider>
```

Please note that not all methods inside `@achmadk/react-firebase/server` provided like `@achmadk/react-firebase`. For example login with google, facebook, apple, etc. If you want to add that methods, please add `FirebaseProvider` component.
```tsx
import { FirebaseServerProvider } from '@achmadk/react-firebase/server'
import { FirebaseProvider } from '@achmadk/react-firebase'

import { App } from './app'

const firebaseConfig = {} // copy your firebase config here

    <FirebaseServerProvider options={firebaseConfig}>
      <FirebaseProvider options={firebaseConfig}>
        <App />
      </FirebaseProvider>
    </FirebaseServerProvider>
```

For nextjs developers, we also provide `@achmadk/react-firebase/nextjs`. It includes all components and hooks at `@achmadk/react-firebase`, with additional `"use client"` at the top of the file.
```diff
import { FirebaseServerProvider } from '@achmadk/react-firebase/server'
- import { FirebaseProvider } from '@achmadk/react-firebase'
+ import { FirebaseProvider } from '@achmadk/react-firebase/nextjs'

import { App } from './app'

const firebaseConfig = {} // copy your firebase config here

    <FirebaseServerProvider options={firebaseConfig}>
      <FirebaseProvider options={firebaseConfig}>
        <App />
      </FirebaseProvider>
    </FirebaseServerProvider>
```

## Comparisons between other react firebase integration libraries.
| differences | `react-firebase` | `react-firebase-hooks` | **`@achmadk/react-firebase`** |
| --- | --- | --- | --- |
| latest release | 7 years ago (not maintained anymore) | 2 years ago | already release |
| firebase support version | <10 | >=10 | >=10
| support nextjs out of the box | partial | partial | full support, with `@achmadk/react-firebase/nextjs` |
| provide HoC | `true` | `false` | `false` |
| provide hooks | `false` | `true` | `true` |
| provide context | `false` | `false` | `true` |
| support login to social medias out of the box | `false` | `true` | WIP |
| TypeScript support | `false` | `true` | `true` |
| tree-shaking support | `false` | `true` | `true` |
| firebase instance supports | only `database` | all except `analytics`, `app-check`, `app`, `installations`, `performance`, `remote-config`, and  `vertex-ai` | all |

## Documentations
This library contains JSDoc comments for modules and type definitions. You can hover it with your IDE.

You can have a look at those files:
- [App](/docs/app.md)
- [Analytics](/docs/analytics.md)
- [App Check](/docs/app-check.md)
- [Auth](/docs/auth.md)
- [Database](/docs/database.md)
- [Firestore](/docs/firestore.md)
- [Functions](/docs/functions.md)
- [Installations](/docs/installations.md)
- [Messaging](/docs/messaging.md)
- [Performance](/docs/performance.md)
- [Remote Config](/docs/remote-config.md)
- [Storage](/docs/storage.md)
- [Vertex AI](/docs/vertex-ai.md)