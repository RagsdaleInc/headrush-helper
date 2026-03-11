import Link from "next/link";
import { requireAuth } from "@/lib/rbac";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Signed in as {session.user.email} ({session.user.role})
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="hr-surface rounded-lg border p-4">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Role access</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            <li>FREE: Browse model library</li>
            <li>PAID: Premium features (to add)</li>
            <li>ADMIN: Admin management features</li>
          </ul>
        </article>

        <article className="hr-surface rounded-lg border p-4">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Quick links</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/models" className="text-[var(--accent)] hover:text-[var(--accent-strong)]">
              Browse all models
            </Link>
            <Link href="/admin" className="text-[var(--accent)] hover:text-[var(--accent-strong)]">
              Admin area
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
