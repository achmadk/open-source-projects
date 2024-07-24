import {
  type FirebaseApp,
  type FirebaseAppSettings,
  type FirebaseOptions,
  deleteApp as firebaseDeleteApp,
  initializeApp,
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

export type FirebaseContextType<App extends FirebaseApp = FirebaseApp> =
  Context<App>;

// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const FirebaseContext = createContext<FirebaseApp>(undefined!);

export const { Consumer: FirebaseConsumer } = FirebaseContext;

export type FirebaseProviderProps<App extends FirebaseApp = FirebaseApp> =
  PropsWithChildren<{
    options: FirebaseOptions;
    context?: FirebaseContextType<App>;
    name?: string;
    appSettings?: FirebaseAppSettings;
    deleteInstanceWhenUnmount?: boolean;
  }>;

export function FirebaseProvider<
  PropType extends FirebaseProviderProps = FirebaseProviderProps,
>({
  children,
  options,
  name,
  appSettings,
  context: Context = FirebaseContext,
  deleteInstanceWhenUnmount = true,
}: PropType): ReactElement<PropType> {
  const app = useMemo(() => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    return initializeApp(options, (appSettings ?? name) as any);
  }, [options, appSettings, name]);

  const deleteApp = useCallback(
    async () => await firebaseDeleteApp(app),
    [app],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    return () => {
      if (deleteInstanceWhenUnmount) {
        // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
        deleteApp() as unknown as void;
      }
    };
  }, []);

  return <Context.Provider value={app}>{children}</Context.Provider>;
}

export interface DefaultReactFirebaseHooksOptions {
  context?: FirebaseContextType;
}

export function useFirebaseApp(context: FirebaseContextType = FirebaseContext) {
  return useContext(context);
}
