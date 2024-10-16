import { describe, it, expect } from 'vitest'

import { inject } from '../../src/annotation/inject';
import { injectable } from '../../src/annotation/injectable';
import { multiInject } from '../../src/annotation/multi_inject';
import { tagged } from '../../src/annotation/tagged';
import { targetName } from '../../src/annotation/target_name';
import * as ERROR_MSGS from '../../src/constants/error_msgs';
import { TargetTypeEnum } from '../../src/constants/literal_types';
import { Container } from '../../src/container/container';
import * as interfaces from '../../src/interfaces/interfaces';
import { named } from '../../src';
import { MetadataReader } from '../../src/planning/metadata_reader';
import { plan } from '../../src/planning/planner';

describe('Planner', () => {

  it('Should be able to create a basic plan', () => {

    interface KatanaBlade { }

    @injectable()
    class KatanaBlade implements KatanaBlade { }

    interface KatanaHandler { }

    @injectable()
    class KatanaHandler implements KatanaHandler { }

    interface Katana { }

    @injectable()
    class Katana implements Katana {
      public handler: KatanaHandler;
      public blade: KatanaBlade;
      public constructor(
        @inject('KatanaHandler') @targetName('handler') handler: KatanaHandler,
        @inject('KatanaBlade') @targetName('blade') blade: KatanaBlade
      ) {
        this.handler = handler;
        this.blade = blade;
      }
    }

    interface Shuriken { }

    @injectable()
    class Shuriken implements Shuriken { }

    interface Ninja { }

    @injectable()
    class Ninja implements Ninja {
      public katana: Katana;
      public shuriken: Shuriken;
      public constructor(
        @inject('Katana') @targetName('katana') katana: Katana,
        @inject('Shuriken') @targetName('shuriken') shuriken: Shuriken
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const ninjaId = 'Ninja';
    const shurikenId = 'Shuriken';
    const katanaId = 'Katana';
    const katanaHandlerId = 'KatanaHandler';
    const katanaBladeId = 'KatanaBlade';

    const container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Shuriken>(shurikenId).to(Shuriken);
    container.bind<Katana>(katanaId).to(Katana);
    container.bind<KatanaBlade>(katanaBladeId).to(KatanaBlade);
    container.bind<KatanaHandler>(katanaHandlerId).to(KatanaHandler);

    // Actual
    const actualPlan = plan(new MetadataReader(), container, false, TargetTypeEnum.Variable, ninjaId).plan;
    const actualNinjaRequest = actualPlan.rootRequest;
    const actualKatanaRequest = actualNinjaRequest.childRequests[0];
    const actualKatanaHandlerRequest = actualKatanaRequest?.childRequests[0];
    const actualKatanaBladeRequest = actualKatanaRequest?.childRequests[1];
    const actualShurikenRequest = actualNinjaRequest.childRequests[1];

    expect(actualNinjaRequest.serviceIdentifier).toEqual(ninjaId);
    expect(actualNinjaRequest.childRequests.length).toEqual(2);

    // Katana
    expect(actualKatanaRequest?.serviceIdentifier).toEqual(katanaId);
    expect(actualKatanaRequest?.bindings.length).toEqual(1);
    expect(actualKatanaRequest?.target.serviceIdentifier).toEqual(katanaId);
    expect(actualKatanaRequest?.childRequests.length).toEqual(2);

    // KatanaHandler
    expect(actualKatanaHandlerRequest?.serviceIdentifier).toEqual(katanaHandlerId);
    expect(actualKatanaHandlerRequest?.bindings.length).toEqual(1);
    expect(actualKatanaHandlerRequest?.target.serviceIdentifier).toEqual(katanaHandlerId);

    // KatanaBlade
    expect(actualKatanaBladeRequest?.serviceIdentifier).toEqual(katanaBladeId);
    expect(actualKatanaBladeRequest?.bindings.length).toEqual(1);
    expect(actualKatanaBladeRequest?.target.serviceIdentifier).toEqual(katanaBladeId);

    // Shuriken
    expect(actualShurikenRequest?.serviceIdentifier).toEqual(shurikenId);
    expect(actualShurikenRequest?.bindings.length).toEqual(1);
    expect(actualShurikenRequest?.target.serviceIdentifier).toEqual(shurikenId);

  });

  it('Should throw when circular dependencies found', () => {

    interface IA { }
    interface IB { }
    interface IC { }
    interface ID { }

    @injectable()
    class D implements ID {
      public a: IA;
      public constructor(
        @inject('A') a: IA
      ) { // circular dependency
        this.a = a;
      }
    }

    @injectable()
    class C implements IC {
      public d: ID;
      public constructor(
        @inject('D') d: ID
      ) {
        this.d = d;
      }
    }

    @injectable()
    class B implements IB { }

    @injectable()
    class A implements IA {
      public b: IB;
      public c: IC;
      public constructor(
        @inject('B') b: IB,
        @inject('C') c: IC
      ) {
        this.b = b;
        this.c = c;
      }
    }

    const aId = 'A';
    const bId = 'B';
    const cId = 'C';
    const dId = 'D';

    const container = new Container();
    container.bind<IA>(aId).to(A);
    container.bind<IB>(bId).to(B);
    container.bind<IC>(cId).to(C);
    container.bind<ID>(dId).to(D);

    const throwErrorFunction = () => {
      container.get(aId);
    };

    expect(throwErrorFunction).toThrow(
      `${ERROR_MSGS.CIRCULAR_DEPENDENCY} A --> C --> D --> A`
    );

  });

  it('Should only plan sub-dependencies when binding type is BindingType.Instance', () => {

    interface KatanaBlade { }

    @injectable()
    class KatanaBlade implements KatanaBlade { }

    interface KatanaHandler { }

    @injectable()
    class KatanaHandler implements KatanaHandler { }

    interface Katana { }

    @injectable()
    class Katana implements Katana {
      public handler: KatanaHandler;
      public blade: KatanaBlade;
      public constructor(
        @inject('KatanaHandler') @targetName('handler') handler: KatanaHandler,
        @inject('KatanaBlade') @targetName('blade') blade: KatanaBlade
      ) {
        this.handler = handler;
        this.blade = blade;
      }
    }

    interface Shuriken { }

    @injectable()
    class Shuriken implements Shuriken { }

    interface Ninja { }

    @injectable()
    class Ninja implements Ninja {
      public katanaFactory: interfaces.Factory<Katana>;
      public shuriken: Shuriken;
      public constructor(
        @inject('Factory<Katana>') @targetName('katanaFactory') katanaFactory: interfaces.Factory<Katana>,
        @inject('Shuriken') @targetName('shuriken') shuriken: Shuriken
      ) {
        this.katanaFactory = katanaFactory;
        this.shuriken = shuriken;
      }
    }

    const ninjaId = 'Ninja';
    const shurikenId = 'Shuriken';
    const katanaId = 'Katana';
    const katanaHandlerId = 'KatanaHandler';
    const katanaBladeId = 'KatanaBlade';
    const katanaFactoryId = 'Factory<Katana>';

    const container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Shuriken>(shurikenId).to(Shuriken);
    container.bind<Katana>(katanaBladeId).to(Katana);
    container.bind<KatanaBlade>(katanaBladeId).to(KatanaBlade);
    container.bind<KatanaHandler>(katanaHandlerId).to(KatanaHandler);
    container.bind<interfaces.Factory<Katana>>(katanaFactoryId).toFactory<Katana>((context: interfaces.Context) =>
      () =>
        context.container.get<Katana>(katanaId));

    const actualPlan = plan(new MetadataReader(), container, false, TargetTypeEnum.Variable, ninjaId).plan;

    expect(actualPlan.rootRequest.serviceIdentifier).toEqual(ninjaId);
    expect(actualPlan.rootRequest.childRequests[0]?.serviceIdentifier).toEqual(katanaFactoryId);
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests.length).toEqual(0); // IMPORTANT!
    expect(actualPlan.rootRequest.childRequests[1]?.serviceIdentifier).toEqual(shurikenId);
    expect(actualPlan.rootRequest.childRequests[1]?.childRequests.length).toEqual(0);
    expect(actualPlan.rootRequest.childRequests[2]).toEqual(undefined);

  });

  it('Should generate plans with multi-injections', () => {

    interface Weapon { }

    @injectable()
    class Katana implements Weapon { }

    @injectable()
    class Shuriken implements Weapon { }

    interface Ninja { }

    @injectable()
    class Ninja implements Ninja {
      public katana: Weapon;
      public shuriken: Weapon;
      public constructor(
        @multiInject('Weapon') @targetName('weapons') weapons: Weapon[]
      ) {
        this.katana = weapons[0] as Weapon;
        this.shuriken = weapons[1] as Weapon;
      }
    }

    const ninjaId = 'Ninja';
    const weaponId = 'Weapon';

    const container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Weapon>(weaponId).to(Shuriken);
    container.bind<Weapon>(weaponId).to(Katana);

    const actualPlan = plan(new MetadataReader(), container, false, TargetTypeEnum.Variable, ninjaId).plan;

    // root request has no target
    expect(actualPlan.rootRequest.serviceIdentifier).toEqual(ninjaId);
    expect(actualPlan.rootRequest.target.serviceIdentifier).toEqual(ninjaId);
    expect(actualPlan.rootRequest.target.isArray()).toEqual(false);

    // root request should only have one child request with target weapons/Weapon[]
    expect(actualPlan.rootRequest.childRequests[0]?.serviceIdentifier).toEqual('Weapon');
    expect(actualPlan.rootRequest.childRequests[1]).toEqual(undefined);
    expect(actualPlan.rootRequest.childRequests[0]?.target.name.value()).toEqual('weapons');
    expect(actualPlan.rootRequest.childRequests[0]?.target.serviceIdentifier).toEqual('Weapon');
    expect(actualPlan.rootRequest.childRequests[0]?.target.isArray()).toEqual(true);

    // child request should have two child requests with targets weapons/Weapon[] but bindings Katana and Shuriken
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests.length).toEqual(2);

    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[0]?.serviceIdentifier).toEqual(weaponId);
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[0]?.target.name.value()).toEqual('weapons');
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[0]?.target.serviceIdentifier).toEqual('Weapon');
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[0]?.target.isArray()).toEqual(true);
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[0]?.serviceIdentifier).toEqual('Weapon');
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[0]?.bindings[0]?.serviceIdentifier).toEqual('Weapon');
    const shurikenImplementationType = actualPlan.rootRequest.childRequests[0]?.childRequests[0]?.bindings[0]?.implementationType as
      { name: string };
    expect(shurikenImplementationType.name).toEqual('Shuriken');

    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[1]?.serviceIdentifier).toEqual(weaponId);
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[1]?.target.name.value()).toEqual('weapons');
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[1]?.target.serviceIdentifier).toEqual('Weapon');
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[1]?.target.isArray()).toEqual(true);
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[1]?.serviceIdentifier).toEqual('Weapon');
    expect(actualPlan.rootRequest.childRequests[0]?.childRequests[1]?.bindings[0]?.serviceIdentifier).toEqual('Weapon');
    const katanaImplementationType = actualPlan.rootRequest.childRequests[0]?.childRequests[1]?.bindings[0]?.implementationType as
      { name: string };
    expect(katanaImplementationType.name).toEqual('Katana');

  });

  it('Should throw when no matching bindings are found', () => {

    interface Katana { }
    @injectable()
    class Katana implements Katana { }

    interface Shuriken { }
    @injectable()
    class Shuriken implements Shuriken { }

    interface Ninja { }

    @injectable()
    class Ninja implements Ninja {
      public katana: Katana;
      public shuriken: Shuriken;
      public constructor(
        @inject('Katana') @targetName('katana') katana: Katana,
        @inject('Shuriken') @targetName('shuriken') shuriken: Shuriken
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const ninjaId = 'Ninja';
    const shurikenId = 'Shuriken';

    const container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Shuriken>(shurikenId).to(Shuriken);

    const throwFunction = () => {
      plan(new MetadataReader(), container, false, TargetTypeEnum.Variable, ninjaId);
    };

    expect(throwFunction).toThrow(`${ERROR_MSGS.NOT_REGISTERED} Katana`);

  });

  it('Should throw when an ambiguous match is found', () => {

    interface Katana { }

    @injectable()
    class Katana implements Katana { }

    @injectable()
    class SharpKatana implements Katana { }

    interface Shuriken { }
    class Shuriken implements Shuriken { }

    interface Ninja { }

    @injectable()
    class Ninja implements Ninja {
      public katana: Katana;
      public shuriken: Shuriken;
      public constructor(
        @inject('Katana') katana: Katana,
        @inject('Shuriken') shuriken: Shuriken
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const ninjaId = 'Ninja';
    const katanaId = 'Katana';
    const shurikenId = 'Shuriken';

    const container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Katana>(katanaId).to(Katana);
    container.bind<Katana>(katanaId).to(SharpKatana);
    container.bind<Shuriken>(shurikenId).to(Shuriken);

    const throwFunction = () => {
      plan(new MetadataReader(), container, false, TargetTypeEnum.Variable, ninjaId);
    };

    expect(throwFunction).toThrow(`${ERROR_MSGS.AMBIGUOUS_MATCH} Katana`);

  });

  it('Should apply constrains when an ambiguous match is found', () => {

    interface Weapon { }

    @injectable()
    class Katana implements Weapon { }

    @injectable()
    class Shuriken implements Weapon { }

    interface Ninja { }

    const ninjaId = 'Ninja';
    const weaponId = 'Weapon';

    @injectable()
    class Ninja implements Ninja {
      public katana: Weapon;
      public shuriken: Weapon;
      public constructor(
        @inject(weaponId) @targetName('katana') @tagged('canThrow', false) katana: Weapon,
        @inject(weaponId) @targetName('shuriken') @tagged('canThrow', true) shuriken: Weapon
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<Weapon>(weaponId).to(Katana).whenTargetTagged('canThrow', false);
    container.bind<Weapon>(weaponId).to(Shuriken).whenTargetTagged('canThrow', true);

    const actualPlan = plan(new MetadataReader(), container, false, TargetTypeEnum.Variable, ninjaId).plan;

    // root request has no target
    expect(actualPlan.rootRequest.serviceIdentifier).toEqual(ninjaId);
    expect(actualPlan.rootRequest.target.serviceIdentifier).toEqual(ninjaId);
    expect(actualPlan.rootRequest.target.isArray()).toEqual(false);

    // root request should have 2 child requests
    expect(actualPlan.rootRequest.childRequests[0]?.serviceIdentifier).toEqual(weaponId);
    expect(actualPlan.rootRequest.childRequests[0]?.target.name.value()).toEqual('katana');
    expect(actualPlan.rootRequest.childRequests[0]?.target.serviceIdentifier).toEqual(weaponId);

    expect(actualPlan.rootRequest.childRequests[1]?.serviceIdentifier).toEqual(weaponId);
    expect(actualPlan.rootRequest.childRequests[1]?.target.name.value()).toEqual('shuriken');
    expect(actualPlan.rootRequest.childRequests[1]?.target.serviceIdentifier).toEqual(weaponId);

    expect(actualPlan.rootRequest.childRequests[2]).toEqual(undefined);

  });

  it('Should throw when a class has a missing @injectable annotation', () => {

    interface Weapon { }

    class Katana implements Weapon { }

    const container = new Container();
    container.bind<Weapon>('Weapon').to(Katana);

    const throwFunction = () => {
      plan(new MetadataReader(), container, false, TargetTypeEnum.Variable, 'Weapon');
    };

    expect(throwFunction).toThrow(`${ERROR_MSGS.MISSING_INJECTABLE_ANNOTATION} Katana.`);

  });

  it('Should throw when apply a metadata decorator without @inject or @multiInject', () => {
    @injectable()
    class Ninja {
      @named('name')
      set weapon(_weapon: Weapon) {

      }
    }
    interface Weapon { }

    class Katana implements Weapon { }

    const container = new Container();
    container.bind<Weapon>('Weapon').to(Katana);
    container.bind(Ninja).toSelf();

    const throwFunction = () => {
      plan(new MetadataReader(), container, false, TargetTypeEnum.Variable, Ninja);
    };

    expect(throwFunction).toThrow(`${ERROR_MSGS.MISSING_INJECTABLE_ANNOTATION} for property weapon in class Ninja.`);
  });

  it('Should ignore checking base classes for @injectable when skipBaseClassChecks is set on the container', () => {
    class Test { }

    @injectable()
    class Test2 extends Test { }

    const container = new Container({ skipBaseClassChecks: true });
    container.bind(Test2).toSelf();
    container.get(Test2);
  });

  it('Should ignore checking base classes for @injectable on resolve when skipBaseClassChecks is set', () => {
    class Test { }

    @injectable()
    class Test2 extends Test { }

    const container = new Container({ skipBaseClassChecks: true });
    container.resolve(Test2);
  });

  it('Should throw when an class has a missing @inject annotation', () => {

    interface Sword { }

    @injectable()
    class Katana implements Sword { }

    interface Warrior { }

    @injectable()
    class Ninja implements Warrior {

      public katana: Katana;

      public constructor(
        katana: Sword
      ) {
        this.katana = katana;
      }
    }

    const container = new Container();
    container.bind<Warrior>('Warrior').to(Ninja);
    container.bind<Sword>('Sword').to(Katana);

    const throwFunction = () => {
      plan(new MetadataReader(), container, false, TargetTypeEnum.Variable, 'Warrior');
    };

    expect(throwFunction).toThrow(`${ERROR_MSGS.MISSING_INJECT_ANNOTATION} argument 0 in class Ninja.`);

  });

  it('Should throw when a function has a missing @injectable annotation', () => {

    interface Katana { }

    @injectable()
    class Katana implements Katana { }

    interface Ninja { }

    @injectable()
    class Ninja implements Ninja {

      public katana: Katana;

      public constructor(
        katanaFactory: () => Katana
      ) {
        this.katana = katanaFactory();
      }
    }

    const container = new Container();
    container.bind<Ninja>('Ninja').to(Ninja);
    container.bind<Katana>('Katana').to(Katana);
    container.bind<Katana>('Factory<Katana>').to(Katana);

    const throwFunction = () => {
      plan(new MetadataReader(), container, false, TargetTypeEnum.Variable, 'Ninja');
    };

    expect(throwFunction).toThrow(`${ERROR_MSGS.MISSING_INJECT_ANNOTATION} argument 0 in class Ninja.`);
  });
});