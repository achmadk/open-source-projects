"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Models } from "appwrite";
import { useAppwrite } from "react-appwrite";

type TRequest = {
  sessionId?: string;
};

/**
 * Delete current or the specified session.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountDeleteSession)
 */
export function useSignOut() {
  const { account: accountService } = useAppwrite();
  const queryClient = useQueryClient();
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  const mutation = useMutation<
    Models.Session | void,
    unknown,
    TRequest | undefined | void,
    unknown
  >({
    mutationFn: async (request) => {
      if (!request?.sessionId) {
        return void (await accountService.deleteSession("current"));
      }

      const session = await accountService.getSession(request.sessionId);

      accountService.deleteSession(session.$id);

      return session;
    },
    // @ts-expect-error
    onSuccess: async () => {
      await queryClient.setQueryData(["appwrite", "account"], null);
    },
  });

  return mutation;
}
