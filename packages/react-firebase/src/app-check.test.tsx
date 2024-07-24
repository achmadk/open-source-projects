import { renderHook } from "@testing-library/react";
import {
  type AppCheckTokenResult,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import { UnitTestProvider } from "./UnitTestProvider";

import {
  useFirebaseAppCheckMethods,
  useInitializeAppCheck,
  useOnTokenChanged,
} from "./app-check";

import type { FirebaseApp } from "firebase/app";
import { createContext } from "react";

describe("test app-check.ts file", () => {
  const provider = new ReCaptchaEnterpriseProvider(recaptchaSiteKey);

  describe("test useInitializeAppCheck", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(
        () => useInitializeAppCheck({ options: { provider } }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      expect(result.current).not.toBeUndefined();
    });

    test("rendered successfully with custom context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const OtherContext = createContext<FirebaseApp>(undefined!);
      const { result } = renderHook(
        () =>
          useInitializeAppCheck({
            context: OtherContext,
            options: { provider },
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

  describe("test useOnTokenChanged", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(
        () =>
          useOnTokenChanged(
            {
              next: (value) => {
                console.log(value);
              },
            },
            { options: { provider } },
          ),
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
      const OtherContext = createContext<FirebaseApp>(undefined!);
      const { result } = renderHook(
        () =>
          useOnTokenChanged(
            {
              next: (value) => {
                console.log(value);
              },
            },
            { context: OtherContext, options: { provider } },
          ),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider context={OtherContext}>
              {children}
            </UnitTestProvider>
          ),
        },
      );
      expect(result.current).toBeUndefined();
    });
  });

  describe("test useFirebaseAppCheckMethods", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(
        () => useFirebaseAppCheckMethods({ options: { provider } }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      expect(result.current).not.toBeUndefined();
    });

    test("rendered successfully with custom context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const OtherContext = createContext<FirebaseApp>(undefined!);
      const { result } = renderHook(
        () =>
          useFirebaseAppCheckMethods({
            context: OtherContext,
            options: { provider },
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

    test("successfully call getLimitedUseToken method", async () => {
      const { result } = renderHook(
        () => useFirebaseAppCheckMethods({ options: { provider } }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      const spy = vi
        .spyOn(result.current, "getLimitedUseToken")
        .mockImplementation(
          async () => (await { token: "12345" }) as AppCheckTokenResult,
        );

      const token = await result.current.getLimitedUseToken();
      console.log(token);
      expect(spy).toHaveBeenCalled();
      expect(token).not.toBeUndefined();
    });

    test("successfully call getToken method", async () => {
      const { result } = renderHook(
        () => useFirebaseAppCheckMethods({ options: { provider } }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      const spy = vi
        .spyOn(result.current, "getToken")
        .mockImplementation(
          async () => (await { token: "12345" }) as AppCheckTokenResult,
        );

      const token = await result.current.getToken();
      console.log(token);
      expect(spy).toHaveBeenCalled();
      expect(token).not.toBeUndefined();
    });

    test("successfully call setTokenAutoRefreshEnabled method", async () => {
      const { result } = renderHook(
        () => useFirebaseAppCheckMethods({ options: { provider } }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      const spy = vi.spyOn(result.current, "setTokenAutoRefreshEnabled");

      result.current.setTokenAutoRefreshEnabled(true);
      expect(spy).toHaveBeenCalled();
    });
  });
});
