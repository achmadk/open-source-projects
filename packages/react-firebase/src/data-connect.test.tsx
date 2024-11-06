import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

// import type { FirebaseApp } from "firebase/app";
// import { createContext } from "react";
import { UnitTestProvider } from "./UnitTestProvider";
import {
  useFirebaseDataConnect,
  useFirebaseDataConnectMethods,
} from "./data-connect";

describe.skip("test data-connect.ts file", () => {
  describe("test useFirebaseDataConnect", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(
        () =>
          useFirebaseDataConnect({
            dataConnectOptions: { location: "", connector: "", service: "" },
          }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      expect(result.current).not.toBeUndefined();
    });
  });

  describe("test useFirebaseDataConnectMethods", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(
        () =>
          useFirebaseDataConnectMethods({
            dataConnectOptions: { location: "", connector: "", service: "" },
          }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      expect(result.current).not.toBeUndefined();
    });

    test("successfully call connectDataConnectEmulator", () => {
      const { result } = renderHook(
        () =>
          useFirebaseDataConnectMethods({
            dataConnectOptions: { location: "", connector: "", service: "" },
          }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      const spy = vi.spyOn(result.current, "connectDataConnectEmulator");
      result.current.connectDataConnectEmulator({
        host: "http://127.0.0.1",
        port: 8080,
      });
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call mutationRef", () => {
      const { result } = renderHook(
        () =>
          useFirebaseDataConnectMethods({
            dataConnectOptions: { location: "", connector: "", service: "" },
          }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      const spy = vi.spyOn(result.current, "mutationRef");
      result.current.mutationRef({ mutationName: "hello" });
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call queryRef", () => {
      const { result } = renderHook(
        () =>
          useFirebaseDataConnectMethods({
            dataConnectOptions: { location: "", connector: "", service: "" },
          }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      const spy = vi.spyOn(result.current, "queryRef");
      result.current.queryRef({ queryName: "hello" });
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call terminate", () => {
      const { result } = renderHook(
        () =>
          useFirebaseDataConnectMethods({
            dataConnectOptions: { location: "", connector: "", service: "" },
          }),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        },
      );
      const spy = vi.spyOn(result.current, "terminate");
      result.current.terminate();
      expect(spy).toHaveBeenCalledOnce();
    });
  });
});
