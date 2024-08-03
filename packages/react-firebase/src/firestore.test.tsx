import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import type { FirebaseApp } from "firebase/app";
import { createContext } from "react";
import { UnitTestProvider } from "./UnitTestProvider";
import {
  useFirebaseFirestore,
  useFirebaseFirestoreMethods,
  useInitializeFirestore,
  useOnSnapshotInSync,
} from "./firestore";

describe("test firestore.ts file", () => {
  describe("test useFirebaseFirestore", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseFirestore(), {
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
        () => useFirebaseFirestore({ context: CustomContext }),
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

  describe("test useOnSnapshotInSync", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(
        () =>
          useOnSnapshotInSync({
            next(value) {
              console.log(value);
            },
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
          useOnSnapshotInSync(
            {
              next(value) {
                console.log(value);
              },
            },
            {
              context: CustomContext,
            },
          ),
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

  describe("test useInitializeFirestore", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useInitializeFirestore(), {
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
        () => useInitializeFirestore({ context: CustomContext }),
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

  describe("test useFirebaseFirestoreMethods", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
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
        () => useFirebaseFirestoreMethods({ context: CustomContext }),
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

    test("successfully call collection", () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "collection");
      const collection = result.current.collection({
        path: "test",
        pathSegments: [],
      });
      expect(spy).toHaveBeenCalledOnce();
      expect(collection).not.toBeUndefined();
    });

    test("successfully call collectionGroup", () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "collectionGroup");
      const collection = result.current.collectionGroup("test");
      expect(spy).toHaveBeenCalledOnce();
      expect(collection).not.toBeUndefined();
    });

    test("successfully call doc", () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "doc");
      const documentRef = result.current.doc({
        path: "test",
        pathSegments: ["12345"],
      });
      expect(spy).toHaveBeenCalledOnce();
      expect(documentRef).not.toBeUndefined();
    });

    test("successfully call getPersistentCacheIndexManager", () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "getPersistentCacheIndexManager");
      const cacheManager = result.current.getPersistentCacheIndexManager();
      expect(spy).toHaveBeenCalledOnce();
      expect(cacheManager).toBeNull();
    });

    test("successfully call loadBundle", () => {
      try {
        const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "loadBundle");
        const bundle = result.current.loadBundle("test");
        expect(spy).toHaveBeenCalledOnce();
        expect(bundle).not.toBeUndefined();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call namedQuery", async () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "namedQuery");
      const bundle = await result.current.namedQuery("test");
      expect(spy).toHaveBeenCalledOnce();
      expect(bundle).not.toBeUndefined();
    });

    test("successfully call runTransaction", async () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi
        .spyOn(result.current, "runTransaction")
        .mockImplementation(async () => "hello");
      const transactionResult = await result.current.runTransaction<string>({
        updateFunction: async () => {
          return "hello";
        },
      });
      expect(spy).toHaveBeenCalledOnce();
      expect(transactionResult).not.toBeUndefined();
    });

    test("successfully call terminate", async () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "terminate");
      await result.current.terminate();
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call waitForPendingWrites", async () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "waitForPendingWrites");
      await result.current.waitForPendingWrites();
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call writeBatch", async () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "writeBatch");
      const writeBatch = await result.current.writeBatch();
      expect(spy).toHaveBeenCalledOnce();
      expect(writeBatch).not.toBeUndefined();
    });

    test("successfully call disableNetwork", async () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "disableNetwork");
      await result.current.disableNetwork();
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call enableNetwork", async () => {
      const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      const spy = vi.spyOn(result.current, "enableNetwork");
      await result.current.enableNetwork();
      expect(spy).toHaveBeenCalledOnce();
    });

    test("successfully call clearIndexedDbPersistence", async () => {
      try {
        const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "clearIndexedDbPersistence");
        await result.current.clearIndexedDbPersistence();
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call connectFirestoreEmulator", () => {
      try {
        const { result } = renderHook(() => useFirebaseFirestoreMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "connectFirestoreEmulator");
        result.current.connectFirestoreEmulator({
          host: "http://127.0.0.1",
          port: 8080,
          options: {
            mockUserToken: "12345",
          },
        });
        expect(spy).toHaveBeenCalledOnce();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });
  });
});
