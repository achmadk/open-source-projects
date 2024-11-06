// @vitest-environment jsdom
import { describe, expect, test } from 'vitest';

import { render, screen, fireEvent } from '@testing-library/react'

import { container, ContainerProvider, resetContainer, useContainerGet } from '..';
import { useState } from 'react';

describe('blah', () => {
  test('works', async () => {
    interface IDummy {
      example(): string;
    }

    class Dummy implements IDummy {
      public example(): string {
        return 'example';
      }
    }

    const DUMMY = 'Dummy'

    container.addSingleton<IDummy>(Dummy, DUMMY);

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

    const OTHER_DUMMY = 'OtherDummy'

    container.bind<IOtherDummy>(OTHER_DUMMY).toDynamicValue(({ container: c }) => new OtherDummy(c.get(DUMMY)));

    function SampleComponent() {
      const [text, setText] = useState('')
      const otherDummy = useContainerGet<IOtherDummy>(OTHER_DUMMY);

      const handleClick = () => {
        const text = otherDummy.test()
        setText(text)
      }

      return (
        <>
          <pre>{text.length === 0 ? '-' : text}</pre>
          <button data-testid="button-test" onClick={handleClick}>Change text</button>
        </>
      );
    }

    const component = (
      <ContainerProvider value={container}><SampleComponent /></ContainerProvider>
    )
    const { container: domContainer, rerender } = render(component)

    expect(screen).not.toBeUndefined();

    const button = screen.getByTestId('button-test')

    await fireEvent.click(button)

    rerender(component)

    const preText = domContainer.querySelector('pre')!

    expect(preText.textContent).toBe('example')
    resetContainer();
  });
});
