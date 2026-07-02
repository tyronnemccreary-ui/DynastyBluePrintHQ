import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { BuilderOutput, ExtractedTeamRecord, ValidationResult } from "./types";

const builderRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(builderRoot, "output");
const generatedFileName = "cfb27-teams.generated.json";

export async function buildTeamDatabase() {
  const sourceFiles = await getSourceFiles();
  const records = await readTeamRecords(sourceFiles);
  const normalizedRecords = records.map(normalizeTeamRecord);
  const validation = validateTeamRecords(normalizedRecords);

  const output: BuilderOutput = {
    generatedAt: new Date().toISOString(),
    sourceFiles,
    records: normalizedRecords,
    validation
  };

  await writeFile(
    join(outputDir, generatedFileName),
    `${JSON.stringify(output, null, 2)}\n`,
    "utf8"
  );

  return output;
}

async function getSourceFiles() {
  const fileNames = await readdir(outputDir);

  return fileNames
    .filter((fileName) => fileName.endsWith(".json"))
    .filter((fileName) => fileName !== generatedFileName);
}

async function readTeamRecords(sourceFiles: string[]) {
  const records = await Promise.all(
    sourceFiles.map(async (sourceFile) => {
      const contents = await readFile(join(outputDir, sourceFile), "utf8");
      return JSON.parse(contents) as ExtractedTeamRecord;
    })
  );

  return records;
}

function normalizeTeamRecord(record: ExtractedTeamRecord): ExtractedTeamRecord {
  return {
    ...record,
    id: record.id ?? normalizeSchoolId(record.school),
    dynastyPoints: {
      ...record.dynastyPoints,
      available: calculateAvailableDynastyPoints(record.dynastyPoints)
    }
  };
}

function normalizeSchoolId(school: string) {
  return school
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calculateAvailableDynastyPoints(
  points: ExtractedTeamRecord["dynastyPoints"]
) {
  if (typeof points.available === "number") {
    return Math.max(0, points.available);
  }

  const total = points.total ?? 0;
  const allocated = points.allocated ?? 0;
  const used = points.used ?? 0;

  return Math.max(0, total - allocated - used);
}

function validateTeamRecords(records: ExtractedTeamRecord[]): ValidationResult {
  const errors = records.flatMap((record) =>
    validateTeamRecord(record).errors.map((error) => `${record.school}: ${error}`)
  );

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateTeamRecord(record: ExtractedTeamRecord): ValidationResult {
  const errors: string[] = [];

  validateRequiredString("school", record.school, errors);
  validateRequiredString("mascot", record.mascot, errors);
  validateRequiredString("shortName", record.shortName, errors);
  validateRequiredString("conference", record.conference, errors);
  validateRating("overall", record.overall, errors);
  validateRating("offense", record.offense, errors);
  validateRating("defense", record.defense, errors);
  validatePrestige(record.teamPrestige, errors);
  validateDynastyPoints(record, errors);

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateRequiredString(label: string, value: string, errors: string[]) {
  if (!value || value.trim().length === 0) {
    errors.push(`${label} is required`);
  }
}

function validateRating(label: string, value: number | "Not Available", errors: string[]) {
  if (value === "Not Available") {
    return;
  }

  if (!Number.isInteger(value) || value < 0 || value > 99) {
    errors.push(`${label} must be an integer between 0 and 99`);
  }
}

function validatePrestige(value: number, errors: string[]) {
  if (typeof value !== "number" || value < 1 || value > 5) {
    errors.push("teamPrestige must be between 1 and 5");
  }
}

function validateDynastyPoints(record: ExtractedTeamRecord, errors: string[]) {
  Object.entries(record.dynastyPoints).forEach(([key, value]) => {
    if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
      errors.push(`dynastyPoints.${key} must be non-negative`);
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildTeamDatabase().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
