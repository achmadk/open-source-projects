import { describe, it, expect } from 'vitest'

import { getMetadata } from '@abraham/reflection';

import { _decorate, _param, decorate } from '../../src/annotation/decorator_utils';
import { inject } from '../../src/annotation/inject';
import { LazyServiceIdentifier } from '../../src/annotation/lazy_service_identifier';
import { multiInject } from '../../src/annotation/multi_inject';
import * as ERROR_MSGS from '../../src/constants/error_msgs';
import * as METADATA_KEY from '../../src/constants/metadata_keys';
import type * as interfaces from '../../src/interfaces';

// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface Katana {}
// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface Shuriken {}
// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface Sword {}
class Katana implements Katana {}
class Shuriken implements Shuriken {}
class Sword implements Sword {}

const lazySwordId = new LazyServiceIdentifier(() => 'Sword');

class DecoratedWarrior {
  private _primaryWeapon: Katana;
  private _secondaryWeapon: Shuriken;
  private _tertiaryWeapon: Sword;

  public constructor(
    @inject('Katana') primary: Katana,
    @inject('Shuriken') secondary: Shuriken,
    @inject(lazySwordId) tertiary: Shuriken
  ) {
    this._primaryWeapon = primary;
    this._secondaryWeapon = secondary;
    this._tertiaryWeapon = tertiary;
  }

  public debug() {
    return {
      primaryWeapon: this._primaryWeapon,
      secondaryWeapon: this._secondaryWeapon,
      tertiaryWeapon: this._tertiaryWeapon,
    };
  }
}

class InvalidDecoratorUsageWarrior {
  private _primaryWeapon: Katana;
  private _secondaryWeapon: Shuriken;

  public constructor(primary: Katana, secondary: Shuriken) {
    this._primaryWeapon = primary;
    this._secondaryWeapon = secondary;
  }

  public test(_a: string) {
    /*...*/
  }

  public debug() {
    return {
      primaryWeapon: this._primaryWeapon,
      secondaryWeapon: this._secondaryWeapon,
    };
  }
}

