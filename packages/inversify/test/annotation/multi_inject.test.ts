import { describe, it, expect } from 'vitest'

import { getMetadata } from '@abraham/reflection';

import { _decorate, _param, decorate } from '../../src/annotation/decorator_utils';
import { multiInject } from '../../src/annotation/multi_inject';
import * as ERROR_MSGS from '../../src/constants/error_msgs';
import * as METADATA_KEY from '../../src/constants/metadata_keys';
import type * as interfaces from '../../src/interfaces';

interface Weapon {}

class DecoratedWarrior {
  private _primaryWeapon: Weapon;
  private _secondaryWeapon: Weapon;

  public constructor(@multiInject('Weapon') weapons: Weapon[]) {
    this._primaryWeapon = weapons[0];
    this._secondaryWeapon = weapons[1];
  }

  public mock() {
    return `${JSON.stringify(this._primaryWeapon)} ${JSON.stringify(
      this._secondaryWeapon
    )}`;
  }
}

class InvalidDecoratorUsageWarrior {
  private _primaryWeapon: Weapon;
  private _secondaryWeapon: Weapon;

  public constructor(weapons: Weapon[]) {
    this._primaryWeapon = weapons[0];
    this._secondaryWeapon = weapons[1];
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

describe('@multiInject', () => {
  it('Should generate metadata for named parameters', () => {
    const metadataKey = METADATA_KEY.TAGGED;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const paramsMetadata = getMetadata<any[]>(metadataKey, DecoratedWarrior);
    expect(paramsMetadata).toBeDefined();

    // assert metadata for first argument
    expect(paramsMetadata?.['0']).toBeInstanceOf(Array);
    const m1: interfaces.Metadata = paramsMetadata?.['0']?.[0];
    expect(m1.key).toEqual(METADATA_KEY.MULTI_INJECT_TAG);
    expect(m1.value).toEqual('Weapon');
    expect(paramsMetadata?.['0']?.[1]).toEqual(undefined);

    // no more metadata should be available
    expect(paramsMetadata?.['1']).toEqual(undefined);
  });

  it('Should throw when applied multiple times', () => {
    const useDecoratorMoreThanOnce = () => {
      _decorate(
        [
          _param(0, multiInject('Weapon') as ParameterDecorator),
          _param(0, multiInject('Weapon') as ParameterDecorator),
        ],
        InvalidDecoratorUsageWarrior
      );
    };

    const msg = `${ERROR_MSGS.DUPLICATED_METADATA} ${METADATA_KEY.MULTI_INJECT_TAG}`;
    expect(useDecoratorMoreThanOnce).toThrow(msg);
  });

  it('Should throw when not applied to a constructor', () => {
    const useDecoratorOnMethodThatIsNotAConstructor = () => {
      _decorate(
        [_param(0, multiInject('Weapon') as ParameterDecorator)],
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

  it('Should be usable in VanillaJS applications', () => {
    interface Katana {}
    interface Shurien {}

    const VanillaJSWarrior = (() => {
      function Warrior(_primary: Katana, _secondary: Shurien) {
        // ...
      }
      return Warrior;
    })();

    decorate(multiInject('Weapon') as ParameterDecorator, VanillaJSWarrior, 0);

    const metadataKey = METADATA_KEY.TAGGED;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const paramsMetadata = getMetadata<any[]>(metadataKey, VanillaJSWarrior);
    expect(paramsMetadata).toBeDefined();

    // assert metadata for first argument
    expect(paramsMetadata?.['0']).toBeInstanceOf(Array);
    const m1: interfaces.Metadata = paramsMetadata?.['0']?.[0];
    expect(m1.key).toEqual(METADATA_KEY.MULTI_INJECT_TAG);
    expect(m1.value).toEqual('Weapon');
    expect(paramsMetadata?.['0']?.[1]).toEqual(undefined);

    // no more metadata should be available
    expect(paramsMetadata?.['1']).toEqual(undefined);
  });
});
