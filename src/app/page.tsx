import Link from "next/link";
import { getStats } from "@/lib/library";

export default async function Home() {
  const stats = await getStats();
  return (
    <div className="space-y-8">
      <section className="hr-surface rounded-xl border p-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Headrush Community Tool
        </h1>
        <p className="mt-3 max-w-3xl text-zinc-700 dark:text-zinc-300">
          This app starts as a comprehensive model browser for the Headrush
          ecosystem. It is powered by your generated library and structured to
          support auth, roles, and paid tiers.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/models" className="hr-accent-btn rounded-md px-4 py-2 text-sm font-medium">
            Browse Models
          </Link>
          <Link
            href="/dashboard"
            className="hr-outline-btn rounded-md px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100"
          >
            Go to Dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Models" value={stats.total} />
        <StatCard label="Amps" value={stats.amps} />
        <StatCard label="Cabs" value={stats.cabs} />
        <StatCard label="Effects" value={stats.effects} />
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="hr-surface rounded-lg border p-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
    </article>
  );
}
