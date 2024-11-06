/** @vitest-environment jsdom */
import { describe, test, expect } from 'vitest';

import { render } from '@testing-library/react';

import { ContainerProvider, container, useContainerGet } from '..';

interface IDummy {
  example(): string;
}

class Dummy implements IDummy {
  public example(): string {
    return 'example_dummy';
  }
}

const DUMMY = 'Dummy';

interface IOtherDummy {
  test(): string;
}

const OTHER_DUMMY = 'OtherDummy';

class OtherDummy implements IOtherDummy {
  _dummy!: IDummy;

  constructor(dummy: IDummy) {
    this._dummy = dummy
  }

  public test(): string {
    return this._dummy.example();
  }
}

const SampleComponent = () => {
  const otherDummy = useContainerGet<IOtherDummy>(OTHER_DUMMY);
  return <h2>{`Check: ${otherDummy.test()}`}</h2>;
};

function generateAppContainer() {
  container.bindTo<IDummy>(Dummy, DUMMY).inSingletonScope();
  container.bind<IOtherDummy>(OTHER_DUMMY).toDynamicValue(({ container: c }) => new OtherDummy(c.get(DUMMY))).inSingletonScope();
  return container;
}

describe('test in react component', () => {
  test('it works!!!', () => {
    const { container: domContainer } = render(
      <ContainerProvider value={generateAppContainer()}>
        <SampleComponent />
      </ContainerProvider>
    );
    const h2Element = domContainer.querySelector('h2')!;
    expect(h2Element.textContent).toBe('Check: example_dummy');
  });
});
