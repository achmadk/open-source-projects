"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { Models } from "appwrite";
import { useAppwrite } from "react-appwrite";

const queryKey = ["appwrite", "locale", "languages"];

/**
 * Access to a list of all languages.
 * @param options Options to pass to `react-query`.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/locale?sdk=web-default#localeListLanguages)
 */
export function useLanguages(
  options?: UseQueryOptions<
    Models.Language[],
    unknown,
    Models.Language[],
    string[]
  >,
) {
  const { locale } = useAppwrite();
  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await locale.listLanguages();

      return response.languages;
    },

    cacheTime: Number.POSITIVE_INFINITY,

    ...options,
  });

  return queryResult;
}
