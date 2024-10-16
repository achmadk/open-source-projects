"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { Models } from "appwrite";
import { useAppwrite } from "react-appwrite";

const queryKey = ["appwrite", "locale", "currencies"];

/**
 * Access to a list of all currencies.
 * @param options Options to pass to `react-query`.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/locale?sdk=web-default#localeListCurrencies)
 */
export function useCurrencies(
  options?: UseQueryOptions<
    Models.Currency[],
    unknown,
    Models.Currency[],
    string[]
  >,
) {
  const { locale } = useAppwrite();
  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await locale.listCurrencies();

      return response.currencies;
    },

    cacheTime: Number.POSITIVE_INFINITY,

    ...options,
  });

  return queryResult;
}
