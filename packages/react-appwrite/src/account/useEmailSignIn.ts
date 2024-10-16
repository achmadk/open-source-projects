"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Models } from "appwrite";
import { useAppwrite } from "react-appwrite";

type TRequest = {
  email: string;
  password: string;
};
/**
 * Create email session.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountCreateEmailSession)
 */
function useEmailSignIn() {
  const { account } = useAppwrite();
  const queryClient = useQueryClient();
  const mutation = useMutation<Models.Session, unknown, TRequest, unknown>({
    mutationFn: async (request) => {
      return await account.createSession(request.email, request.password);
    },
    // @ts-expect-error
    onSuccess: async () => {
      queryClient.setQueryData(["appwrite", "account"], await account.get());
    },
  });

  return mutation;
}

export { useEmailSignIn };
