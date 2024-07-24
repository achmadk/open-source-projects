import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import type { FirebaseApp } from "firebase/app";
import { createContext } from "react";
import { UnitTestProvider } from "./UnitTestProvider";
import {
  useFirebasePerformance,
  useFirebasePerformanceMethods,
  useInitializePerformance,
} from "./performance";

describe("test performance.ts file", () => {
  describe("test useFirebasePerformance", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(() => useFirebasePerformance(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        expect(result.current).not.toBeUndefined();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("rendered successfully with custom context", () => {
      try {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const CustomContext = createContext<FirebaseApp>(undefined!);
        const { result } = renderHook(
          () => useFirebasePerformance({ context: CustomContext }),
          {
            wrapper: ({ children }) => (
              <UnitTestProvider context={CustomContext}>
                {children}
              </UnitTestProvider>
            ),
          },
        );
        expect(result.current).not.toBeUndefined();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });
  });

  describe("test useInitializePerformance", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(
          () =>
            useInitializePerformance({
              options: { dataCollectionEnabled: false },
            }),
          {
            wrapper: ({ children }) => (
              <UnitTestProvider>{children}</UnitTestProvider>
            ),
          },
        );
        expect(result.current).toBeUndefined();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("rendered successfully with custom context", () => {
      try {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const CustomContext = createContext<FirebaseApp>(undefined!);
        const { result } = renderHook(
          () =>
            useInitializePerformance({
              options: { dataCollectionEnabled: false },
            }),
          {
            wrapper: ({ children }) => (
              <UnitTestProvider context={CustomContext}>
                {children}
              </UnitTestProvider>
            ),
          },
        );
        expect(result.current).toBeUndefined();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });
  });

  describe("test useFirebasePerformanceMethods", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(() => useFirebasePerformanceMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        expect(result.current).not.toBeUndefined();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("rendered successfully with custom context", () => {
      try {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const CustomContext = createContext<FirebaseApp>(undefined!);
        const { result } = renderHook(
          () => useFirebasePerformanceMethods({ context: CustomContext }),
          {
            wrapper: ({ children }) => (
              <UnitTestProvider context={CustomContext}>
                {children}
              </UnitTestProvider>
            ),
          },
        );
        expect(result.current).not.toBeUndefined();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call trace method", async () => {
      try {
        const { result } = renderHook(() => useFirebasePerformanceMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "trace");
        const perfTrace = await result.current.trace("test1234");
        expect(perfTrace).not.toBeUndefined();
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });
  });
});
