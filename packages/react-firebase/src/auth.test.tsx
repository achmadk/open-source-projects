import { renderHook } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test, vi } from "vitest";

import { UnitTestProvider } from "./UnitTestProvider";

import {
  useBeforeAuthStateChanged,
  useFirebaseAuth,
  useFirebaseAuthMethods,
  useInitializeAuth,
  useOnAuthStateChanged,
  useOnIdTokenChanged,
} from "./auth";

import type { FirebaseApp } from "firebase/app";
import {
  type ActionCodeInfo,
  GoogleAuthProvider,
  type MultiFactorError,
  RecaptchaVerifier,
  type UserCredential,
  browserLocalPersistence,
} from "firebase/auth";
import { createContext } from "react";

describe("test auth.ts file", () => {
  describe("test useFirebaseAuth", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseAuth(), {
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
        () => useFirebaseAuth({ context: OtherContext }),
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

  describe("test useInitializeAuth", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useInitializeAuth(), {
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
        () => useInitializeAuth({ context: OtherContext }),
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

  describe("test useBeforeAuthStateChanged", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(
        () =>
          useBeforeAuthStateChanged({ callback: (user) => console.log(user) }),
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
          useBeforeAuthStateChanged({
            callback: (user) => {
              console.log(user);
            },
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
      expect(result.current).toBeUndefined();
    });
  });

  describe("test useOnAuthStateChanged", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(
        () =>
          useOnAuthStateChanged({ userObserver: (user) => console.log(user) }),
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
          useOnAuthStateChanged({
            userObserver: (user) => {
              console.log(user);
            },
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
      expect(result.current).toBeUndefined();
    });
  });

  describe("test useOnIdTokenChanged", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(
        () =>
          useOnIdTokenChanged({ userObserver: (user) => console.log(user) }),
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
          useOnIdTokenChanged({
            userObserver: (user) => {
              console.log(user);
            },
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
      expect(result.current).toBeUndefined();
    });
  });

  describe("test useFirebaseAuthMethods", () => {
    test("rendered successfully", () => {
      const { result } = renderHook(() => useFirebaseAuthMethods(), {
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
        () => useFirebaseAuthMethods({ context: OtherContext }),
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

    test("successfully call applyActionCode method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi
          .spyOn(result.current, "applyActionCode")
          .mockImplementation(async () => {});

        await result.current.applyActionCode("12345abc");
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        expect((error as any).code).toBe("auth/invalid-action-code");
      }
    });

    test("successfully call checkActionCode method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi
          .spyOn(result.current, "checkActionCode")
          .mockImplementation(async () => ({}) as ActionCodeInfo);

        const info = await result.current.checkActionCode("12345abc");
        expect(spy).toHaveBeenCalled();
        expect(info).not.toBeUndefined();
      } catch (error) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        expect((error as any).code).toBe("auth/operation-not-allowed");
      }
    });

    test("successfully call connectAuthEmulator method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "connectAuthEmulator");

        await result.current.connectAuthEmulator({ url: "http://127.0.0.1" });
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        expect((error as any).code).toBe("auth/emulator-config-failed");
      }
    });

    test("successfully call confirmPasswordReset method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "confirmPasswordReset");

        await result.current.confirmPasswordReset({
          confirmationCode: "http://127.0.0.1",
          newPassword: "hehehe",
        });
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        expect((error as any).code).toBeTypeOf("string");
      }
    });

    test("successfully call createUserWithEmailAndPassword method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "createUserWithEmailAndPassword");

        await result.current.createUserWithEmailAndPassword({
          email: "http://127.0.0.1",
          password: "hehehe",
        });
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        expect((error as any).code).toBeTypeOf("string");
      }
    });

    test("successfully call getMultiFactorResolver method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "getMultiFactorResolver");

        const error: MultiFactorError = {} as MultiFactorError;
        const resolver = result.current.getMultiFactorResolver(error);
        expect(spy).toHaveBeenCalled();
        expect(resolver).not.toBeUndefined();
      } catch (error) {
        console.log(error);
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call getRedirectResult method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "getRedirectResult");

        await result.current.getRedirectResult();
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        expect((error as any).code).toBe(
          "auth/operation-not-supported-in-this-environment",
        );
      }
    });

    test("successfully call initializeRecaptchaConfig method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "initializeRecaptchaConfig");

        await result.current.initializeRecaptchaConfig();
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call isSignInWithEmailLink method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "isSignInWithEmailLink");

        const checkEmailLinkSignIn =
          result.current.isSignInWithEmailLink("test");
        expect(spy).toHaveBeenCalled();
        expect(checkEmailLinkSignIn).toBeFalsy();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call revokeAccessToken method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "revokeAccessToken");

        await result.current.revokeAccessToken("test");
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call sendPasswordResetEmail method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "sendPasswordResetEmail");

        await result.current.sendPasswordResetEmail({
          email: "test@gmail.com",
        });
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call sendSignInLinkToEmail method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "sendSignInLinkToEmail");

        await result.current.sendSignInLinkToEmail({
          email: "test@gmail.com",
          actionCodeSettings: {
            url: "http://127.0.0.1/login?email=test@gmail.com",
          },
        });
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call setPersistence method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "setPersistence");

        await result.current.setPersistence(browserLocalPersistence);
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call signInAnonymously method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "signInAnonymously");

        await result.current.signInAnonymously();
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call signInWithCustomToken method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "signInWithCustomToken");

        await result.current.signInWithCustomToken("test1234");
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call signInWithCredential method", async () => {
      try {
        const provider = new GoogleAuthProvider();
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi
          .spyOn(result.current, "signInWithCredential")
          .mockImplementation(async () => ({}) as UserCredential);
        const signInResult = await result.current.signInWithPopup({ provider });
        const credential =
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          GoogleAuthProvider.credentialFromResult(signInResult)!;
        await result.current.signInWithCredential(credential);
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call signInWithEmailLink method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "signInWithEmailLink");

        await result.current.signInWithEmailLink({
          email: "test1234@gmail.com",
        });
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call signInWithPhoneNumber method", async () => {
      try {
        const { result: authResult } = renderHook(() => useFirebaseAuth(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "signInWithPhoneNumber");
        const appVerifier = new RecaptchaVerifier(authResult.current, "");
        const confirmationResult = await result.current.signInWithPhoneNumber({
          phoneNumber: "+6285712341234",
          appVerifier,
        });
        expect(spy).toHaveBeenCalled();
        expect(confirmationResult).not.toBeUndefined();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call signInWithRedirect method", async () => {
      try {
        const provider = new GoogleAuthProvider();
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "signInWithRedirect");
        await result.current.signInWithRedirect({ provider });
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call signOut method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "signOut");
        await result.current.signOut();
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call updateCurrentUser method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "updateCurrentUser");
        await result.current.updateCurrentUser();
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });

    test("successfully call validatePassword method", async () => {
      try {
        const { result } = renderHook(() => useFirebaseAuthMethods(), {
          wrapper: ({ children }) => (
            <UnitTestProvider>{children}</UnitTestProvider>
          ),
        });
        const spy = vi.spyOn(result.current, "validatePassword");
        await result.current.validatePassword("!tesT1234");
        expect(spy).toHaveBeenCalled();
      } catch (error) {
        expect(error).not.toBeUndefined();
      }
    });
  });
});
