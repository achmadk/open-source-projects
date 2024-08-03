import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import type { FirebaseApp } from "firebase/app";
import { createContext } from "react";
import { UnitTestProvider } from "./UnitTestProvider";
import {
  useFirebaseInstallations,
  useFirebaseInstallationsMethods,
  useOnIdChange,
} from "./installations";

describe("test installations.ts file", () => {
  describe("test useFirebaseInstallations", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseInstallations(), {
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
        () => useFirebaseInstallations({ context: CustomContext }),
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

  describe("test useOnIdChange", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(
        () =>
          useOnIdChange((id) => {
            console.log(id);
          }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      expect(result.current).toBeUndefined();
    });

    test("rendered successfully with custom context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const CustomContext = createContext<FirebaseApp>(undefined!);
      const { result } = renderHook(
        () =>
          useOnIdChange((id) => {
            console.log(id);
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
    });
  });

  describe("test useFirebaseInstallationsMethods", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseInstallationsMethods(), {
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
        () => useFirebaseInstallationsMethods({ context: CustomContext }),
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

    test("successfully call getId method", async () => {
      const { result } = renderHook(() => useFirebaseInstallationsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "getId");
      const id = await result.current.getId();
      expect(id).not.toBeUndefined();
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call getToken method", async () => {
      const { result } = renderHook(() => useFirebaseInstallationsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "getToken");
      const token = await result.current.getToken();
      expect(token).not.toBeUndefined();
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call deleteInstallations method", async () => {
      const { result } = renderHook(() => useFirebaseInstallationsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "deleteInstallations");
      await result.current.deleteInstallations();
      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
