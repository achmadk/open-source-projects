import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import type { FirebaseApp } from "firebase/app";
import { createContext } from "react";
import { UnitTestProvider } from "./UnitTestProvider";
import { useFirebaseDatabase, useFirebaseDatabaseMethods } from "./database";

describe("test database.ts file", () => {
  describe("test useFirebaseDatabase", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseDatabase(), {
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
        () => useFirebaseDatabase({ context: CustomContext }),
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

  describe("test useFirebaseDatabaseMethods", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseDatabaseMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      expect(result.current).not.toBeUndefined();
    });

    test("rendered successfully with custom context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const CustomContext = createContext<FirebaseApp>(undefined!);
      const { result } = renderHook(() => useFirebaseDatabaseMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider context={CustomContext}>
            {children}
          </UnitTestProvider>
        ),
      });
      expect(result.current).not.toBeUndefined();
    });

    test("successfully call connectDatabaseMethod", () => {
      const { result } = renderHook(() => useFirebaseDatabaseMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "connectDatabaseEmulator");
      result.current.connectDatabaseEmulator({
        host: "http://127.0.0.1",
        port: 8080,
      });
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call goOnline", () => {
      const { result } = renderHook(() => useFirebaseDatabaseMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "goOnline");
      result.current.goOnline();
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call goOffline", () => {
      const { result } = renderHook(() => useFirebaseDatabaseMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "goOffline");
      result.current.goOffline();
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call ref", () => {
      const { result } = renderHook(() => useFirebaseDatabaseMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "ref");
      result.current.ref();
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call refFromURL", () => {
      const { result } = renderHook(() => useFirebaseDatabaseMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "refFromURL");
      result.current.refFromURL("http://127.0.0.1");
      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
