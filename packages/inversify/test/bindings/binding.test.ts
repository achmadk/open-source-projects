import { Binding } from '../../src/bindings/binding';
import { BindingScopeEnum } from '../../src/constants/literal_types';
import * as Stubs from '../utils/stubs';

describe('Binding', () => {
  it('Should set its own properties correctly', () => {
    const fooIdentifier = 'FooInterface';
    const fooBinding = new Binding<Stubs.FooInterface>(
      fooIdentifier,
      BindingScopeEnum.Transient
    );
    expect(fooBinding.serviceIdentifier).toEqual(fooIdentifier);
    expect(fooBinding.implementationType).toEqual(null);
    expect(fooBinding.cache).toEqual(null);
    expect(fooBinding.scope).toEqual(BindingScopeEnum.Transient);
    expect(typeof fooBinding.id).toBe('number');
  });
});
