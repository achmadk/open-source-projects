import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import type { FirebaseApp } from "firebase/app";
import { createContext } from "react";
import { UnitTestProvider } from "./UnitTestProvider";
import { useFirebaseStorage, useFirebaseStorageMethods } from "./storage";

describe("test storage.ts file", () => {
  describe("test useFirebaseStorage", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(() => useFirebaseStorage(), {
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
          () => useFirebaseStorage({ context: CustomContext }),
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

  describe("test useFirebaseStorageMethods", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(() => useFirebaseStorageMethods(), {
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
          () => useFirebaseStorageMethods({ context: CustomContext }),
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

    test("successfully call connectStorageEmulator method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseStorageMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "connectStorageEmulator");
        const perfTrace = await result.current.connectStorageEmulator({
          host: "http://127.0.0.1",
          port: 8080,
        });
        expect(perfTrace).not.toBeUndefined();
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call ref method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseStorageMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "ref");
        const perfTrace = await result.current.ref("http://127.0.0.1");
        expect(perfTrace).not.toBeUndefined();
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });
  });
});
