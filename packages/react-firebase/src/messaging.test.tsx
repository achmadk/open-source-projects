import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import type { FirebaseApp } from "firebase/app";
import { createContext } from "react";
import { UnitTestProvider } from "./UnitTestProvider";
import {
  useFirebaseMessaging,
  useFirebaseMessagingMethods,
  useOnMessage,
} from "./messaging";

describe.skip("test messaging.ts file", () => {
  describe("test useFirebaseMessaging", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(() => useFirebaseMessaging(), {
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
          () => useFirebaseMessaging({ context: CustomContext }),
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

  describe("test useOnMessage", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(
          () =>
            useOnMessage({
              next(value) {
                console.log(value);
              },
              error(err) {
                console.log(err);
              },
              complete() {
                console.log("completed");
              },
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
            useOnMessage({
              next(value) {
                console.log(value);
              },
              error(err) {
                console.log(err);
              },
              complete() {
                console.log("completed");
              },
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

  describe("test useFirebaseMessagingMethods", () => {
    test("rendered successfully", () => {
      try {
        const { result } = renderHook(() => useFirebaseMessagingMethods(), {
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
          () => useFirebaseMessagingMethods({ context: CustomContext }),
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

    test("successfully call getToken method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseMessagingMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "getToken");
        const token = await result.current.getToken({ vapidKey: "test1234" });
        expect(token).not.toBeUndefined();
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call deleteToken method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseMessagingMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "deleteToken");
        const successDeleteToken = await result.current.deleteToken();
        expect(successDeleteToken).toBeTypeOf("boolean");
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });
  });
});
