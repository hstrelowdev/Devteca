import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export async function exigirAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin");
  return session;
}
