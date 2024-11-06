import { describe, it, expect } from 'vitest'

import { BindingScopeEnum, Container, injectable } from '../../src';

describe('Issue 706', () => {

  it('Should expose BindingScopeEnum as part of the public API', () => {

    @injectable()
    class SomeClass {
      public time: number;
      public constructor() {
        this.time = new Date().getTime();
      }
    }

    const container = new Container({
      defaultScope: BindingScopeEnum.Singleton,
    });

    const TYPE = {
      SomeClass: Symbol.for('SomeClass')
    };

    container.bind<SomeClass>(TYPE.SomeClass).to(SomeClass);

    const instanceOne = container.get<SomeClass>(TYPE.SomeClass);
    const instanceTwo = container.get<SomeClass>(TYPE.SomeClass);

    expect(instanceOne.time).toEqual(instanceTwo.time);

  });

});