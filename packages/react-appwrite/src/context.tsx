import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type DevtoolsOptions,
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools/build/modern/devtools";
import type { AppwriteException, Client } from "appwrite";
import {
  type Context,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from "react";

import { queryClient as queryClientFallback } from "./query";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
export const AppwriteContext = createContext<Client>(undefined!);

type Props = {
  client: Client;
  children: ReactNode;
  /**
   * @default false
   */
  devTools?: boolean | DevtoolsOptions;

  /**
   * @default undefined
   */
  queryClient?: QueryClient;

  /**
   * @default AppwriteContext
   */
  context?: Context<Client>;
};

export function AppwriteProvider({
  client,
  children,
  devTools = false,
  queryClient = undefined,
  context = AppwriteContext,
}: Props) {
  return (
    <context.Provider value={client}>
      <QueryClientProvider client={queryClient ?? queryClientFallback}>
        {children}

        {devTools && (
          <ReactQueryDevtools
            {...(typeof devTools === "boolean" ? {} : devTools)}
          />
        )}
      </QueryClientProvider>
    </context.Provider>
  );
}

export const useAppwrite = (context = AppwriteContext) => useContext(context);

export const isAppwriteError = (error: unknown): error is AppwriteException => {
  return (
    typeof error === "object" &&
    !!error &&
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (error as any).name === "AppwriteException"
  );
};
