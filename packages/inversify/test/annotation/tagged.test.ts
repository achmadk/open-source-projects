import { getMetadata } from '@abraham/reflection';

import { decorate } from '../../src/annotation/decorator_utils';
import { tagged } from '../../src/annotation/tagged';
import * as ERRORS_MSGS from '../../src/constants/error_msgs';
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

class TaggedWarrior {
  private _primaryWeapon: Weapon;
  private _secondaryWeapon: Weapon;

  public constructor(
    @tagged('power', 1) primary: Weapon,
    @tagged('power', 2) secondary: Weapon
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

class DoubleTaggedWarrior {
  private _primaryWeapon: Weapon;
  private _secondaryWeapon: Weapon;

  public constructor(
    @tagged('power', 1) @tagged('distance', 1) primary: Weapon,
    @tagged('power', 2) @tagged('distance', 5) secondary: Weapon
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

describe('@Tagged', () => {
  it('Should generate metadata for tagged parameters', () => {
    const metadataKey = METADATA_KEY.TAGGED;
    const paramsMetadata = getMetadata<any[]>(metadataKey, TaggedWarrior);
    expect(paramsMetadata).toBeDefined();

    // assert metadata for first argument
    expect(paramsMetadata?.['0']).toBeInstanceOf(Array);
    const m1: interfaces.Metadata = paramsMetadata?.['0']?.[0];
    expect(m1.key).toEqual('power');
    expect(m1.value).toEqual(1);

    // argument at index 0 should only have one tag
    expect(paramsMetadata?.['0']?.[1]).toEqual(undefined);

    // assert metadata for second argument
    expect(paramsMetadata?.['1']).toBeInstanceOf(Array);
    const m2: interfaces.Metadata = paramsMetadata?.['1']?.[0];
    expect(m2.key).toEqual('power');
    expect(m2.value).toEqual(2);

    // argument at index 1 should only have one tag
    expect(paramsMetadata?.['1']?.[1]).toEqual(undefined);

    // no more metadata should be available
    expect(paramsMetadata?.['2']).toEqual(undefined);
  });

  it('Should generate metadata for tagged properties', () => {
    class Warrior {
      @tagged('throwable', false)
      public weapon!: Weapon;
    }

    const metadataKey = METADATA_KEY.TAGGED_PROP;
    const metadata: any = getMetadata(metadataKey, Warrior);
    const m1 = metadata.weapon[0];
    expect(m1.key).toEqual('throwable');
    expect(m1.value).toEqual(false);
    expect(metadata.weapon[1]).toEqual(undefined);
  });

  it('Should generate metadata for parameters tagged multiple times', () => {
    const metadataKey = METADATA_KEY.TAGGED;
    const paramsMetadata = getMetadata<any[]>(metadataKey, DoubleTaggedWarrior);
    expect(paramsMetadata).toBeDefined();

    // assert metadata for argument at index 0
    expect(paramsMetadata?.['0']).toBeInstanceOf(Array);

    // assert argument at index 0 first tag
    const m11: interfaces.Metadata = paramsMetadata?.['0']?.[0];
    expect(m11.key).toEqual('distance');
    expect(m11.value).toEqual(1);

    // assert argument at index 0 second tag
    const m12: interfaces.Metadata = paramsMetadata?.['0']?.[1];
    expect(m12.key).toEqual('power');
    expect(m12.value).toEqual(1);

    // assert metadata for argument at index 1
    expect(paramsMetadata?.['1']).toBeInstanceOf(Array);

    // assert argument at index 1 first tag
    const m21: interfaces.Metadata = paramsMetadata?.['1']?.[0];
    expect(m21.key).toEqual('distance');
    expect(m21.value).toEqual(5);

    // assert argument at index 1 second tag
    const m22: interfaces.Metadata = paramsMetadata?.['1']?.[1];
    expect(m22.key).toEqual('power');
    expect(m22.value).toEqual(2);

    // no more metadata (argument at index > 1)
    expect(paramsMetadata?.['2']).toEqual(undefined);
  });

  it('Should throw when applied multiple times', () => {
    const metadataKey = 'a';

    const useDecoratorMoreThanOnce = function () {
      __decorate(
        [
          __param(0, tagged(metadataKey, 1) as ParameterDecorator),
          __param(0, tagged(metadataKey, 2) as ParameterDecorator),
        ],
        InvalidDecoratorUsageWarrior
      );
    };

    const msg = `${ERRORS_MSGS.DUPLICATED_METADATA} ${metadataKey}`;
    expect(useDecoratorMoreThanOnce).toThrow(msg);
  });

  it('Should throw when not applied to a constructor', () => {
    const useDecoratorOnMethodThatIsNotAConstructor = function () {
      __decorate(
        [__param(0, tagged('a', 1) as ParameterDecorator)],
        InvalidDecoratorUsageWarrior.prototype,
        'test',
        Object.getOwnPropertyDescriptor(
          InvalidDecoratorUsageWarrior.prototype,
          'test'
        )
      );
    };

    const msg = ERRORS_MSGS.INVALID_DECORATOR_OPERATION;
    expect(useDecoratorOnMethodThatIsNotAConstructor).toThrow(msg);
  });

  it('Should be usable in VanillaJS applications', () => {
    interface Katana {}
    interface Shuriken {}

    const VanillaJSWarrior = (function () {
      function TaggedVanillaJSWarrior(_primary: Katana, _secondary: Shuriken) {
        // ...
      }
      return TaggedVanillaJSWarrior;
    })();

    decorate(tagged('power', 1) as ParameterDecorator, VanillaJSWarrior, 0);
    decorate(tagged('power', 2) as ParameterDecorator, VanillaJSWarrior, 1);

    const metadataKey = METADATA_KEY.TAGGED;
    const paramsMetadata = getMetadata<any[]>(metadataKey, VanillaJSWarrior);
    expect(paramsMetadata).toBeDefined();

    // assert metadata for first argument
    expect(paramsMetadata?.['0']).toBeInstanceOf(Array);
    const m1: interfaces.Metadata = paramsMetadata?.['0']?.[0];
    expect(m1.key).toEqual('power');
    expect(m1.value).toEqual(1);

    // argument at index 0 should only have one tag
    expect(paramsMetadata?.['0']?.[1]).toEqual(undefined);

    // assert metadata for second argument
    expect(paramsMetadata?.['1']).toBeInstanceOf(Array);
    const m2: interfaces.Metadata = paramsMetadata?.['1']?.[0];
    expect(m2.key).toEqual('power');
    expect(m2.value).toEqual(2);

    // argument at index 1 should only have one tag
    expect(paramsMetadata?.['1']?.[1]).toEqual(undefined);

    // no more metadata should be available
    expect(paramsMetadata?.['2']).toEqual(undefined);
  });
});
