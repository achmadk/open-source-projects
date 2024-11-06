import { describe, it, expect } from 'vitest'

import { Container, injectable } from '../../src';

describe('Issue 633', () => {

  it('Should expose metadata through context', () => {

    @injectable()
    class Logger {
      public named: string;
      public constructor(named: string) {
        this.named = named;
      }
    }

    const container = new Container();

    const TYPE = {
      Logger: Symbol.for('Logger')
    };

    container.bind<Logger>(TYPE.Logger).toDynamicValue((context) => {
      const namedMetadata = context.currentRequest.target.getNamedTag();
      const named = namedMetadata ? namedMetadata.value : 'default';
      return new Logger(named as string);
    });

    const logger1 = container.getNamed<Logger>(TYPE.Logger, 'Name1');
    const logger2 = container.getNamed<Logger>(TYPE.Logger, 'Name2');

    expect(logger1.named).toEqual('Name1');
    expect(logger2.named).toEqual('Name2');

  });

});