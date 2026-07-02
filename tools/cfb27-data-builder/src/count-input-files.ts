import { readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const builderRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const inputDir = join(builderRoot, "input");
const outputDir = join(builderRoot, "output");
const prestigeFolders = ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"] as const;
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".heic"]);

type InputFileCountReport = {
  generatedAt: string;
  folders: Record<(typeof prestigeFolders)[number], number>;
  total: number;
  expectedTotal: number;
  matchesExpectedTotal: boolean;
};

export async function countInputFiles(): Promise<InputFileCountReport> {
  const folders = Object.fromEntries(
    await Promise.all(
      prestigeFolders.map(async (folder) => [folder, await countImages(folder)])
    )
  ) as Record<(typeof prestigeFolders)[number], number>;
  const total = Object.values(folders).reduce((sum, count) => sum + count, 0);
  const report = {
    generatedAt: new Date().toISOString(),
    folders,
    total,
    expectedTotal: 117,
    matchesExpectedTotal: total === 117
  };

  await writeFile(
    join(outputDir, "input-file-count-report.json"),
    `${JSON.stringify(report, null, 2)}\n`,
    "utf8"
  );

  return report;
}

async function countImages(folder: string) {
  const entries = await readdir(join(inputDir, folder), { withFileTypes: true });

  return entries.filter(
    (entry) =>
      entry.isFile() && imageExtensions.has(extname(entry.name).toLowerCase())
  ).length;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  countInputFiles()
    .then((report) => {
      console.log(JSON.stringify(report, null, 2));
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
