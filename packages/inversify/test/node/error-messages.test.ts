import { describe, it, expect } from 'vitest'

import * as ERROR_MSGS from '../../src/constants/error_msgs';
import { Container, injectable } from '../../src';

describe('Error message when resolving fails', () => {
  interface Weapon { }

  @injectable()
  class Katana implements Weapon { }

  @injectable()
  class Shuriken implements Weapon { }

  @injectable()
  class Bokken implements Weapon { }

  it('Should contain correct message and the serviceIdentifier in error message', () => {
    const container = new Container();

    container.bind<Weapon>('Weapon').to(Katana);

    const tryWeapon = () => { container.get('Ninja'); };

    expect(tryWeapon).toThrow(`${ERROR_MSGS.NOT_REGISTERED} Ninja`);

  });

  it('Should contain the provided name in error message when target is named', () => {

    const container = new Container();
    const tryGetNamedWeapon = (name: string | number | symbol) => { container.getNamed('Weapon', name); };

    expect(() => tryGetNamedWeapon('superior')).toThrow(/.*\bWeapon\b.*\bsuperior\b/g);
    expect(() => tryGetNamedWeapon(Symbol.for('Superior'))).toThrow(/.*\bWeapon\b.*Symbol\(Superior\)/g);
    expect(() => tryGetNamedWeapon(0)).toThrow(/.*\bWeapon\b.*\b0\b/g);

  });

  it('Should contain the provided tag in error message when target is tagged', () => {

    const container = new Container();
    const tryGetTaggedWeapon = (tag: string | number | symbol) => { container.getTagged('Weapon', tag, true); };

    expect(() => tryGetTaggedWeapon('canShoot')).toThrow(/.*\bWeapon\b.*\bcanShoot\b.*\btrue\b/g);
    expect(() => tryGetTaggedWeapon(Symbol.for('Can shoot'))).toThrow(/.*\bWeapon\b.*Symbol\(Can shoot\).*\btrue\b/g);
    expect(() => tryGetTaggedWeapon(0)).toThrow(/.*\bWeapon\b.*\b0\b.*\btrue\b/g);

  });

  it('Should list all possible bindings in error message if no matching binding found', () => {

    const container = new Container();
    container.bind<Weapon>('Weapon').to(Katana).whenTargetNamed('strong');
    container.bind<Weapon>('Weapon').to(Shuriken).whenTargetTagged('canThrow', true);
    container.bind<Weapon>('Weapon').to(Bokken).whenTargetNamed('weak');

    try {
      container.getNamed('Weapon', 'superior');
    } catch (error) {
      expect((error as Error).message).toMatch(/.*\bKatana\b.*\bnamed\b.*\bstrong\b/);
      expect((error as Error).message).toMatch(/.*\bBokken\b.*\bnamed\b.*\bweak\b/);
      expect((error as Error).message).toMatch(/.*\bShuriken\b.*\btagged\b.*\bcanThrow\b.*\btrue\b/);
    }
  });

  it('Should list all possible bindings in error message if ambiguous matching binding found', () => {

    const container = new Container();
    container.bind<Weapon>('Weapon').to(Katana).whenTargetNamed('strong');
    container.bind<Weapon>('Weapon').to(Shuriken).whenTargetTagged('canThrow', true);
    container.bind<Weapon>('Weapon').to(Bokken).whenTargetNamed('weak');

    try {
      container.get('Weapon');
    } catch (error) {
      expect((error as Error).message).toMatch(/.*\bKatana\b.*\bnamed\b.*\bstrong\b/);
      expect((error as Error).message).toMatch(/.*\bBokken\b.*\bnamed\b.*\bweak\b/);
      expect((error as Error).message).toMatch(/.*\bShuriken\b.*\btagged\b.*\bcanThrow\b.*\btrue\b/);
    }

  });

});