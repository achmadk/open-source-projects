import { describe, it, expect } from 'vitest'

import { TargetTypeEnum } from '../../src/constants/literal_types';
import { Container } from '../../src/container/container';
import * as interfaces from '../../src/interfaces/interfaces';
import { Context } from '../../src/planning/context';
import { Request } from '../../src/planning/request';
import { Target } from '../../src/planning/target';

describe('Request', () => {

  const identifiers = {
    Katana: 'Katana',
    KatanaBlade: 'KatanaBlade',
    KatanaHandler: 'KatanaHandler',
    Ninja: 'Ninja',
    Shuriken: 'Shuriken',
  };

  it('Should set its own properties correctly', () => {

    const container = new Container();
    const context = new Context(container);

    const request1: Request = new Request(
      identifiers.Ninja,
      context,
      null,
      [],
      new Target(TargetTypeEnum.Variable, '', identifiers.Ninja)
    );

    const request2 = new Request(
      identifiers.Ninja,
      context,
      null,
      [],
      new Target(TargetTypeEnum.Variable, '', identifiers.Ninja)
    );

    expect(request1.serviceIdentifier).toEqual(identifiers.Ninja);
    expect(Array.isArray(request1.bindings)).toEqual(true);
    expect(Array.isArray(request2.bindings)).toEqual(true);
    expect(typeof request1.id).toEqual('number');
    expect(typeof request2.id).toEqual('number');
    expect(request1.id).not.toEqual(request2.id);

  });

  it('Should be able to add a child request', () => {

    const container = new Container();
    const context = new Context(container);

    const ninjaRequest: Request = new Request(
      identifiers.Ninja,
      context,
      null,
      [],
      new Target(TargetTypeEnum.Variable, 'Ninja', identifiers.Ninja)
    );

    ninjaRequest.addChildRequest(
      identifiers.Katana,
      [],
      new Target(TargetTypeEnum.ConstructorArgument, 'Katana', identifiers.Katana)
    );

    const katanaRequest = ninjaRequest.childRequests[0];

    expect(katanaRequest?.serviceIdentifier).toEqual(identifiers.Katana);
    expect(katanaRequest?.target.name.value()).toEqual('Katana');
    expect(katanaRequest?.childRequests.length).toEqual(0);

    const katanaParentRequest: interfaces.Request = katanaRequest?.parentRequest as Request;
    expect(katanaParentRequest.serviceIdentifier).toEqual(identifiers.Ninja);
    expect(katanaParentRequest.target.name.value()).toEqual('Ninja');
    expect(katanaParentRequest.target.serviceIdentifier).toEqual(identifiers.Ninja);

  });

});