"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Models } from "appwrite";
import { useAppwrite } from "react-appwrite";

type Props = {
  bucketId: string;
  fileId: string;
  name?: string;
  permissions?: string[];
};

/**
 * Update a file in a bucket.
 * @link [Appwrite Documentation](https://appwrite.io/docs/client/storage?sdk=web-default#storageUpdateFile)
 */
export function useFileUpdate() {
  const { storage } = useAppwrite();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    // @ts-expect-error
    mutationFn: async ({ bucketId, fileId, name, permissions }: Props) => {
      return await storage.updateFile(bucketId, fileId, name, permissions);
    },

    onSuccess: async (file, { bucketId, fileId }) => {
      queryClient.setQueryData(
        ["appwrite", "storage", "files", bucketId, fileId],
        file,
      );
    },
  });

  return mutation;
}
