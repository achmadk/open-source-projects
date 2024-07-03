import { getMetadata } from '@abraham/reflection';

import { decorate } from '../../src/annotation/decorator_utils';
import { named } from '../../src/annotation/named';
import * as ERROR_MSGS from '../../src/constants/error_msgs';
import * as METADATA_KEY from '../../src/constants/metadata_keys';
import * as interfaces from '../../src/interfaces';

declare function __decorate(
  decorators: ClassDecorator[],
  target: any,
  key?: any,
  desc?: any
): void;
declare function __param(
  paramIndex: number,
  decorator: ParameterDecorator
): ClassDecorator;

interface Weapon {}

class NamedWarrior {
  private _primaryWeapon: Weapon;
  private _secondaryWeapon: Weapon;

  public constructor(
    @named('more_powerful') primary: Weapon,
    @named('less_powerful') secondary: Weapon
  ) {
    this._primaryWeapon = primary;
    this._secondaryWeapon = secondary;
  }

  public debug() {
    return {
      primaryWeapon: this._primaryWeapon,
      secondaryWeapon: this._secondaryWeapon,
    };
  }
}

class InvalidDecoratorUsageWarrior {
  private _primaryWeapon: Weapon;
  private _secondaryWeapon: Weapon;

  public constructor(primary: Weapon, secondary: Weapon) {
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

describe('@named', () => {
  it('Should generate metadata for named parameters', () => {
    const metadataKey = METADATA_KEY.TAGGED;
    const paramsMetadata = getMetadata<any[]>(metadataKey, NamedWarrior);
    expect(paramsMetadata).toBeDefined();

    // assert metadata for first argument
    expect(paramsMetadata?.['0']).toBeInstanceOf(Array);
    const m1: interfaces.Metadata = paramsMetadata?.['0']?.[0];
    expect(m1.key).toEqual(METADATA_KEY.NAMED_TAG);
    expect(m1.value).toEqual('more_powerful');
    expect(paramsMetadata?.['0']?.[1]).toEqual(undefined);

    // assert metadata for second argument
    expect(paramsMetadata?.['1']).toBeInstanceOf(Array);
    const m2: interfaces.Metadata = paramsMetadata?.['1']?.[0];
    expect(m2.key).toEqual(METADATA_KEY.NAMED_TAG);
    expect(m2.value).toEqual('less_powerful');
    expect(paramsMetadata?.['1']?.[1]).toEqual(undefined);

    // no more metadata should be available
    expect(paramsMetadata?.['2']).toEqual(undefined);
  });

  it('Should generate metadata for named properties', () => {
    class Warrior {
      @named('throwable')
      public weapon!: Weapon;
    }

    const metadataKey = METADATA_KEY.TAGGED_PROP;
    const metadata: any = getMetadata(metadataKey, Warrior);

    const m1 = metadata.weapon[0];
    expect(m1.key).toEqual(METADATA_KEY.NAMED_TAG);
    expect(m1.value).toEqual('throwable');
    expect(metadata.weapon[1]).toEqual(undefined);
  });

  it('Should throw when applied multiple times', () => {
    const useDecoratorMoreThanOnce = function () {
      __decorate(
        [
          __param(0, named('a') as ParameterDecorator),
          __param(0, named('b') as ParameterDecorator),
        ],
        InvalidDecoratorUsageWarrior
      );
    };

    const msg = `${ERROR_MSGS.DUPLICATED_METADATA} ${METADATA_KEY.NAMED_TAG}`;
    expect(useDecoratorMoreThanOnce).toThrow(msg);
  });

  it('Should throw when not applied to a constructor', () => {
    const useDecoratorOnMethodThatIsNotAConstructor = function () {
      __decorate(
        [__param(0, named('a') as ParameterDecorator)],
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

    const VanillaJSWarrior = (function () {
      function NamedVanillaJSWarrior(_primary: Katana, _secondary: Shurien) {
        // ...
      }
      return NamedVanillaJSWarrior;
    })();

    decorate(named('more_powerful') as ClassDecorator, VanillaJSWarrior, 0);
    decorate(named('less_powerful') as ClassDecorator, VanillaJSWarrior, 1);

    const metadataKey = METADATA_KEY.TAGGED;
    const paramsMetadata = getMetadata<any[]>(metadataKey, VanillaJSWarrior);
    expect(paramsMetadata).toBeDefined();

    // assert metadata for first argument
    expect(paramsMetadata?.['0']).toBeInstanceOf(Array);
    const m1: interfaces.Metadata = paramsMetadata?.['0']?.[0];
    expect(m1.key).toEqual(METADATA_KEY.NAMED_TAG);
    expect(m1.value).toEqual('more_powerful');
    expect(paramsMetadata?.['0']?.[1]).toBeUndefined();

    // assert metadata for second argument
    expect(paramsMetadata?.['1']).toBeInstanceOf(Array);
    const m2: interfaces.Metadata = paramsMetadata?.['1']?.[0];
    expect(m2.key).toEqual(METADATA_KEY.NAMED_TAG);
    expect(m2.value).toEqual('less_powerful');
    expect(paramsMetadata?.['1']?.[1]).toBeUndefined();

    // no more metadata should be available
    expect(paramsMetadata?.['2']).toBeUndefined();
  });
});
