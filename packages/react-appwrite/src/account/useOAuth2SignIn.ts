"use client";

import { useMutation } from "@tanstack/react-query";
import { useAppwrite } from "react-appwrite";
import type { OAuth2Provider } from "./types";

type TRequest = {
  provider: OAuth2Provider;
  successUrl: string;
  failureUrl: string;
  scopes?: string[];
};

/**
 * Create Oauth2 session using one of the OAuth2 providers.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountCreateOAuth2Session)
 */
export function useOAuth2SignIn() {
  const { account } = useAppwrite();
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  const mutation = useMutation<void | URL, unknown, TRequest, unknown>({
    // @ts-expect-error
    mutationFn: async (request) => {
      // @ts-expect-error
      return account.createOAuth2Session(
        request.provider,
        request.successUrl,
        request.failureUrl,
        request.scopes,
      );
    },
  });

  return mutation;
}
