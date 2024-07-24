import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import type { FirebaseApp } from "firebase/app";
import { createContext } from "react";
import { UnitTestProvider } from "./UnitTestProvider";
import { useFirebaseFunctions, useFirebaseFunctionsMethods } from "./functions";

describe("test functions.ts file", () => {
  describe("test useFirebaseFunctions", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseFunctions(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      expect(result.current).not.toBeUndefined();
    });

    test("rendered successfully with custom context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const CustomContext = createContext<FirebaseApp>(undefined!);
      const { result } = renderHook(
        () => useFirebaseFunctions({ context: CustomContext }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider context={CustomContext}>
              {children}
            </UnitTestProvider>
          ),
        },
      );
      expect(result.current).not.toBeUndefined();
    });
  });

  describe("test useFirebaseFunctionsMethods", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseFunctionsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      expect(result.current).not.toBeUndefined();
    });

    test("rendered successfully with custom context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const CustomContext = createContext<FirebaseApp>(undefined!);
      const { result } = renderHook(
        () => useFirebaseFunctionsMethods({ context: CustomContext }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider context={CustomContext}>
              {children}
            </UnitTestProvider>
          ),
        },
      );
      expect(result.current).not.toBeUndefined();
    });

    test("successfully call httpsCallable method", () => {
      const { result } = renderHook(() => useFirebaseFunctionsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "httpsCallable");
      const callable = result.current.httpsCallable({ name: "test" });
      expect(callable).not.toBeUndefined();
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call httpsCallableFromURL method", () => {
      const { result } = renderHook(() => useFirebaseFunctionsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "httpsCallableFromURL");
      const callable = result.current.httpsCallableFromURL({
        url: "http://127.0.0.1",
      });
      expect(callable).not.toBeUndefined();
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call connectFunctionsEmulator method", () => {
      const { result } = renderHook(() => useFirebaseFunctionsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "connectFunctionsEmulator");
      result.current.connectFunctionsEmulator({
        host: "http://127.0.0.1",
        port: 8080,
      });
      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
