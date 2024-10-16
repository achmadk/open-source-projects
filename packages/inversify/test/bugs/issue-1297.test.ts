import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import * as interfaces from "../../src/interfaces"
import { Container, injectable } from '../../src';

describe('Issue 1297', () => {
  let container: Container

  beforeEach(() => {
    container = new Container()
  })

  afterEach(() => {
    container = null as unknown as Container
  })

  it('should call onActivation once if the service is a constant value binding', () => {
    const bind = container
      .bind<string>('message')
      .toConstantValue('Hello world')
    const onActivationHandlerSpy = vi.spyOn(bind, 'onActivation');

    bind.onActivation(() => 'OK');

    container.get('message');

    expect(onActivationHandlerSpy).toHaveBeenCalled();
  });

  it('should call onActivation once if the service is a factory binding', () => {

    @injectable()
    class Katana {
      public hit() {
        return 'cut!';
      }
    }

    container.bind<Katana>('Katana').to(Katana);

    const bind = container
        .bind<interfaces.Factory<Katana>>('Factory<Katana>')
        .toFactory<Katana>((context) => () =>
          context.container.get<Katana>('Katana')
        )
    const onActivationHandlerSpy = vi.spyOn(bind, 'onActivation');
    bind.onActivation(() => () => {
      console.log('OK')
      return new Katana()
    })

    container.get('Factory<Katana>');
    container.get('Factory<Katana>');

    expect(onActivationHandlerSpy).toHaveBeenCalled();
  });

  it('should call onActivation once if the service is an auto factory binding', () => {

    @injectable()
    class Katana {
      public hit() {
        return 'cut!';
      }
    }

    container.bind<Katana>('Katana').to(Katana);
    const bindAutoFactory = container
      .bind<interfaces.Factory<Katana>>('Factory<Katana>')
      .toAutoFactory<Katana>('Katana')

    const onActivationHandlerSpy = vi.spyOn(bindAutoFactory, 'onActivation')

    bindAutoFactory.onActivation(() => () => new Katana());

    container.get('Factory<Katana>');
    container.get('Factory<Katana>');

    expect(onActivationHandlerSpy).toHaveBeenCalled();
  });

  it('should call onActivation once if the service is a function binding', () => {
    const bindFunction = container.bind<() => string>('message')
      .toFunction(() => 'Hello world')

    const onActivationHandlerSpy = vi.spyOn(bindFunction, "onActivation")
    bindFunction.onActivation(() => () => 'OK');

    container.get('message');
    container.get('message');

    expect(onActivationHandlerSpy).toHaveBeenCalled();
  });

  it('should call onActivation once if the service is a constructor binding', () => {

    @injectable()
    class Katana {
      public hit() {
        return 'cut!';
      }
    }
    const constructorBinding = container.bind('Katana')
      .toConstructor<Katana>(Katana)

    const onActivationHandlerSpy = vi.spyOn(constructorBinding, "onActivation")
    constructorBinding.onActivation(() => 'OK');

    container.get('Katana');
    container.get('Katana');

    expect(onActivationHandlerSpy).toHaveBeenCalled();
  });

  it('should call onActivation once if the service is a provider binding', () => {

    @injectable()
    class Katana {
      public hit() {
        return 'cut!';
      }
    }
    const providerBind = container.bind('Provider<Katana>')
      .toProvider<Katana>(() =>
        () =>
          Promise.resolve(new Katana()))
    const onActivationHandlerSpy = vi.spyOn(providerBind, "onActivation")
    providerBind.onActivation(() => "OK");

    container.get('Provider<Katana>');
    container.get('Provider<Katana>');

    expect(onActivationHandlerSpy).toHaveBeenCalled();
  });
});