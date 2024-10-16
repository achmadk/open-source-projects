import { describe, it, expect } from "vitest";

import { isPromiseOrContainsPromise } from "../../src";

describe("test utils/async.ts file", () => {
  it("test isPromiseOrContainsPromise method", () => {
    const samplePromise = () => {
      return new Promise<number>((resolve) => {
        setTimeout(() => {
          resolve(100)
        }, 1000)
      })
    }
    const result = isPromiseOrContainsPromise(samplePromise())
    expect(result).toEqual(true)
  })
})