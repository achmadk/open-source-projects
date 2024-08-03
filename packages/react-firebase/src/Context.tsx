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

/**
 * @description props for {@link FirebaseProvider} component
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface FirebaseProviderProps
 * @extends {PropsWithChildren<{
 *     options: FirebaseOptions;
 *     context?: FirebaseContextType<App>;
 *     name?: string;
 *     appSettings?: FirebaseAppSettings;
 *     deleteInstanceWhenUnmount?: boolean;
 *   }>}
 * @template App
 */
export type FirebaseProviderProps<App extends FirebaseApp = FirebaseApp> =
  PropsWithChildren<{
    options: FirebaseOptions;
    context?: FirebaseContextType<App>;
    name?: string;
    appSettings?: FirebaseAppSettings;

    /**
     * @description whether your firebase instance deleted or not when unmounted.
     * @default true
     * @author Achmad Kurnianto
     * @date 01/08/2024
     * @type {boolean}
     */
    deleteInstanceWhenUnmount?: boolean;
  }>;

/**
 * @description react component with embedded built-in firebase instance.
 * you can add your firebase configuration through {@link options} props.
 * you can also use your custom context through {@link context} props.
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @template PropType
 * @param {PropType} {
 *   children,
 *   options,
 *   name,
 *   appSettings,
 *   context: Context = FirebaseContext,
 *   deleteInstanceWhenUnmount = true,
 * }
 * @returns {*}  {ReactElement<PropType>}
 */
export function FirebaseProvider<
  PropType extends FirebaseProviderProps = FirebaseProviderProps,
>({
  children,
  options,
  name,
  appSettings,
  context = FirebaseContext,
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

  return <context.Provider value={app}>{children}</context.Provider>;
}

/**
 * @description options for {@link useFirebaseApp}
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultReactFirebaseHooksOptions
 */
export interface DefaultReactFirebaseHooksOptions {
  /**
   * @description used context for {@link FirebaseProvider} component
   * Default value is {@link FirebaseContext}
   * @author Achmad Kurnianto
   * @date 01/08/2024
   * @type {FirebaseContextType}
   * @memberof DefaultReactFirebaseHooksOptions
   */
  context?: FirebaseContextType;
}

/**
 * @description hooks to get firebase app instance
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @param {FirebaseContextType} [context=FirebaseContext]
 * @returns {*}  {FirebaseApp}
 */
export function useFirebaseApp(
  context: FirebaseContextType = FirebaseContext,
): FirebaseApp {
  return useContext(context);
}
