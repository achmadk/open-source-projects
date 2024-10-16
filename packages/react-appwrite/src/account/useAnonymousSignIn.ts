import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Models } from "appwrite";
import { useAccount } from "react-appwrite";

/**
 * Create anonymous session.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/account?sdk=web-default#accountCreateAnonymousSession)
 */
export function useAnonymousSignIn() {
  const account = useAccount();
  const queryClient = useQueryClient();
  const mutation = useMutation<Models.Session>({
    mutationFn: async () => {
      return await account.createAnonymousSession();
    },

    onSuccess: async () => {
      queryClient.setQueryData(["appwrite", "account"], await account.get());
    },
  }, queryClient);

  return mutation;
}
