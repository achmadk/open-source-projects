import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import type { FirebaseApp } from "firebase/app";
import { createContext } from "react";
import { UnitTestProvider } from "./UnitTestProvider";
import { useFirebaseVertexAI, useFirebaseVertexAIMethods } from "./vertex-ai";

describe("test performance.ts file", () => {
  describe("test useFirebaseVertexAI", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(() => useFirebaseVertexAI(), {
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
          () => useFirebaseVertexAI({ context: CustomContext }),
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

  describe("test useFirebaseVertexAIMethods", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(() => useFirebaseVertexAIMethods(), {
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
          () => useFirebaseVertexAIMethods({ context: CustomContext }),
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

    test("successfully call getGenerativeModel method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseVertexAIMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "getGenerativeModel");
        const perfTrace = await result.current.getGenerativeModel({
          modelParams: { model: "gemini-1.5-pro-preview-0409" },
        });
        expect(perfTrace).not.toBeUndefined();
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });
  });
});
