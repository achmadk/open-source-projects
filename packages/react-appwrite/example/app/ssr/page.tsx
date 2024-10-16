import { Models } from "appwrite";
import { cookies } from "next/headers";
import { appwrite } from "../../util";
import { User } from "./User";

export default async function SsrPage() {
  const user = await appwrite.getUser(cookies());

  if (!user) {
    return <span>You are not logged in.</span>;
  }

  return <User {...user} />;
}
