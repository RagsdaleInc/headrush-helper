import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ModelCategory } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

const parameterSchema = z.object({
  key: z.string(),
  uiName: z.string(),
  valueType: z.string(),
  controlType: z.string(),
  min: z.number().nullable().optional(),
  max: z.number().nullable().optional(),
  step: z.number().nullable().optional(),
  format: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  options: z.array(z.string()).nullable().optional(),
  normalizeAlgo: z.number().nullable().optional(),
});

const modelSchema = z.object({
  kind: z.string(),
  modelName: z.string(),
  nodePath: z.string(),
  inspiredBy: z.string().optional(),
  imageURL: z.string().optional(),
  parameters: z.array(parameterSchema),
});

const librarySchema = z.object({
  schemaVersion: z.string().optional(),
  generatedAt: z.string().optional(),
  amps: z.array(modelSchema),
  cabs: z.array(modelSchema),
  effects: z.array(modelSchema),
});

export type LibraryModel = z.infer<typeof modelSchema>;
export type LibraryData = z.infer<typeof librarySchema>;
export type LibraryCategory = "amps" | "cabs" | "effects";

async function getLibraryDataFromFile() {
  const filePath = path.resolve(
    process.cwd(),
    "../DataFiles/headrush_library.json",
  );
  const raw = await fs.readFile(filePath, "utf8");
  return librarySchema.parse(JSON.parse(raw));
}

function mapDbCategory(category: ModelCategory): LibraryCategory {
  if (category === ModelCategory.AMP) return "amps";
  if (category === ModelCategory.CAB) return "cabs";
  return "effects";
}

function parseParamOptions(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  if (!value.every((item) => typeof item === "string")) return undefined;
  return value;
}

async function getLibraryDataFromDb() {
  const rows: Array<{
    category: ModelCategory;
    kind: string;
    modelName: string;
    nodePath: string;
    inspiredBy: string | null;
    imageURL: string | null;
    parameters: Array<{
      key: string;
      uiName: string;
      valueType: string;
      controlType: string;
      min: number | null;
      max: number | null;
      step: number | null;
      format: string | null;
      unit: string | null;
      options: unknown;
    }>;
  }> = await prisma.headrushModel.findMany({
    orderBy: [{ category: "asc" }, { modelName: "asc" }],
    include: {
      parameters: {
        orderBy: { uiName: "asc" },
      },
    },
  });

  const library: LibraryData = {
    schemaVersion: "library-v2-db",
    generatedAt: new Date().toISOString(),
    amps: [],
    cabs: [],
    effects: [],
  };

  for (const row of rows) {
    const section = mapDbCategory(row.category);
    library[section].push({
      kind: row.kind,
      modelName: row.modelName,
      nodePath: row.nodePath,
      inspiredBy: row.inspiredBy ?? undefined,
      imageURL: row.imageURL ?? undefined,
      parameters: row.parameters.map((param) => ({
        key: param.key,
        uiName: param.uiName,
        valueType: param.valueType,
        controlType: param.controlType,
        min: param.min ?? undefined,
        max: param.max ?? undefined,
        step: param.step ?? undefined,
        format: param.format ?? undefined,
        unit: param.unit ?? undefined,
        options: parseParamOptions(param.options),
      })),
    });
  }

  return library;
}

export async function getLibraryData() {
  noStore();

  // Prefer DB when seeded; fallback to JSON for local bootstrapping.
  const dbCount = await prisma.headrushModel.count();
  if (dbCount > 0) {
    return getLibraryDataFromDb();
  }

  return getLibraryDataFromFile();
}

export async function getAllModels() {
  const library = await getLibraryData();
  return [...library.amps, ...library.cabs, ...library.effects];
}

export async function getStats() {
  const library = await getLibraryData();
  return {
    amps: library.amps.length,
    cabs: library.cabs.length,
    effects: library.effects.length,
    total: library.amps.length + library.cabs.length + library.effects.length,
  };
}
