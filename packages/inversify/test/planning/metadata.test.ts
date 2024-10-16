import { describe, it, expect } from 'vitest'

import { Metadata } from '../../src/planning/metadata';

describe('Metadata', () => {

  it('Should set its own properties correctly', () => {
    const m = new Metadata('power', 5);
    expect(m.key).toEqual('power');
    expect(m.value).toEqual(5);
  });

});