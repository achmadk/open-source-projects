import {
  createTaggedDecorator,
  tagParameter,
  tagProperty,
} from '../../src/annotation/decorator_utils';
import { inject } from '../../src/annotation/inject';
import { injectable } from '../../src/annotation/injectable';
import {
  DUPLICATED_METADATA,
  INVALID_DECORATOR_OPERATION,
} from '../../src/constants/error_msgs';
import { Container } from '../../src/container';

describe('createTaggedDecorator', () => {
  it('should pass to tagParameter for parameter decorators', () => {
    class Target {}
    const metadata = { key: '1', value: '2' };
    const decorator = createTaggedDecorator(metadata);
    // const spiedTagParameter = sandbox.spy(tagParameter);
    decorator(Target, undefined, 1);
    // expect(spiedTagParameter.calledWithExactly(Target, undefined, 1, metadata));
  });

  it('should pass to tagProperty for property decorators', () => {
    class Target {}
    const metadata = { key: '2', value: '2' };
    const decorator = createTaggedDecorator(metadata);
    // const spiedTagProperty = sandbox.spy(tagProperty);
    decorator(Target.prototype, 'PropertyName');
    // expect(spiedTagProperty.calledWithExactly(Target, "PropertyName", metadata));
  });

  it('should enable constraining to multiple metadata with a single decorator', () => {
    function multipleMetadataDecorator(key1Value: string, key2Value: string) {
      return createTaggedDecorator([
        { key: 'key1', value: key1Value },
        { key: 'key2', value: key2Value },
      ]);
    }

    interface Thing {
      type: string;
    }

    @injectable()
    class Thing1 implements Thing {
      type = 'Thing1';
    }

    @injectable()
    class Root {
      public thingyType!: string;
      @multipleMetadataDecorator('Key1Value', 'Key2Value')
      @inject<Thing>('Thing')
      // @ts-ignore
      set thingy(thingy: Thing) {
        this.thingyType = thingy.type;
      }
    }

    const container = new Container();
    container
      .bind<Thing>('Thing')
      .to(Thing1)
      .when((request) => {
        const metadatas = request.target.metadata;
        const key1Metadata = metadatas[1];
        const key2Metadata = metadatas[2];
        return (
          key1Metadata?.value === 'Key1Value' &&
          key2Metadata?.value === 'Key2Value'
        );
      });
    container.resolve(Root);
  });
});

describe('tagParameter', () => {
  it('should throw if multiple metadata with same key', () => {
    class Target {}
    expect(() =>
      tagParameter(Target, undefined, 1, [
        { key: 'Duplicate', value: '1' },
        { key: 'Duplicate', value: '2' },
      ])
    ).toThrow(`${DUPLICATED_METADATA} Duplicate`);
  });
});

describe('tagProperty', () => {
  it('should throw if multiple metadata with same key', () => {
    class Target {}
    expect(() =>
      tagProperty(Target.prototype, 'Property', [
        { key: 'Duplicate', value: '1' },
        { key: 'Duplicate', value: '2' },
      ])
    ).toThrow(`${DUPLICATED_METADATA} Duplicate`);
  });

  it('should throw for static properties', () => {
    class Target {}

    // does not throw
    tagProperty(Target.prototype, 'Property', { key: 'key', value: 'value' });

    expect(() =>
      tagProperty(Target, 'StaticProperty', { key: 'key', value: 'value' })
    ).toThrow(INVALID_DECORATOR_OPERATION);
  });
});
