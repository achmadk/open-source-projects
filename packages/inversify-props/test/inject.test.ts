import { describe, test, expect } from 'vitest'

import { container } from '../src';
import { resetContainer } from '../src/lib/container';
import { isParameterDecorator } from '../src/lib/inject.helper';

describe('Inject Helper', () => {
  describe('When index parameter is defined', () => {
    test('should be detected as parameter decorator if index is a number', () => {
      expect(isParameterDecorator(0)).toBe(true);
      expect(isParameterDecorator(1)).toBe(true);
      expect(isParameterDecorator(undefined as unknown as number)).toBe(false);
    });
  });

  describe('When is a parameter decorator', () => {
    test('should be able to register a dependency as parameter with the same name', () => {
      interface IDummy {
        example(): string;
      }

      class Dummy implements IDummy {
        public example(): string {
          return 'example';
        }
      }

      container.addSingleton<IDummy>(Dummy, 'Dummy0001');

      interface IOtherDummy {
        test(): string;
      }

      class OtherDummy implements IOtherDummy {
        Dummy!: IDummy
        constructor(Dummy: IDummy) {
          this.Dummy = Dummy
        }

        public test(): string {
          return this.Dummy.example();
        }
      }

      container.bind<IOtherDummy>('OtherDummy0001')
        .toDynamicValue(({ container: c }) => new OtherDummy(c.get('Dummy0001')));
      const otherDummy = container.get<IOtherDummy>('OtherDummy0001');

      expect(otherDummy.test()).toBe('example');
      resetContainer();
    });

    test('should be able to register a dependency as parameter with the same name if first char is lowercase', () => {
      interface IDummy {
        example(): string;
      }

      class Dummy implements IDummy {
        public example(): string {
          return 'example';
        }
      }

      container.addSingleton<IDummy>(Dummy, 'Dummy0002');

      interface IOtherDummy {
        test(): string;
      }

      class OtherDummy implements IOtherDummy {
        dummy!: IDummy

        constructor(dummy: IDummy) {
          this.dummy = dummy
        }

        public test(): string {
          return this.dummy.example();
        }
      }

      container.bind<IOtherDummy>('OtherDummy0002')
        .toDynamicValue(({ container: c }) => new OtherDummy(c.get('Dummy0002')));
      const dependency = container.get<IOtherDummy>('OtherDummy0002');

      expect(dependency.test()).toBe('example');
      resetContainer();
    });

    test('should be able to register a dependency as parameter with the same name if first char is lowercase and the prefix is an underscore', () => {
      interface IDummy {
        example(): string;
      }

      class Dummy implements IDummy {
        public example(): string {
          return 'example';
        }
      }

      container.addSingleton<IDummy>(Dummy, 'Dummy0003');

      interface IOtherDummy {
        test(): string;
      }

      class OtherDummy implements IOtherDummy {
        _dummy: IDummy

        constructor(dummy: IDummy) {
          this._dummy = dummy
        }

        public test(): string {
          return this._dummy.example();
        }
      }

      container.bind<IOtherDummy>('OtherDummy0003')
        .toDynamicValue(({ container: c }) => new OtherDummy(c.get('Dummy0003')));
      const dependency = container.get<IOtherDummy>('OtherDummy0003');

      expect(dependency.test()).toBe('example');
      resetContainer();
    });
  });

  describe('When is a property/method decorator', () => {
    test('should be able to register a dependency as parameter with the same name', () => {
      interface IDummy {
        example(): string;
      }

      class Dummy implements IDummy {
        public example(): string {
          return 'example';
        }
      }

      container.addSingleton<IDummy>(Dummy, 'Dummy0004');

      interface IOtherDummy {
        test(): string;
      }

      class OtherDummy implements IOtherDummy {
        #Dummy!: IDummy;

        constructor(dummy: IDummy) {
          this.#Dummy = dummy
        }

        public test(): string {
          return this.#Dummy.example();
        }
      }

      container.bind<IOtherDummy>('OtherDummy0004')
        .toDynamicValue(({ container: c }) => new OtherDummy(c.get('Dummy0004')));
      const dependency = container.get<IOtherDummy>('OtherDummy0004');

      expect(dependency.test()).toBe('example');
      resetContainer();
    });

    test('should be able to register a dependency as parameter with the same name if first char is lowercase', () => {
      interface IDummy {
        example(): string;
      }

      class Dummy implements IDummy {
        public example(): string {
          return 'example';
        }
      }

      container.addSingleton<IDummy>(Dummy, 'Dummy0005');

      interface IOtherDummy {
        test(): string;
      }

      class OtherDummy implements IOtherDummy {
        #dummy!: IDummy;

        constructor(dummy: IDummy) {
          this.#dummy = dummy
        }

        public test(): string {
          return this.#dummy.example();
        }
      }

      container.bind<IOtherDummy>('OtherDummy0005')
        .toDynamicValue(({ container: c }) => new OtherDummy(c.get('Dummy0005')));
      const dependency = container.get<IOtherDummy>('OtherDummy0005');

      expect(dependency.test()).toBe('example');
      resetContainer();
    });

    test('should be able to register a dependency as parameter with the same name if first char is lowercase and the prefix is an underscore', () => {
      interface IDummy {
        example(): string;
      }

      class Dummy implements IDummy {
        public example(): string {
          return 'example';
        }
      }

      container.addSingleton<IDummy>(Dummy, 'Dummy0006');

      interface IOtherDummy {
        test(): string;
      }

      class OtherDummy implements IOtherDummy {
        private _dummy!: IDummy;

        constructor(dummy: IDummy) {
          this._dummy = dummy
        }

        public test(): string {
          return this._dummy.example();
        }
      }

      container.bind<IOtherDummy>('OtherDummy0006')
        .toDynamicValue(({ container: c }) => new OtherDummy(c.get('Dummy0006')));
      const dependency = container.get<IOtherDummy>('OtherDummy0006');

      expect(dependency.test()).toBe('example');
      resetContainer();
    });
  });

  describe('When using classes in more than one test', () => {
    interface IDummy {
      example(): string;
    }

    class Dummy implements IDummy {
      public example(): string {
        return 'example';
      }
    }

    test('should dont have @injectable errors', () => {
      container.addSingleton<IDummy>(Dummy, 'Dummy');
      const dependency = container.get<IDummy>('Dummy');

      expect(dependency.example()).toBe('example');
      resetContainer();

      container.addSingleton<IDummy>(Dummy, 'Dummy');
      const dependency2 = container.get<IDummy>('Dummy');

      expect(dependency2.example()).toBe('example');
      resetContainer();
    });
  });
});
