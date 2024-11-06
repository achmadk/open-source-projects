import { describe, it, expect } from 'vitest'

import { TargetTypeEnum } from '../../src/constants/literal_types';
import * as METADATA_KEY from '../../src/constants/metadata_keys';
import { Metadata } from '../../src/planning/metadata';
import { Target } from '../../src/planning/target';

describe('Target', () => {

  it('Should be able to create instances of untagged targets', () => {
    const target = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana');
    expect(target.serviceIdentifier).toEqual('Katana');
    expect(target.name.value()).toEqual('katana');
    expect(Array.isArray(target.metadata)).toEqual(true);
    expect(target.metadata.length).toEqual(0);
  });

  it('Should be able to create instances of named targets', () => {
    const target = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana', 'primary');
    expect(target.serviceIdentifier).toEqual('Katana');
    expect(target.name.value()).toEqual('katana');
    expect(Array.isArray(target.metadata)).toEqual(true);
    expect(target.metadata.length).toEqual(1);
    expect(target.metadata[0]?.key).toEqual(METADATA_KEY.NAMED_TAG);
    expect(target.metadata[0]?.value).toEqual('primary');
  });

  it('Should be able to create instances of tagged targets', () => {
    const target = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana', new Metadata('power', 5));
    expect(target.serviceIdentifier).toEqual('Katana');
    expect(target.name.value()).toEqual('katana');
    expect(Array.isArray(target.metadata)).toEqual(true);
    expect(target.metadata.length).toEqual(1);
    expect(target.metadata[0]?.key).toEqual('power');
    expect(target.metadata[0]?.value).toEqual(5);
  });

  it('Should be able to identify named metadata', () => {
    const target1 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana', 'primary');
    expect(target1.isNamed()).toEqual(true);
    const target2 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana', new Metadata('power', 5));
    expect(target2.isNamed()).toEqual(false);
  });

  it('Should be able to identify multi-injections', () => {
    const target1 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana');
    target1.metadata.push(new Metadata(METADATA_KEY.MULTI_INJECT_TAG, 'Katana'));
    expect(target1.isArray()).toEqual(true);
    const target2 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana');
    expect(target2.isArray()).toEqual(false);
  });

  it('Should be able to match multi-inject for a specified service metadata', () => {
    const target1 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana');
    target1.metadata.push(new Metadata(METADATA_KEY.MULTI_INJECT_TAG, 'Katana'));
    target1.metadata.push(new Metadata(METADATA_KEY.INJECT_TAG, 'Shuriken'));
    expect(target1.matchesArray('Katana')).toEqual(true);
    expect(target1.matchesArray('Shuriken')).toEqual(false);
  });

  it('Should be able to match named metadata', () => {
    const target1 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana', 'primary');
    expect(target1.matchesNamedTag('primary')).toEqual(true);
    expect(target1.matchesNamedTag('secondary')).toEqual(false);
  });

  it('Should be able to identify tagged metadata', () => {

    const target = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana');
    expect(target.isTagged()).toEqual(false);

    const target1 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana', new Metadata('power', 5));
    expect(target1.isTagged()).toEqual(true);

    const target2 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana', 'primary');
    expect(target2.isTagged()).toEqual(false);

    const target3 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana');
    target3.metadata.push(new Metadata('power', 5), new Metadata('speed', 5));
    expect(target3.isTagged()).toEqual(true);

    const target4 = new Target(TargetTypeEnum.Variable, '', 'Katana');
    target4.metadata.push(new Metadata(METADATA_KEY.INJECT_TAG, 'Katana'))
    expect(target4.isTagged()).toEqual(false);

    const target5 = new Target(TargetTypeEnum.Variable, '', 'Katana');
    target5.metadata.push(new Metadata(METADATA_KEY.MULTI_INJECT_TAG, 'Katana'))
    expect(target5.isTagged()).toEqual(false);

    const target6 = new Target(TargetTypeEnum.Variable, 'katanaName', 'Katana');
    target6.metadata.push(new Metadata(METADATA_KEY.NAME_TAG, 'katanaName'))
    expect(target6.isTagged()).toEqual(false);

    const target7 = new Target(TargetTypeEnum.Variable, '', 'Katana');
    target7.metadata.push(new Metadata(METADATA_KEY.UNMANAGED_TAG, true))
    expect(target7.isTagged()).toEqual(false);

    const target8 = new Target(TargetTypeEnum.Variable, 'katanaName', 'Katana');
    target8.metadata.push(new Metadata(METADATA_KEY.NAMED_TAG, 'katanaName'))
    expect(target8.isTagged()).toEqual(false);

    const target9 = new Target(TargetTypeEnum.Variable, '', 'Katana');
    target9.metadata.push(new Metadata(METADATA_KEY.OPTIONAL_TAG, true))
    expect(target9.isTagged()).toEqual(false);
  });

  it('Should be able to match tagged metadata', () => {
    const target1 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana', new Metadata('power', 5));
    expect(target1.matchesTag('power')(5)).toEqual(true);
    expect(target1.matchesTag('power')(2)).toEqual(false);
  });

  it('Should contain an unique identifier', () => {
    const target1 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana', new Metadata('power', 5));
    const target2 = new Target(TargetTypeEnum.ConstructorArgument, 'katana', 'Katana', new Metadata('power', 5));
    expect(typeof target1.id).toEqual('number');
    expect(typeof target2.id).toEqual('number');
    expect(target1.id).not.toEqual(target2.id);
  });

});