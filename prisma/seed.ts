import { PrismaClient, ModelCategory, Prisma } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";

type LibraryParameter = {
  key: string;
  uiName: string;
  valueType: string;
  controlType: string;
  min?: number;
  max?: number;
  step?: number;
  format?: string;
  unit?: string;
  options?: unknown;
};

type LibraryModel = {
  kind: string;
  modelName: string;
  nodePath: string;
  inspiredBy?: string;
  imageURL?: string;
  parameters: LibraryParameter[];
};

type LibraryFile = {
  amps: LibraryModel[];
  cabs: LibraryModel[];
  effects: LibraryModel[];
};

const prisma = new PrismaClient();

function getCategory(section: "amps" | "cabs" | "effects"): ModelCategory {
  if (section === "amps") return ModelCategory.AMP;
  if (section === "cabs") return ModelCategory.CAB;
  return ModelCategory.EFFECT;
}

async function main() {
  const filePath = path.resolve(
    process.cwd(),
    "../DataFiles/headrush_library.json",
  );
  const fileRaw = await readFile(filePath, "utf8");
  const library = JSON.parse(fileRaw) as LibraryFile;

  for (const section of ["amps", "cabs", "effects"] as const) {
    const category = getCategory(section);
    const models = library[section];

    for (const model of models) {
      const upserted = await prisma.headrushModel.upsert({
        where: {
          category_modelName: {
            category,
            modelName: model.modelName,
          },
        },
        update: {
          kind: model.kind,
          nodePath: model.nodePath,
          inspiredBy: model.inspiredBy,
          imageURL: model.imageURL,
        },
        create: {
          category,
          kind: model.kind,
          modelName: model.modelName,
          nodePath: model.nodePath,
          inspiredBy: model.inspiredBy,
          imageURL: model.imageURL,
        },
      });

      await prisma.modelParameter.deleteMany({
        where: { modelId: upserted.id },
      });

      if (model.parameters.length > 0) {
        await prisma.modelParameter.createMany({
          data: model.parameters.map((param) => ({
            modelId: upserted.id,
            key: param.key,
            uiName: param.uiName,
            valueType: param.valueType,
            controlType: param.controlType,
            min: param.min,
            max: param.max,
            step: param.step,
            format: param.format,
            unit: param.unit,
            options:
              param.options === undefined
                ? undefined
                : (param.options as Prisma.InputJsonValue),
          })),
        });
      }
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
