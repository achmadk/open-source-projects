// import { renderToString } from 'react-dom/server'
import { render, renderHook, screen } from "@testing-library/react";
import type { FirebaseOptions, FirebaseServerApp } from "firebase/app";
import { createContext } from "react";
// import '../test/setup-test-ssr'
import { describe, expect, test } from "vitest";

import {
  FirebaseServerConsumer,
  FirebaseServerContext,
  FirebaseServerProvider,
  useFirebaseServerApp,
} from "./app-server";

describe.skip("test app-server.ts", () => {
  test("check FirebaseServerContext", () => {
    expect(FirebaseServerContext).not.toBeUndefined();
  });

  test("check FirebaseServerConsumer", () => {
    expect(FirebaseServerConsumer).not.toBeUndefined();
  });

  describe("check FirebaseServerProvider", () => {
    test("FirebaseServerProvider is not undefined", () => {
      expect(FirebaseServerProvider).not.toBeUndefined();
    });

    test("FirebaseServerProvider is rendered successfully", () => {
      const { unmount } = render(
        <FirebaseServerProvider options={firebaseConfig as FirebaseOptions} />,
        { hydrate: true },
      );
      expect(screen).not.toBeUndefined();

      unmount();
    });

    test("FirebaseServerProvider is rendered successfully with custom context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const OtherContext = createContext<FirebaseServerApp>(undefined!);
      const ui = (
        <FirebaseServerProvider
          options={firebaseConfig as FirebaseOptions}
          context={OtherContext}
        />
      );
      //   const container = document.createElement('div')
      //   document.body.appendChild(container)
      //   container.innerHTML = renderToString(ui)
      const { unmount } = render(ui, { hydrate: true, container: undefined });
      expect(screen).not.toBeUndefined();

      unmount();
    });
  });

  describe("check useFirebaseServerApp", () => {
    test("useFirebaseServerApp result is undefined when no FirebaseServerProvider component", () => {
      const { result, unmount } = renderHook(() => useFirebaseServerApp(), {
        hydrate: true,
        container: undefined,
        baseElement: undefined,
      });
      expect(result.current).toBeUndefined();
      unmount();
    });

    test("useFirebaseServerApp result is not undefined when FirebaseServerProvider component exist", () => {
      const { result, unmount } = renderHook(() => useFirebaseServerApp(), {
        wrapper: ({ children }) => (
          <FirebaseServerProvider options={firebaseConfig as FirebaseOptions}>
            {children}
          </FirebaseServerProvider>
        ),
        hydrate: true,
      });
      console.log(result.current);
      expect(result.current).not.toBeUndefined();
      unmount();
    });

    test("useFirebaseServerApp result is not undefined when FirebaseServerProvider component exist with different context", () => {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const OtherContext = createContext<FirebaseServerApp>(undefined!);
      const { result, unmount } = renderHook(
        () => useFirebaseServerApp(OtherContext),
        {
          wrapper: ({ children }) => (
            <FirebaseServerProvider
              options={firebaseConfig as FirebaseOptions}
              context={OtherContext}
            >
              {children}
            </FirebaseServerProvider>
          ),
          hydrate: true,
        },
      );
      expect(result.current).not.toBeUndefined();
      unmount();
    });
  });
});
