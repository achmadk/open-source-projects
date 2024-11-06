import { describe, it, expect } from 'vitest'

import { Container } from '../../src';
import { performance } from 'perf_hooks';

describe('Performance', () => {

  function registerN(times: number) {

    const result = {
      container: new Container(),
      register: -1
    };

    let i = 0;

    for (i = 0; i < times; i++) {
      const start = performance.now();
      result.container.bind(`SOME_ID_${i}`).toConstantValue({ test: i });
      const end = performance.now();
      result.register = end - start;
    }

    return result;
  }

  function resolveN(container: Container, times: number) {

    const result = {
      avg: -1,
      max: -1,
      min: 9999999999999999
    };

    const items: number[] = [];
    let i = 0;

    for (i = 0; i < times; i++) {

      const start = performance.now();
      container.get(`SOME_ID_${times}`);
      const end = performance.now();
      const total = end - start;

      if (total < result.min) {
        result.min = total;
      }
      if (total > result.max) {
        result.max = total;
      }

      items.push(total);
    }

    result.avg = items.reduce((p, c) => p + c, 0) / items.length;

    return result;
  }

  it('Should be able to register 1 binding in less than 1.5 ms', () => {
    const result1 = registerN(1);
    expect(result1.register).toBeLessThan(1.5);
    expect(result1.register).toBeLessThan(1.5);
  });

  it('Should be able to register 5 bindings in less than 1 ms', () => {
    const result5 = registerN(5);
    expect(result5.register).toBeLessThan(1);
  });

  it('Should be able to register 1K bindings in less than 1 ms', () => {
    const result1K = registerN(1000);
    expect(result1K.register).toBeLessThan(1);
  });

  it('Should be able to register 5K bindings in less than 1 ms', () => {
    const result5K = registerN(5000);
    expect(result5K.register).toBeLessThan(1);
  });

  it('Should be able to register 1 bindings in less than 3 ms', () => {
    const container1 = registerN(1000).container;
    const result1 = resolveN(container1, 5);
    expect(result1.avg).toBeLessThan(4);
  });

  it('Should be able to register 5 bindings in less than 1 ms', () => {
    const container5 = registerN(1000).container;
    const result5 = resolveN(container5, 5);
    expect(result5.avg).toBeLessThan(1);
  });

  it('Should be able to register 1K bindings in less than 1 ms', () => {
    const container1K = registerN(1000).container;
    const result1K = resolveN(container1K, 5);
    expect(result1K.avg).toBeLessThan(1);
  });

  it('Should be able to register 5K bindings in less than 1 ms', () => {
    const container5K = registerN(5000).container;
    const result5K = resolveN(container5K, 5);
    expect(result5K.avg).toBeLessThan(1);
  });

  it('Should be able to register 10K bindings in less than 1 ms', () => {
    const container10K = registerN(10000).container;
    const result10K = resolveN(container10K, 5);
    expect(result10K.avg).toBeLessThan(1);
  });

});