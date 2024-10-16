"use client";

import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAppwrite } from "react-appwrite";
import type { Avatar } from "./types";

/**
 * Used to generate image URLs.
 * @param avatar The avatar to generate.
 * @param options Options to pass to `react-query`
 */
export function useAvatar(
  avatar: Avatar,
  options?: UseQueryOptions<URL, unknown, URL, (string | Avatar)[]>,
) {
  const { avatars } = useAppwrite();
  const queryKey = useMemo(() => ["appwrite", "avatars", avatar], [avatar]);
  const queryResult = useQuery({
    queryKey,
    queryFn: () => {
      switch (avatar.type) {
        case "initials":
          return avatars.getInitials(
            avatar.name,
            avatar.dimensions?.width,
            avatar.dimensions?.height,
            avatar.background,
          );
        case "image":
          return avatars.getImage(
            avatar.url,
            avatar.dimensions?.width,
            avatar.dimensions?.height,
          );
        case "browser":
          return avatars.getBrowser(
            avatar.code,
            avatar.dimensions?.width,
            avatar.dimensions?.height,
            avatar.quality,
          );
        case "favicon":
          return avatars.getFavicon(avatar.url);
        case "qr":
          return avatars.getQR(
            avatar.text,
            avatar.size,
            avatar.margin,
            avatar.download,
          );
        case "card":
          return avatars.getCreditCard(
            avatar.code,
            avatar.dimensions?.width,
            avatar.dimensions?.height,
            avatar.quality,
          );
      }
    },
    // @ts-expect-error
    cacheTime: 0,
    // @ts-expect-error
    ...options,
  });

  return queryResult;
}
