import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

export default async function AdminPage() {
  await requireRole(["ADMIN"]);

  const users: Array<{
    id: string;
    name: string | null;
    email: string | null;
    role: "FREE" | "PAID" | "ADMIN";
    createdAt: Date;
  }> = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 25,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Admin</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Role-protected route. Only users with <code>ADMIN</code> role can view
        this page.
      </p>

      <div className="overflow-x-auto rounded-lg border border-zinc-200/80 dark:border-zinc-800/80">
        <table className="min-w-full bg-[var(--surface)] text-sm text-zinc-700 dark:text-zinc-200">
          <thead className="bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-zinc-600 dark:bg-[color-mix(in_srgb,var(--accent)_16%,var(--surface))] dark:text-zinc-300">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="px-3 py-2">{user.name ?? "-"}</td>
                <td className="px-3 py-2">{user.email ?? "-"}</td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2">
                  {user.createdAt.toISOString().slice(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
