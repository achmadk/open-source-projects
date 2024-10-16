import { Account, type Client } from "appwrite";
import { type Context, useMemo } from "react";
import { useAppwrite } from "react-appwrite";

export function useAccount(context?: Context<Client>) {
  const client = useAppwrite(context)
  return useMemo(() => new Account(client), [client])
}
