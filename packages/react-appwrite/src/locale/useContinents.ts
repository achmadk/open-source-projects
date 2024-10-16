"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { Models } from "appwrite";
import { useAppwrite } from "react-appwrite";

const queryKey = ["appwrite", "locale", "continents"];

/**
 * Access to a list of all continents.
 * @param options Options to pass to `react-query`.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/locale?sdk=web-default#localeListContinents)
 */
export function useContinents(
  options?: UseQueryOptions<
    Models.Continent[],
    unknown,
    Models.Continent[],
    string[]
  >,
) {
  const { locale } = useAppwrite();
  const queryResult = useQuery({
    queryKey,
    // @ts-expect-error
    queryFn: async () => {
      const response = await locale.listContinents();

      return response.continents;
    },
    // @ts-expect-error
    cacheTime: Number.POSITIVE_INFINITY,

    ...options,
  });

  return queryResult;
}
