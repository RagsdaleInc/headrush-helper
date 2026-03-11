import { ModelsBrowser } from "@/components/models-browser";
import { getLibraryData } from "@/lib/library";

export default async function ModelsPage() {
  const library = await getLibraryData();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Model Browser</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Explore amp, cab, and effect models from your seeded database.
      </p>
      <ModelsBrowser
        amps={library.amps}
        cabs={library.cabs}
        effects={library.effects}
      />
    </div>
  );
}
