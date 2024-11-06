import { describe, it, expect } from 'vitest'

import { TargetTypeEnum } from '../../src/constants/literal_types';
import { Container } from '../../src/container/container';
import { Context } from '../../src/planning/context';
import { Plan } from '../../src/planning/plan';
import { Request } from '../../src/planning/request';
import { Target } from '../../src/planning/target';

describe('Plan', () => {

  it('Should set its own properties correctly', () => {

    const container = new Container();
    const context = new Context(container);
    const runtimeId = 'Something';

    const request: Request = new Request(
      runtimeId,
      context,
      null,
      [],
      new Target(TargetTypeEnum.Variable, '', runtimeId)
    );

    const plan = new Plan(context, request);

    expect(plan.parentContext).toEqual(context);
    expect(plan.rootRequest.serviceIdentifier).toEqual(request.serviceIdentifier);
    expect(plan.rootRequest.parentContext).toEqual(request.parentContext);
    expect(plan.rootRequest.parentRequest).toEqual(request.parentRequest);
    expect(plan.rootRequest.childRequests).toEqual(request.childRequests);
    expect(plan.rootRequest.target).toEqual(request.target);
  });

});