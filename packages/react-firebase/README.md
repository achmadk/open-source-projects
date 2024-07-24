# `@achmadk/react-firebase`

Easy integration between [React](https://react.dev) and [Firebase JavaScript SDK v10](https://firebase.google.com/docs/web/setup), both on client-side and server-side React applications.

## Installation

```sh
# add `react` and `firebase` as peer dependencies of @achmadk/react-firebase
pnpm add react firebase @achmadk/react-firebase
# add `@types/react` as dev dependencies for TypeScript
pnpm add -D @types/react
```

## Usages

### a. Inside client-side react application

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

### b. Inside server-side react application (`nextJS`, `remix`, or `Astro`)

Please use `@achmadk/react-firebase/server` then import `FirebaseServerProvider`.

```tsx
import { FirebaseServerProvider } from '@achmadk/react-firebase/server'

import { App } from './app'

const firebaseConfig = {} // copy your firebase config here

    <FirebaseServerProvider options={firebaseConfig}>
      <App />
    </FirebaseServerProvider>
```