import { render, renderHook, screen } from "@testing-library/react";
import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import { createContext } from "react";
// @vitest-environment jsdom
import { describe, expect, test } from "vitest";

import { UnitTestProvider } from "./UnitTestProvider";
import {
  FirebaseConsumer,
  FirebaseContext,
  FirebaseProvider,
  useFirebaseApp,
} from "./app";

describe("test app.ts", () => {
  test("check FirebaseContext", () => {
    console.log(recaptchaSiteKey);
    expect(FirebaseContext).not.toBeUndefined();
  });

  test("check FirebaseConsumer", () => {
    expect(FirebaseConsumer).not.toBeUndefined();
  });

  describe("check FirebaseProvider", () => {
    test("FirebaseProvider is not undefined", () => {
      expect(FirebaseProvider).not.toBeUndefined();
    });

    test("FirebaseProvider is rendered successfully", () => {
      const { unmount } = render(<FirebaseProvider options={{}} />);
      expect(screen).not.toBeUndefined();

      unmount();
    });

    test("FirebaseProvider is rendered successfully with custom context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const OtherContext = createContext<FirebaseApp>(undefined!);
      const { unmount } = render(
        <FirebaseProvider
          options={firebaseConfig as FirebaseOptions}
          context={OtherContext}
        />,
      );
      expect(screen).not.toBeUndefined();

      unmount();
    });
  });

  describe("check useFirebaseApp", () => {
    test("useFirebaseApp result is undefined when no FirebaseProvider component", () => {
      const { result, unmount } = renderHook(() => useFirebaseApp());
      expect(result.current).toBeUndefined();
      unmount();
    });

    test("useFirebaseApp result is not undefined when FirebaseProvider component exist", () => {
      const { result, unmount } = renderHook(() => useFirebaseApp(), {
        wrapper: ({ children }) => (
          <UnitTestProvider>{children}</UnitTestProvider>
        ),
      });
      expect(result.current).not.toBeUndefined();
      unmount();
    });

    test("useFirebaseApp result is not undefined when FirebaseProvider component exist with different context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const OtherContext = createContext<FirebaseApp>(undefined!);
      const { result, unmount } = renderHook(
        () => useFirebaseApp(OtherContext),
        {
          wrapper: ({ children }) => (
            <UnitTestProvider context={OtherContext}>
              {children}
            </UnitTestProvider>
          ),
        },
      );
      expect(result.current).not.toBeUndefined();
      unmount();
    });
  });
});
