import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export type AppRole = "FREE" | "PAID" | "ADMIN";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const session = await requireAuth();
  const userRole = session.user.role ?? "FREE";
  if (!allowedRoles.includes(userRole)) {
    redirect("/dashboard");
  }
  return session;
}
