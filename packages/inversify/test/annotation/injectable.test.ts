import { getMetadata } from '@abraham/reflection';

import * as ERRORS_MSGS from '../../src/constants/error_msgs';
import * as METADATA_KEY from '../../src/constants/metadata_keys';
import { decorate, injectable } from '../../src';

describe('@injectable', () => {
  it('Should generate metadata if declared injections', () => {
    class Katana {}

    interface Weapon {}

    @injectable()
    class Warrior {
      private _primaryWeapon: Katana;
      private _secondaryWeapon: Weapon;

      public constructor(primaryWeapon: Katana, secondaryWeapon: Weapon) {
        this._primaryWeapon = primaryWeapon;
        this._secondaryWeapon = secondaryWeapon;
      }

      public debug() {
        return {
          primaryWeapon: this._primaryWeapon,
          secondaryWeapon: this._secondaryWeapon,
        };
      }
    }

    const metadata = getMetadata<any[]>(METADATA_KEY.PARAM_TYPES, Warrior);
    expect(metadata).toBeInstanceOf(Array);

    expect(metadata?.[0]).toEqual(Katana);
    expect(metadata?.[1]).toEqual(Object);
    expect(metadata?.[2]).toBeUndefined();
  });

  it('Should throw when applied multiple times', () => {
    @injectable()
    class Test {}

    const useDecoratorMoreThanOnce = function () {
      // @ts-ignore
      decorate(injectable(), Test);
      // @ts-ignore
      decorate(injectable(), Test);
    };

    expect(useDecoratorMoreThanOnce).toThrow(
      ERRORS_MSGS.DUPLICATED_INJECTABLE_DECORATOR
    );
  });

  it('Should be usable in VanillaJS applications', () => {
    interface Katana {}
    interface Shuriken {}

    const VanillaJSWarrior = function (_primary: Katana, _secondary: Shuriken) {
      // ...
    };

    // @ts-ignore
    decorate(injectable(), VanillaJSWarrior);

    const metadata = getMetadata<any[]>(
      METADATA_KEY.PARAM_TYPES,
      VanillaJSWarrior
    );
    expect(metadata).toBeInstanceOf(Array);
    expect(metadata?.length).toEqual(0);
  });
});
