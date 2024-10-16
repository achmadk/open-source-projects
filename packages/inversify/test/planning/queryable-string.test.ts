import { describe, it, expect } from 'vitest'

import { QueryableString } from '../../src/planning/queryable_string';

describe('QueryableString', () => {

  it('Should be able to set its own properties', () => {
    const queryableString = new QueryableString('some_text');
    expect(queryableString.value()).toEqual('some_text');
  });

  it('Should be able to return its value', () => {
    const queryableString = new QueryableString('some_text');
    expect(queryableString.value()).toEqual('some_text');
    expect(queryableString.value() === 'some_other_text').toEqual(false);
  });

  it('Should be able to identify if it"s value starts with certain text', () => {
    const queryableString = new QueryableString('some_text');
    expect(queryableString.startsWith('some')).toEqual(true);
    expect(queryableString.startsWith('s')).toEqual(true);
    expect(queryableString.startsWith('me')).toEqual(false);
    expect(queryableString.startsWith('_text')).toEqual(false);
  });

  it('Should be able to identify if it"s value ends with certain text', () => {
    const queryableString = new QueryableString('some_text');
    expect(queryableString.endsWith('_text')).toEqual(true);
    expect(queryableString.endsWith('ext')).toEqual(true);
    expect(queryableString.endsWith('_tex')).toEqual(false);
    expect(queryableString.endsWith('some')).toEqual(false);
  });

  it('Should be able to identify if it"s value is equals to certain text', () => {
    const queryableString = new QueryableString('some_text');
    expect(queryableString.equals('some_text')).toEqual(true);
    expect(queryableString.contains('some_text ')).toEqual(false);
    expect(queryableString.contains('som_text')).toEqual(false);
  });

});