import { getMetadata } from '@abraham/reflection';

import { decorate } from '../../src/annotation/decorator_utils';
import { injectable } from '../../src/annotation/injectable';
import { targetName } from '../../src/annotation/target_name';
import * as METADATA_KEY from '../../src/constants/metadata_keys';
import * as Stubs from '../utils/stubs';

describe('@targetName', () => {
  it('Should generate metadata if declared parameter names', () => {
    @injectable()
    class Warrior {
      public katana: Stubs.Katana;
      public shuriken: Stubs.Shuriken;

      public constructor(
        @targetName('katana') katana: Stubs.Katana,
        @targetName('shuriken') shuriken: Stubs.Shuriken
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const metadata = getMetadata<any[]>(METADATA_KEY.TAGGED, Warrior);
    expect(metadata?.['0']).toBeInstanceOf(Array);
    expect(metadata?.['1']).toBeInstanceOf(Array);
    expect(metadata?.['2']).toBeUndefined();

    expect(metadata?.['0']?.[0]?.key).toEqual(METADATA_KEY.NAME_TAG);
    expect(metadata?.['0']?.[0]?.value).toEqual('katana');
    expect(metadata?.['1']?.[0]?.key).toEqual(METADATA_KEY.NAME_TAG);
    expect(metadata?.['1']?.[0]?.value).toEqual('shuriken');
  });

  it('Should be usable in VanillaJS applications', () => {
    interface Katana {}
    interface Shuriken {}

    const VanillaJSWarrior = function (_primary: Katana, _secondary: Shuriken) {
      // ...
    };

    decorate(targetName('primary') as ClassDecorator, VanillaJSWarrior, 0);
    decorate(targetName('secondary') as ClassDecorator, VanillaJSWarrior, 1);

    const metadata = getMetadata<any[]>(METADATA_KEY.TAGGED, VanillaJSWarrior);
    expect(metadata?.['0']).toBeInstanceOf(Array);
    expect(metadata?.['1']).toBeInstanceOf(Array);
    expect(metadata?.['2']).toBeUndefined();

    expect(metadata?.['0']?.[0]?.key).toEqual(METADATA_KEY.NAME_TAG);
    expect(metadata?.['0']?.[0]?.value).toEqual('primary');
    expect(metadata?.['1']?.[0]?.key).toEqual(METADATA_KEY.NAME_TAG);
    expect(metadata?.['1']?.[0]?.value).toEqual('secondary');
  });
});
