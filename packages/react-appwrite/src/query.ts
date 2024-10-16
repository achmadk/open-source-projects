import {
  type MutationObserverOptions,
  QueryClient,
  type QueryClientConfig,
  type QueryKey,
  type QueryObserverOptions,
} from "@tanstack/react-query";

export const defaultQueryOptions: QueryObserverOptions<
  unknown,
  unknown,
  unknown,
  unknown,
  QueryKey
> = {
  staleTime: Number.POSITIVE_INFINITY,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  retry: false,
};

export const defaultMutationOptions: MutationObserverOptions<
  unknown,
  unknown,
  unknown,
  unknown
> = {
  retry: false,
};

export const queryClientConfiguration: QueryClientConfig = {
  defaultOptions: {
    queries: defaultQueryOptions,
    mutations: defaultMutationOptions,
  },
};

export const queryClient = new QueryClient(queryClientConfiguration);
