"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import type { Models } from "appwrite";
import { useMemo } from "react";
import { useAppwrite } from "react-appwrite";
import type { LocaleCountryType } from "./types";

type LocalCountriesQueryKey = [
  "appwrite",
  "locale",
  "countries",
  { type: LocaleCountryType },
];

/**
 * Access to a list of all countries.
 * @param type The type of countries to get.
 * @param options Options to pass to `react-query`.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/locale?sdk=web-default#localeListCountries)
 */
export function useCountries(
  type: LocaleCountryType = "all",
  options?: UseQueryOptions<
    Models.Country[],
    unknown,
    Models.Country[],
    LocalCountriesQueryKey
  >,
) {
  const { locale } = useAppwrite();
  const queryKey = useMemo(
    () => ["appwrite", "locale", "countries", { type }],
    [type],
  ) as LocalCountriesQueryKey;
  const queryResult = useQuery({
    queryKey,
    queryFn: async ({ queryKey: [, , , { type }] }) => {
      let response: Models.CountryList;

      if (type === "all") {
        response = await locale.listCountries();
      } else {
        response = await locale.listCountriesEU();
      }

      return response.countries;
    },
    // @ts-expect-error
    cacheTime: Number.POSITIVE_INFINITY,
    // @ts-expect-error
    ...options,
  });

  return queryResult;
}
