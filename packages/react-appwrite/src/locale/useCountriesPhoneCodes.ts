"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { Models } from "appwrite";
import { useAppwrite } from "react-appwrite";

const queryKey = ["appwrite", "locale", "countries", "phones"];

/**
 * Access to a list of all countries' phone codes.
 * @param options Options to pass to `react-query`.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/locale?sdk=web-default#localeListCountriesPhones)
 */
export function useCountriesPhoneCodes(
  options?: UseQueryOptions<Models.Phone[], unknown, Models.Phone[], string[]>,
) {
  const { locale } = useAppwrite();
  const queryResult = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await locale.listCountriesPhones();

      return response.phones;
    },

    cacheTime: Number.POSITIVE_INFINITY,

    ...options,
  });

  return queryResult;
}
