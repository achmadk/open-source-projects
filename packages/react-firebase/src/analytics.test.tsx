import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import { UnitTestProvider } from "./UnitTestProvider";

import type { FirebaseApp } from "firebase/app";
import { createContext } from "react";
import {
  useFirebaseAnalytics,
  useFirebaseAnalyticsMethods,
  useInitializeAnalytics,
} from "./analytics";

describe("test analytics.ts file", () => {
  describe("test useFirebaseAnalytics", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseAnalytics(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      expect(result.current).not.toBeUndefined();
    });

    test("rendered successfully with custom context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const OtherContext = createContext<FirebaseApp>(undefined!);
      const { result } = renderHook(
        () =>
          useFirebaseAnalytics({
            context: OtherContext,
          }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider context={OtherContext}>
              {children}
            </UnitTestProvider>
          ),
        },
      );
      expect(result.current).not.toBeUndefined();
    });
  });

  describe("test useInitializeAnalytics", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useInitializeAnalytics(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      expect(result.current).not.toBeUndefined();
    });

    test("rendered successfully with custom context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const OtherContext = createContext<FirebaseApp>(undefined!);
      const { result } = renderHook(
        () =>
          useInitializeAnalytics({
            context: OtherContext,
          }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider context={OtherContext}>
              {children}
            </UnitTestProvider>
          ),
        },
      );
      expect(result.current).not.toBeUndefined();
    });
  });

  describe("test useFirebaseAnalyticsMethods", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseAnalyticsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      expect(result.current).not.toBeUndefined();
    });

    test.skip("successfully call getGoogleAnalyticsClientId method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAnalyticsMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "getGoogleAnalyticsClientId");
        // .mockImplementation(async () => await "100");

        const id = await result.current.getGoogleAnalyticsClientId();
        expect(spy).toHaveBeenCalledOnce();
        expect(id).toBeTypeOf("string");
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call logEvent method", async () => {
      const { result } = renderHook(() => useFirebaseAnalyticsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "logEvent");

      await result.current.logEvent({
        eventName: "test",
        eventParams: { value: 1 },
      });
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call setAnalyticsCollectionEnabled method", async () => {
      const { result } = renderHook(() => useFirebaseAnalyticsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "setAnalyticsCollectionEnabled");

      await result.current.setAnalyticsCollectionEnabled(true);
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call setUserId method", async () => {
      const { result } = renderHook(() => useFirebaseAnalyticsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "setUserId");

      await result.current.setUserId({ id: "test1234" });
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call setUserProperties method", async () => {
      const { result } = renderHook(() => useFirebaseAnalyticsMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "setUserProperties");

      await result.current.setUserProperties({
        properties: { name: "achmadk" },
      });
      expect(spy).toHaveBeenCalledOnce();
    });

    test("rendered successfully with custom context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const OtherContext = createContext<FirebaseApp>(undefined!);
      const { result } = renderHook(
        () =>
          useFirebaseAnalyticsMethods({
            context: OtherContext,
          }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider context={OtherContext}>
              {children}
            </UnitTestProvider>
          ),
        },
      );
      expect(result.current).not.toBeUndefined();
    });
  });
});
