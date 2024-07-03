import { getMetadata } from '@abraham/reflection';

import { postConstruct } from '../../src/annotation/post_construct';
import * as ERRORS_MSGS from '../../src/constants/error_msgs';
import * as METADATA_KEY from '../../src/constants/metadata_keys';
import { decorate } from '../../src';
import { Metadata } from '../../src/planning/metadata';

describe('@postConstruct', () => {
  it('Should generate metadata for the decorated method', () => {
    class Katana {
      private useMessage!: string;

      public use() {
        return 'Used Katana!';
      }

      // @ts-ignore
      @postConstruct()
      public testMethod() {
        this.useMessage = 'Used Katana!';
      }
      public debug() {
        return this.useMessage;
      }
    }
    const metadata: Metadata = getMetadata(
      METADATA_KEY.POST_CONSTRUCT,
      Katana
    ) as Metadata;
    expect(metadata.value).toEqual('testMethod');
  });

  it('Should throw when applied multiple times', () => {
    function setup() {
      class Katana {
        // @ts-ignore
        @postConstruct()
        public testMethod1() {
          /* ... */
        }

        // @ts-ignore
        @postConstruct()
        public testMethod2() {
          /* ... */
        }
      }
      Katana.toString();
    }
    expect(setup).toThrow(ERRORS_MSGS.MULTIPLE_POST_CONSTRUCT_METHODS);
  });

  it('Should be usable in VanillaJS applications', () => {
    const VanillaJSWarrior = function () {
      // ...
    };
    VanillaJSWarrior.prototype.testMethod = function () {
      // ...
    };

    decorate(
      // @ts-ignore
      postConstruct(),
      VanillaJSWarrior.prototype,
      'testMethod'
    );

    const metadata: Metadata = getMetadata<Metadata>(
      METADATA_KEY.POST_CONSTRUCT,
      VanillaJSWarrior
    ) as Metadata;
    expect(metadata.value).toEqual('testMethod');
  });
});
