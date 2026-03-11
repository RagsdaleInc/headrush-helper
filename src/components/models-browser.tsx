"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { LibraryModel } from "@/lib/library";

type Props = {
  amps: LibraryModel[];
  cabs: LibraryModel[];
  effects: LibraryModel[];
};

type Filter = "all" | "amps" | "cabs" | "effects";

export function ModelsBrowser({ amps, cabs, effects }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedModel, setSelectedModel] = useState<LibraryModel | null>(null);

  const rows = useMemo(() => {
    const source =
      filter === "amps"
        ? amps
        : filter === "cabs"
          ? cabs
          : filter === "effects"
            ? effects
            : [...amps, ...cabs, ...effects];

    const normalized = query.trim().toLowerCase();
    if (!normalized) return source;

    return source.filter((model) => {
      const haystack = [
        model.modelName,
        model.kind,
        model.inspiredBy ?? "",
        ...model.parameters.map((p) => p.uiName),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [amps, cabs, effects, filter, query]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedModel(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <section className="space-y-5">
      <div className="hr-surface rounded-lg border p-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search models, inspired by, or parameter names..."
          className="w-full rounded-md border border-zinc-300 bg-[color-mix(in_srgb,var(--surface-2)_85%,transparent)] px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[var(--accent)] dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as Filter)}
          className="rounded-md border border-zinc-300 bg-[color-mix(in_srgb,var(--surface-2)_85%,transparent)] px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
        >
          <option value="all">All categories</option>
          <option value="amps">Amps</option>
          <option value="cabs">Cabs</option>
          <option value="effects">Effects</option>
        </select>
      </div>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing {rows.length} models
        {query ? ` for "${query}"` : ""}.
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((model) => (
          <article
            key={`${model.kind}-${model.modelName}`}
            className="hr-surface rounded-lg border p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {model.modelName}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                  {model.kind}
                </p>
                {model.inspiredBy ? (
                  <p className="mt-2 whitespace-pre-line text-sm text-zinc-700 dark:text-zinc-300">
                    {model.inspiredBy}
                  </p>
                ) : null}
              </div>

              {model.imageURL ? (
                <div className="hr-surface-soft shrink-0 overflow-hidden rounded-md border p-1">
                  <Image
                    src={model.imageURL}
                    alt={`${model.modelName} preview`}
                    width={140}
                    height={140}
                    loading="lazy"
                    className="h-24 w-24 object-contain md:h-28 md:w-28"
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Parameters ({model.parameters.length})
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {model.parameters.map((param) => (
                  <span
                    key={`${model.modelName}-${param.key}`}
                    className="hr-surface-soft rounded-md border px-2 py-1 text-xs text-zinc-700 dark:text-zinc-200"
                  >
                    {param.uiName}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setSelectedModel(model)}
                className="hr-outline-btn rounded-md px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100"
              >
                View details
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedModel ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedModel(null)}
        >
          <div
            className="hr-surface max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl border p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedModel.modelName}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                  {selectedModel.kind}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModel(null)}
                className="hr-outline-btn rounded-md px-3 py-1.5 text-sm text-zinc-900 dark:text-zinc-100"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                {selectedModel.inspiredBy ? (
                  <p className="whitespace-pre-line text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      Inspired by:
                    </span>{" "}
                    {selectedModel.inspiredBy}
                  </p>
                ) : null}
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    Node path:
                  </span>{" "}
                  <code>{selectedModel.nodePath}</code>
                </p>
                {selectedModel.imageURL ? (
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      Image URL:
                    </span>{" "}
                    <a
                      href={selectedModel.imageURL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--accent)] hover:text-[var(--accent-strong)]"
                    >
                      Open image
                    </a>
                  </p>
                ) : null}
              </div>

              {selectedModel.imageURL ? (
                <div className="hr-surface-soft shrink-0 overflow-hidden rounded-md border p-1">
                  <Image
                    src={selectedModel.imageURL}
                    alt={`${selectedModel.modelName} preview`}
                    width={180}
                    height={180}
                    className="h-28 w-28 object-contain md:h-36 md:w-36"
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-200/80 dark:border-zinc-800/80">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] text-zinc-700 dark:bg-[color-mix(in_srgb,var(--accent)_16%,var(--surface))] dark:text-zinc-300">
                  <tr>
                    <th className="px-3 py-2">UI Name</th>
                    <th className="px-3 py-2">Key</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Control</th>
                    <th className="px-3 py-2">Range</th>
                    <th className="px-3 py-2">Step</th>
                    <th className="px-3 py-2">Format</th>
                    <th className="px-3 py-2">Unit</th>
                    <th className="px-3 py-2">Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {selectedModel.parameters.map((param) => (
                    <tr
                      key={`${selectedModel.modelName}-${param.key}`}
                      className="bg-white text-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
                    >
                      <td className="px-3 py-2 font-medium">{param.uiName}</td>
                      <td className="px-3 py-2">
                        <code>{param.key}</code>
                      </td>
                      <td className="px-3 py-2">{param.valueType}</td>
                      <td className="px-3 py-2">{param.controlType}</td>
                      <td className="px-3 py-2">
                        {param.min != null || param.max != null
                          ? `${param.min ?? "-"} to ${param.max ?? "-"}`
                          : "-"}
                      </td>
                      <td className="px-3 py-2">
                        {param.step != null ? param.step : "-"}
                      </td>
                      <td className="px-3 py-2">{param.format ?? "-"}</td>
                      <td className="px-3 py-2">{param.unit ?? "-"}</td>
                      <td className="px-3 py-2">
                        {param.options?.length ? param.options.join(", ") : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
