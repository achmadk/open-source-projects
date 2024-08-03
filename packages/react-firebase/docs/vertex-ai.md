# Vertex AI module
We have several modules for firebase vertex AI instance, both from `@achmadk/react-firebase` and `@achmadk/react-firebase/server`

| module name | module type | description |
| --- | --- | --- |
| `DefaultUseFirebaseVertexAIOptions` | TypeScript type definition | options for `useFirebaseVertexAI` hooks |
| `useFirebaseVertexAI` | react hooks | hooks to get firebase vertex AI instance |
| `useFirebaseVertexAIMethods` | react hooks | hooks to get methods which depends on firebase vertex AI instance. The available methods are `getGenerativeModel`. |

# Optimization

Please use either `@achmadk/react-firebase/vertex-ai` or `@achmadk/react-firebase/server/vertex-ai` instead of `@achmadk/react-firebase` when using analytics module, for example `useFirebaseVertexAI`.

## A. Client-side
```diff
- import { useFirebaseVertexAI } from '@achmadk/react-firebase'
+ import { useFirebaseVertexAI } from '@achmadk/react-firebase/vertex-ai'
// OR
- import { useFirebaseVertexAI } from '@achmadk/react-firebase/nextjs'
+ import { useFirebaseVertexAI } from '@achmadk/react-firebase/nextjs/vertex-ai'
```

## B. Server-side
```diff
- import { useFirebaseVertexAI } from '@achmadk/react-firebase/server'
+ import { useFirebaseVertexAI } from '@achmadk/react-firebase/server/vertex-ai'
```