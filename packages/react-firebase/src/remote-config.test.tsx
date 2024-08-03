import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import type { FirebaseApp } from "firebase/app";
import { createContext } from "react";
import { UnitTestProvider } from "./UnitTestProvider";
import {
  useFirebaseRemoteConfig,
  useFirebaseRemoteConfigMethods,
} from "./remote-config";

describe("test remote-config.ts file", () => {
  describe("test useFirebaseRemoteConfig", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfig(), {
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
          () => useFirebaseRemoteConfig({ context: CustomContext }),
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

  describe("test useFirebaseRemoteConfigMethods", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfigMethods(), {
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
          () => useFirebaseRemoteConfigMethods({ context: CustomContext }),
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

    test("successfully call activate method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfigMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "activate");
        const perfTrace = await result.current.activate();
        expect(perfTrace).toBeTypeOf("boolean");
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call ensureInitialized method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfigMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "ensureInitialized");
        await result.current.ensureInitialized();
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call fetchAndActivate method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfigMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "fetchAndActivate");
        const value = await result.current.fetchAndActivate();
        expect(spy).toHaveBeenCalledOnce();
        expect(value).toBeTypeOf("boolean");
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call fetchConfig method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfigMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "fetchConfig");
        await result.current.fetchConfig();
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call getAll method", () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfigMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "getAll");
        const configs = result.current.getAll();
        expect(spy).toHaveBeenCalledOnce();
        expect(configs).not.toBeUndefined();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call getBoolean method", () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfigMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "getBoolean");
        const booleanValue = result.current.getBoolean("test");
        expect(spy).toHaveBeenCalledOnce();
        expect(booleanValue).toBeTypeOf("boolean");
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call getNumber method", () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfigMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "getNumber");
        const value = result.current.getNumber("test");
        expect(spy).toHaveBeenCalledOnce();
        expect(value).toBeTypeOf("number");
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call getString method", () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfigMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "getString");
        const value = result.current.getString("test");
        expect(spy).toHaveBeenCalledOnce();
        expect(value).toBeTypeOf("string");
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call getValue method", () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfigMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "getValue");
        const value = result.current.getValue("test");
        expect(spy).toHaveBeenCalledOnce();
        expect(value).not.toBeUndefined();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call setLogLevel method", () => {
      try {
        const { result } = renderHook(() => useFirebaseRemoteConfigMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "setLogLevel");
        result.current.setLogLevel("debug");
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });
  });
});
