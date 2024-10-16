"use client";

import {
  type UseQueryOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useAppwrite } from "react-appwrite";
import type { DatabaseDocument } from "./types";

/**
 * Fetches a document from a database.
 * @param databaseId The database the document belongs to.
 * @param collectionId The collection the document belongs to.
 * @param documentId The document to fetch.
 * @param options Options to pass to `react-query`.
 */
export function useDocument<TDocument>(
  databaseId: string,
  collectionId: string,
  documentId: string,
  options?: UseQueryOptions<
    DatabaseDocument<TDocument>,
    unknown,
    DatabaseDocument<TDocument>,
    string[]
  >,
) {
  const { databases } = useAppwrite();
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => [
      "appwrite",
      "databases",
      databaseId,
      collectionId,
      "documents",
      documentId,
    ],
    [databaseId, collectionId, documentId],
  );

  const queryResult = useQuery({
    queryKey,
    // @ts-expect-error
    queryFn: async () => {
      return await databases.getDocument<DatabaseDocument<TDocument>>(
        databaseId,
        collectionId,
        documentId,
      );
    },

    ...options,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const unsubscribe = databases.client.subscribe(
      `databases.${databaseId}.collections.${collectionId}.documents.${documentId}`,
      (response) => {
        queryClient.setQueryData(queryKey, response.payload);
      },
    );

    return unsubscribe;
  }, [databaseId, collectionId, documentId, queryKey]);

  return queryResult;
}
