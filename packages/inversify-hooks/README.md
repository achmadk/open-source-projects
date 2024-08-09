# `@achmadk/inversify-hooks`

Easily integrate your react app with `@achmadk/inversify-props`.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usages](#usages)
- [Examples](#examples)

## Prerequisites
- `react`,
- `@types/react` (for TypeScript users)
- peer dependencies of `@achmadk/inversify-props` (`@abraham/reflection` and `@achmadk/inversify`)

## Installation
Install `@achmadk/inversify-hooks` and its dependencies with your favorite package manager.
```sh
# npm
npm i @achmadk/inversify-hooks react @abraham/reflection @achmadk/inversify @achmadk/inversify-props
npm i -D @types/react
# yarn
yarn add @achmadk/inversify-hooks react @abraham/reflection @achmadk/inversify @achmadk/inversify-props
yarn add -D @types/react
# pnpm
pnpm add @achmadk/inversify-hooks react @abraham/reflection @achmadk/inversify @achmadk/inversify-props
pnpm add -D @types/react
```

## Usages
We provides several modules:

1. `ContainerProvider`

Provider component to store your `container` which can be reused in both `useContainer` and `useContainerGet` hooks.

2. `ContainerProviderProps`

Prop Type definitions of `ContainerProvider` component.

3. `ContainerContext`

Default `context` props of `ContainerProvider` component.

4. `ContainerContextType`

Type definition for `ContainerContext`.

5. `useContainer`.

React hooks to get your `container`.

6. `useContainerGet`.

Get implementation of container's module. Same as `container.get()` in `inversify`.

## Examples
1. Define and create your service, for example user service.
```tsx
// user.service.(js|ts) file
export interface User {
  id: string
  firstName: string
  lastName: string
  address: string
}

export interface IUserService<
  Data extends User = User
> {
  getUsers(): Promise<Data[]>
}

export const USER_SERVICE = 'USER_SERVICE'

export class UserService<
  Data extends User = User
> implements IUserService<Data> {
  async getUsers() {
    const data = [
      {
        id: 1,
        firstName: 'Achmad',
        lastName: 'Kurnianto',
        address: 'Sleman, Yogyakarta, Indonesia'
      },
      {
        id: 2,
        firstName: 'Khadijah',
        lastName: 'Naureen',
        address: 'Klaten, Jawa Tengah, Indonesia'
      }
    ]
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data)
      }, 3000)
    })
  }
}
```

2. Whatever your application architecture, wrap your models, controllers, and others into `container`.

```tsx
// di.(js|ts) file
import { container as defaultContainer } from '@achmadk/inversify-hooks'
import { UserService, IUserService } from './user.service'

function getContainer(container = defaultContainer) {
    container
      .bind<IUserService>(USER_SERVICE)
      .to(UserService)
    return container
}

export const container = getContainer()
```

3. add `ContainerProvider` into the top of react component, then set `value` props to `container` constant which stored inside `di.ts` file.

```tsx
// main.tsx file
import { ContainerProvider } from '@achmadk/inversify-hooks'
import { createRoot } from 'react-dom/client'

import { App } from './app'

import { container } from './di'

const root = createRoot(document.getElementById('app'))
root.render(
  <ContainerProvider value={container}>
    <App />
  </ContainerProvider>
)
```

4. Create your component which consume your service. For example lets create and `App` component which will use `UserService` module.
```tsx
// App.tsx file
import { useEffect, useState } from 'react'
import { useContainerGet } from '@achmadk/inversify-hooks'

import { USER_SERVICE, IUserService, User } from './user.service'

export const App = () => {
  const [users, setUsers] = useState<User[] | null>(null)
  const userService = useContainerGet<IUserService<User>>(USER_SERVICE)

  const getData = async () => {
    const users = await userService.getUsers()
    setUsers(users)
  }

  useEffect(() => {
    getData()
  }, [])

  if (users && Array.isArray(users)) {
    return (
      <>
        {users.map((user) => (<p key={user.id}>{`${user.firstName} ${user.lastName}`}</p>))}
      </>
    )
  }
  return 'No users found'
}
