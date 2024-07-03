import { id } from '../../src/utils/id';

describe('ID', () => {
  it('Should be able to generate an id', () => {
    const id1 = id();
    expect(id1).toEqual(0);
  });
});
