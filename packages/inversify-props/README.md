# `@achmadk/inversify-props`

This package is a wrapper of [`@achmadk/inversify` (ES Module Support)](https://github.com/achmadk/open-source-projects/tree/main/packages/inversify) to simplify how inject your dependencies with property decorators in the components, made with TypeScript and compatible with Vue, React and other component libraries.

Do you use React Hooks? You can try the package [@achmadk/inversify-hooks](https://github.com/achmadk/open-source-projects/tree/main/packages/inversify-hooks) with ES Module support.

![logo](https://i.imgur.com/syVbzU6.gif)

## Installation

Install peer dependencies of this package, `@achmadk/inversify` and `@abraham/reflection`
```bash
$ npm install @achmadk/inversify-props @achmadk/inversify @abraham/reflection --save
```

The `@achmadk/inversify-props` has built-in typescript definitions without install @types/*.

## How to use

1. Create a sample service and controller, for example `UserService` and `UserController`.

```ts
// ./src/services/user.ts
export interface User {
  id: string
  name: string
  address: string
}

export interface IServiceUser {
  getUsers(): Promise<User[]>
}

export const SERVICE_USER = 'SERVICE_USER'

export class ServiceUser implements IServiceUser {
  async getUsers() {
    const users: User[] = []
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(users)
      }, 3000)
    })
  }
}
// ./src/services/index.ts
export * from './user'

// ./src/controllers/user.ts
import { User, IServiceUser } from '../../services'

export interface IControllerUser {
  getUserLists(): Promise<User[] | null>
}

export const CONTROLLER_USER = 'CONTROLLER_USER'

export class ControllerUser implements IControllerUser {
  #serviceUser!: IServiceUser

  constructor(serviceUser: IServiceUser) {
    this.#serviceUser = serviceUser
  }

  async getUserLists() {
    const users = await this.#serviceUser.getUsers()
    if (users && Array.isArray(users)) {
      return users
    }
    return null
  }
}


// ./src/controllers/index.ts
export * from './user'
```

2. Add all of your service and controllers into `container`.

```ts
// ./src/di/index.ts
import { container as defaultContainer } from '@achmadk/inversify-props';

import { IServiceUser, SERVICE_USER, ServiceUser } from '../../services';
import { IControllerUser, CONTROLLER_USER, ControllerUser } from '../../controllers';

function setContainer(container = defaultContainer) {
  container
    .bind<IServiceUser>(SERVICE_USER)
    .to(ServiceUser)

  container
    .bind<IControllerUser>(CONTROLLER_USER)
    .toDynamicValue(({ container: c }) =>
      new ControllerUser(c.get(SERVICE_USER))
    )
  return container
}

export const container = setContainer()
```

## Why we made this package

The idea is to add a simple wrapper that helps us to inject dependencies in components using `property decorators`, we have also extend a little `inversify` adding some methods that make our experience injecting dependencies easier.

**You probably don't need this if:**

- You have experience using inversify and you don't need to simplify the process.
- You want to use all the power of inversify, we are only injecting dependencies like services, helpers, utils...
- You don't want to inject your dependencies as properties.

## How to register a dependency

Inversify needs an id to register our dependencies, this wrapper is going to do this for you 'magically' but if you want to uglify the code, keep reading the docs 🤓.

First of all create a class and an interface with the public methods of your class.

```ts
// iservice1.ts
export interface IService1 {
  method1(): string;
}

// service.ts
export class Service1 implements IService1 {
  method1(): string {
    return 'method 1';
  }
}
```

Now is time to register the service in the container, we usually do that in `app.container.ts` or `app.ts`.

```ts
container.addSingleton<IService1>(Service1);
```

## How to test

There are some helper functions to test, the recommended way to test is beforeEach test:

1. Reset the Container
2. Register again all the dependencies of the container (this is your job)
3. Mock all the necessary dependencies for the test

```ts
beforeEach(() => {
  resetContainer();
  containerBuilder();
  mockSingleton<IHttpService>(cid.IHttpService, HttpServiceMock);
});
```

## Other ways to register a class

As [inversify accepts](https://github.com/inversify/InversifyJS/blob/master/wiki/scope.md), we have configured three types of registration.

- Singleton: The dependency will be created only once, one dependency - one object.
- Transient: The dependency will be created each time is injected, one dependency - one object per injection.
- Request: Special case of singleton, more info in [official docs](https://github.com/inversify/InversifyJS/blob/master/wiki/scope.md#about-inrequestscope).
