import {
  type FirebaseApp,
  type FirebaseOptions,
  type FirebaseServerApp,
  type FirebaseServerAppSettings,
  deleteApp as firebaseDeleteApp,
  initializeServerApp,
} from "firebase/app";
import {
  type Context,
  type PropsWithChildren,
  type ReactElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

import type { FirebaseContextType } from "./Context";

export type FirebaseServerContextType = FirebaseContextType<FirebaseServerApp>;

export const FirebaseServerContext = createContext<FirebaseServerApp>(
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  undefined!,
);

export type FirebaseServerProviderProps = PropsWithChildren<{
  options: FirebaseOptions | FirebaseApp;
  appSettings?: FirebaseServerAppSettings;
  context?: FirebaseServerContextType;
}>;

/** istanbul ignore next */
export const FirebaseServerProvider = <
  Props extends FirebaseServerProviderProps = FirebaseServerProviderProps,
>({
  children,
  options,
  appSettings = {},
  context: Context = FirebaseServerContext,
}: Props): ReactElement<Props> => {
  const app = useMemo(
    () => initializeServerApp(options, appSettings),
    [options, appSettings],
  );

  const deleteApp = useCallback(
    async () => await firebaseDeleteApp(app),
    [app],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    return () => deleteApp() as unknown as void;
  }, []);

  return <Context.Provider value={app}>{children}</Context.Provider>;
};

export const { Consumer: FirebaseServerConsumer } = FirebaseServerContext;

export interface DefaultReactFirebaseServerHooksOptions {
  context?: Context<FirebaseServerApp>;
}

export function useFirebaseServerApp(context = FirebaseServerContext) {
  return useContext(context);
}
