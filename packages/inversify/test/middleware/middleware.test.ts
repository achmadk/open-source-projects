import { describe, it, expect } from 'vitest'

import { injectable } from '../../src/annotation/injectable';
import * as ERROR_MSGS from '../../src/constants/error_msgs';
import { Container } from '../../src/container/container';
import * as interfaces from '../../src/interfaces';

describe('Middleware', () => {

  it('Should be able to use middleware as Container configuration', () => {

    const container = new Container();

    const log: string[] = [];

    function middleware1(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware1: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    container.applyMiddleware(middleware1);
    const _container = container;
    expect((_container as unknown as { _middleware: unknown })._middleware).not.toEqual(null);

  });

  it('Should support middleware', () => {

    interface Ninja { }

    @injectable()
    class Ninja implements Ninja { }

    const container = new Container();

    const log: string[] = [];

    function middleware1(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware1: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    function middleware2(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware2: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    // two middlewares applied at one single point in time
    container.applyMiddleware(middleware1, middleware2);

    container.bind<Ninja>('Ninja').to(Ninja);

    const ninja = container.get<Ninja>('Ninja');

    expect(ninja instanceof Ninja).toEqual(true);
    expect(log.length).toEqual(2);
    expect(log[0]).toEqual('Middleware2: Ninja');
    expect(log[1]).toEqual('Middleware1: Ninja');

  });

  it('Should allow applyMiddleware at multiple points in time', () => {

    interface Ninja { }

    @injectable()
    class Ninja implements Ninja { }

    const container = new Container();

    const log: string[] = [];

    function middleware1(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware1: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    function middleware2(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware2: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    container.applyMiddleware(middleware1); // one point in time
    container.applyMiddleware(middleware2);  // another point in time
    container.bind<Ninja>('Ninja').to(Ninja);

    const ninja = container.get<Ninja>('Ninja');

    expect(ninja instanceof Ninja).toEqual(true);
    expect(log.length).toEqual(2);
    expect(log[0]).toEqual('Middleware2: Ninja');
    expect(log[1]).toEqual('Middleware1: Ninja');

  });

  it('Should use middleware', () => {

    interface Ninja { }

    @injectable()
    class Ninja implements Ninja { }

    const container = new Container();

    const log: string[] = [];

    function middleware1(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware1: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    function middleware2(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        log.push(`Middleware2: ${args.serviceIdentifier.toString()}`);
        return planAndResolve(args);
      };
    }

    container.applyMiddleware(middleware1, middleware2);
    container.bind<Ninja>('Ninja').to(Ninja);

    const ninja = container.get<Ninja>('Ninja');

    expect(ninja instanceof Ninja).toEqual(true);
    expect(log.length).toEqual(2);
    expect(log[0]).toEqual('Middleware2: Ninja');
    expect(log[1]).toEqual('Middleware1: Ninja');

  });

  it('Should be able to use middleware to catch errors during pre-planning phase', () => {

    interface Ninja { }

    @injectable()
    class Ninja implements Ninja { }

    const container = new Container();

    const log: string[] = [];

    function middleware(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        try {
          return planAndResolve(args);
        } catch (e) {
          log.push((e as Error).message);
          return [];
        }
      };
    }

    container.applyMiddleware(middleware);
    container.bind<Ninja>('Ninja').to(Ninja);
    container.get('SOME_NOT_REGISTERED_ID');
    expect(log.length).toEqual(1);
    expect(log[0]).toEqual(`${ERROR_MSGS.NOT_REGISTERED} SOME_NOT_REGISTERED_ID`);

  });

  it('Should be able to use middleware to catch errors during planning phase', () => {

    interface Warrior { }

    @injectable()
    class Ninja implements Warrior { }

    @injectable()
    class Samurai implements Warrior { }

    const container = new Container();

    const log: string[] = [];

    function middleware(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        try {
          return planAndResolve(args);
        } catch (e) {
          log.push((e as Error).message);
          return [];
        }
      };
    }

    container.applyMiddleware(middleware);
    container.bind<Warrior>('Warrior').to(Ninja);
    container.bind<Warrior>('Warrior').to(Samurai);

    container.get('Warrior');
    expect(log.length).toEqual(1);
    expect(log[0]).toContain(`${ERROR_MSGS.AMBIGUOUS_MATCH} Warrior`);

  });

  it('Should be able to use middleware to catch errors during resolution phase', () => {

    interface Warrior { }

    const container = new Container();

    const log: string[] = [];

    function middleware(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        try {
          return planAndResolve(args);
        } catch (e) {
          log.push((e as Error).message);
          return [];
        }
      };
    }

    container.applyMiddleware(middleware);
    container.bind<Warrior>('Warrior'); // Invalid binding missing BindingToSyntax

    container.get('Warrior');
    expect(log.length).toEqual(1);
    expect(log[0]).toEqual(`${ERROR_MSGS.INVALID_BINDING_TYPE} Warrior`);

  });

  it('Should help users to identify problems with middleware', () => {

    const container = new Container();

    function middleware(planAndResolve: interfaces.Next): interfaces.Next {
      // @ts-ignore
      return (args: interfaces.NextArgs) => {
        try {
          return planAndResolve(args);
        } catch (e) {
          // missing return!
        }
      };
    }

    container.applyMiddleware(middleware);
    const throws = () => { container.get('SOME_NOT_REGISTERED_ID'); };
    expect(throws).toThrow(ERROR_MSGS.INVALID_MIDDLEWARE_RETURN);

  });

  it('Should allow users to intercept a resolution context', () => {

    interface Ninja { }

    @injectable()
    class Ninja implements Ninja { }

    const container = new Container();

    const log: string[] = [];

    function middleware1(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        const nextContextInterceptor = args.contextInterceptor;
        args.contextInterceptor = (context: interfaces.Context) => {
          log.push(`contextInterceptor1: ${args.serviceIdentifier.toString()}`);
          return nextContextInterceptor !== null ? nextContextInterceptor(context) : context;
        };
        return planAndResolve(args);
      };
    }

    function middleware2(planAndResolve: interfaces.Next): interfaces.Next {
      return (args: interfaces.NextArgs) => {
        const nextContextInterceptor = args.contextInterceptor;
        args.contextInterceptor = (context: interfaces.Context) => {
          log.push(`contextInterceptor2: ${args.serviceIdentifier.toString()}`);
          return nextContextInterceptor !== null ? nextContextInterceptor(context) : context;
        };
        return planAndResolve(args);
      };
    }

    container.applyMiddleware(middleware1, middleware2);
    container.bind<Ninja>('Ninja').to(Ninja);

    const ninja = container.get<Ninja>('Ninja');

    expect(ninja instanceof Ninja).toEqual(true);
    expect(log.length).toEqual(2);
    expect(log[0]).toEqual('contextInterceptor1: Ninja');
    expect(log[1]).toEqual('contextInterceptor2: Ninja');

  });

});