describe('@inject', () => {
  it('Should generate metadata for named parameters', () => {
    const metadataKey = METADATA_KEY.TAGGED;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const paramsMetadata = getMetadata<any[]>(metadataKey, DecoratedWarrior);
    expect(paramsMetadata).toBeDefined();

    // assert metadata for first argument
    expect(paramsMetadata?.['0']).toBeInstanceOf(Array);
    const m1: interfaces.Metadata = paramsMetadata?.['0']?.[0];
    expect(m1.key).toEqual(METADATA_KEY.INJECT_TAG);
    expect(m1.value).toEqual('Katana');
    expect(paramsMetadata?.['0']?.[1]).toEqual(undefined);

    // assert metadata for second argument
    expect(paramsMetadata?.['1']).toBeInstanceOf(Array);
    const m2: interfaces.Metadata = paramsMetadata?.['1']?.[0];
    expect(m2.key).toEqual(METADATA_KEY.INJECT_TAG);
    expect(m2.value).toEqual('Shuriken');
    expect(paramsMetadata?.['1']?.[1]).toEqual(undefined);

    // assert metadata for second argument
    expect(paramsMetadata?.['2']).toBeInstanceOf(Array);
    const m3: interfaces.Metadata = paramsMetadata?.['2']?.[0];
    expect(m3.key).toEqual(METADATA_KEY.INJECT_TAG);
    expect(m3.value).toEqual(lazySwordId);
    expect(paramsMetadata?.['2']?.[1]).toEqual(undefined);

    // no more metadata should be available
    expect(paramsMetadata?.['3']).toEqual(undefined);
  });

  it('Should throw when applied multiple times', () => {
    // biome-ignore lint/complexity/useArrowFunction: <explanation>
    const useDecoratorMoreThanOnce = function () {
      _decorate(
        [
          _param(0, inject('Katana') as ParameterDecorator),
          _param(0, inject('Shurien') as ParameterDecorator),
        ],
        InvalidDecoratorUsageWarrior
      );
    };

    const msg = `${ERROR_MSGS.DUPLICATED_METADATA} ${METADATA_KEY.INJECT_TAG}`;
    expect(useDecoratorMoreThanOnce).toThrow(msg);
  });

  it('Should throw when not applied to a constructor', () => {
    // biome-ignore lint/complexity/useArrowFunction: <explanation>
    const useDecoratorOnMethodThatIsNotAConstructor = function () {
      _decorate(
        [_param(0, inject('Katana') as ParameterDecorator)],
        InvalidDecoratorUsageWarrior.prototype,
        'test',
        Object.getOwnPropertyDescriptor(
          InvalidDecoratorUsageWarrior.prototype,
          'test'
        )
      );
    };

    const msg = `${ERROR_MSGS.INVALID_DECORATOR_OPERATION}`;
    expect(useDecoratorOnMethodThatIsNotAConstructor).toThrow(msg);
  });

  it('Should throw when applied with undefined', () => {
    // this can happen when there is circular dependency between symbols
    // biome-ignore lint/complexity/useArrowFunction: <explanation>
        const useDecoratorWithUndefined = function () {
      _decorate(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        [_param(0, inject(undefined as any) as ParameterDecorator)],
        InvalidDecoratorUsageWarrior
      );
    };

    const msg = `${ERROR_MSGS.UNDEFINED_INJECT_ANNOTATION(
      'InvalidDecoratorUsageWarrior'
    )}`;
    expect(useDecoratorWithUndefined).toThrow(msg);
  });

  it('Should be usable in VanillaJS applications', () => {
    // biome-ignore lint/suspicious/noEmptyInterface: <explanation>
    interface Shurien {}

    // biome-ignore lint/complexity/useArrowFunction: <explanation>
    const VanillaJSWarrior = (function () {
      function Warrior(_primary: Katana, _secondary: Shurien) {
        // ...
      }
      return Warrior;
    })();

    decorate(inject('Katana') as ClassDecorator, VanillaJSWarrior, 0);
    decorate(inject('Shurien') as ClassDecorator, VanillaJSWarrior, 1);

    const metadataKey = METADATA_KEY.TAGGED;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const paramsMetadata = getMetadata<any[]>(metadataKey, VanillaJSWarrior);
    expect(paramsMetadata).toBeDefined();

    // assert metadata for first argument
    expect(paramsMetadata?.['0']).toBeInstanceOf(Array);
    const m1: interfaces.Metadata = paramsMetadata?.['0']?.[0];
    expect(m1.key).toEqual(METADATA_KEY.INJECT_TAG);
    expect(m1.value).toEqual('Katana');
    expect(paramsMetadata?.['0']?.[1]).toEqual(undefined);

    // assert metadata for second argument
    expect(paramsMetadata?.['1']).toBeInstanceOf(Array);
    const m2: interfaces.Metadata = paramsMetadata?.['1']?.[0];
    expect(m2.key).toEqual(METADATA_KEY.INJECT_TAG);
    expect(m2.value).toEqual('Shurien');
    expect(paramsMetadata?.['1']?.[1]).toEqual(undefined);

    // no more metadata should be available
    expect(paramsMetadata?.['2']).toEqual(undefined);
  });

  it('should throw when applied inject decorator with undefined service identifier to a property', () => {
    expect(() => {
      // @ts-ignore
      class WithUndefinedInject { // eslint-disable-line
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        @inject(undefined as any)
        property!: string;
      }
    }).toThrow(
      `${ERROR_MSGS.UNDEFINED_INJECT_ANNOTATION('WithUndefinedInject')}`
    );
  });

  it('should throw when applied multiInject decorator with undefined service identifier to a constructor parameter', () => {
    expect(() => {
      // @ts-ignore
            // biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
                  class WithUndefinedInject { // eslint-disable-line
        constructor(
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          @multiInject(undefined as any) readonly dependency: string[]
        ) {}
      }
    }).toThrow(
      `${ERROR_MSGS.UNDEFINED_INJECT_ANNOTATION('WithUndefinedInject')}`
    );
  });
});
