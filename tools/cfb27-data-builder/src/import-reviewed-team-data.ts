import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  CFB27Team,
  DynastyPoints,
  Grade,
  MySchoolGrades,
  NumericValue
} from "@/types/team";

type ReviewedInputValue<T> = T | "Not Available" | null | undefined;

type ReviewedDynastyPoints = {
  total?: ReviewedInputValue<number>;
  allocated?: ReviewedInputValue<number>;
  used?: ReviewedInputValue<number>;
  available?: ReviewedInputValue<number>;
};

type ReviewedTeamRecord = {
  id?: ReviewedInputValue<string>;
  school?: ReviewedInputValue<string>;
  mascot?: ReviewedInputValue<string>;
  shortName?: ReviewedInputValue<string>;
  conference?: ReviewedInputValue<string>;
  teamPrestige?: ReviewedInputValue<number>;
  overall?: ReviewedInputValue<number>;
  offense?: ReviewedInputValue<number>;
  defense?: ReviewedInputValue<number>;
  dynastyPoints?: ReviewedDynastyPoints;
  mySchoolGrades?: Partial<Record<keyof MySchoolGrades, ReviewedInputValue<Grade>>>;
  sourceFile?: ReviewedInputValue<string>;
  extractionMethod?: "vision-reviewed";
  verified?: boolean;
};

type ReviewedInputFile = {
  generatedAt?: string | null;
  extractionMethod?: "vision-reviewed";
  records: ReviewedTeamRecord[];
};

type ImportIssue = {
  id: string;
  school: string;
  sourceFile: string;
  issue: string;
};

const builderRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = dirname(dirname(builderRoot));
const outputDir = join(builderRoot, "output");
const reviewedInputFile = join(outputDir, "cfb27-teams.vision-reviewed.json");
const databaseFile = join(repoRoot, "database/teams/cfb27-teams.ts");
const importReportFile = join(repoRoot, "database/import-report.md");
const notAvailable = "Not Available" as const;

const gradeValues = new Set<Grade>([
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
  notAvailable
]);

const mySchoolGradeKeys: Array<keyof MySchoolGrades> = [
  "academicPrestige",
  "athleticFacilities",
  "brandExposure",
  "campusLifestyle",
  "championshipContender",
  "coachPrestige",
  "coachStability",
  "conferencePrestige",
  "playingStyle",
  "playingTime",
  "proximityToHome",
  "programTradition",
  "stadiumAtmosphere",
  "proPotential"
];

export async function importReviewedTeamData() {
  const input = await readReviewedInput();
  const records = normalizeReviewedRecords(input.records);
  const validationErrors = validateRecords(records);
  const issues = buildImportIssues(records, validationErrors);

  if (records.length === 0) {
    throw new Error(
      "No reviewed team records found. Add records to cfb27-teams.vision-reviewed.json before importing."
    );
  }

  if (validationErrors.length > 0) {
    await writeFile(
      importReportFile,
      generateImportReport({
        records,
        issues,
        validationErrors,
        successfulImports: []
      }),
      "utf8"
    );

    throw new Error(`Reviewed team import failed with ${validationErrors.length} validation errors.`);
  }

  await writeFile(databaseFile, generateDatabaseFile(records), "utf8");
  await writeFile(
    importReportFile,
    generateImportReport({
      records,
      issues,
      validationErrors,
      successfulImports: records.map((record) => record.school)
    }),
    "utf8"
  );

  return {
    imported: records.length,
    flagged: issues.length,
    validationErrors: validationErrors.length
  };
}

async function readReviewedInput() {
  const contents = await readFile(reviewedInputFile, "utf8");
  const parsed = JSON.parse(contents) as ReviewedInputFile;

  if (!Array.isArray(parsed.records)) {
    throw new Error("cfb27-teams.vision-reviewed.json must include a records array.");
  }

  return parsed;
}

function normalizeReviewedRecords(records: ReviewedTeamRecord[]) {
  return ensureUniqueTeamIds(records.map(normalizeReviewedRecord));
}

function normalizeReviewedRecord(record: ReviewedTeamRecord): CFB27Team {
  const school = normalizeText(record.school);
  const idSource = normalizeOptionalText(record.id) ?? school;
  const shortName = normalizeOptionalText(record.shortName) ?? school;
  const dynastyPoints = normalizeDynastyPoints(record.dynastyPoints);

  return {
    id: normalizeId(idSource),
    school,
    mascot: normalizeText(record.mascot),
    shortName,
    conference: normalizeText(record.conference),
    teamPrestige: normalizePrestige(record.teamPrestige),
    overall: normalizeRating(record.overall),
    offense: normalizeRating(record.offense),
    defense: normalizeRating(record.defense),
    dynastyPoints,
    mySchoolGrades: normalizeMySchoolGrades(record.mySchoolGrades),
    sourceFile: normalizeText(record.sourceFile),
    extractionMethod: "vision-reviewed",
    verified: record.verified === true
  };
}

function normalizeText(value: ReviewedInputValue<string>) {
  return normalizeOptionalText(value) ?? notAvailable;
}

function normalizeOptionalText(value: ReviewedInputValue<string>) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length > 0 && trimmed !== notAvailable ? trimmed : null;
}

function normalizeId(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "not-available";
}

function ensureUniqueTeamIds(records: CFB27Team[]) {
  const seenIds = new Map<string, number>();

  return records.map((record) => {
    const currentCount = seenIds.get(record.id) ?? 0;
    seenIds.set(record.id, currentCount + 1);

    if (currentCount === 0) {
      return record;
    }

    return {
      ...record,
      id: `${record.id}-${currentCount + 1}`
    };
  });
}

function normalizePrestige(value: ReviewedInputValue<number>) {
  return typeof value === "number" ? value : 0;
}

function normalizeRating(value: ReviewedInputValue<number>): NumericValue {
  if (typeof value !== "number") {
    return notAvailable;
  }

  return value;
}

function normalizeDynastyPoints(points: ReviewedDynastyPoints = {}): DynastyPoints {
  const normalized = {
    total: normalizePoint(points.total),
    allocated: normalizePoint(points.allocated),
    used: normalizePoint(points.used),
    available: normalizePoint(points.available)
  } satisfies DynastyPoints;

  if (normalized.available !== notAvailable) {
    return normalized;
  }

  if (
    typeof normalized.total === "number" &&
    typeof normalized.allocated === "number" &&
    typeof normalized.used === "number"
  ) {
    return {
      ...normalized,
      available: Math.max(0, normalized.total - normalized.allocated - normalized.used)
    };
  }

  return normalized;
}

function normalizePoint(value: ReviewedInputValue<number>): NumericValue {
  return typeof value === "number" ? value : notAvailable;
}

function normalizeMySchoolGrades(
  grades: ReviewedTeamRecord["mySchoolGrades"] = {}
): MySchoolGrades {
  return Object.fromEntries(
    mySchoolGradeKeys.map((key) => [key, normalizeGrade(grades[key])])
  ) as MySchoolGrades;
}

function normalizeGrade(value: ReviewedInputValue<Grade>): Grade {
  return typeof value === "string" && gradeValues.has(value as Grade)
    ? (value as Grade)
    : notAvailable;
}

function validateRecords(records: CFB27Team[]) {
  const errors: string[] = [];
  const ids = new Set<string>();

  records.forEach((record) => {
    if (ids.has(record.id)) {
      errors.push(`${record.id}: duplicate id`);
    }

    ids.add(record.id);
    validateRequiredText(record, "id", errors);
    validateRequiredText(record, "school", errors);
    validateRequiredText(record, "shortName", errors);
    validateRequiredText(record, "mascot", errors);
    validateRequiredText(record, "conference", errors);
    validatePrestige(record, errors);
    validateRating(record, "overall", errors);
    validateRating(record, "offense", errors);
    validateRating(record, "defense", errors);
    validateDynastyPoints(record, errors);
    validateMySchoolGrades(record, errors);
  });

  return errors;
}

function validateRequiredText(
  record: CFB27Team,
  field: "id" | "school" | "shortName" | "mascot" | "conference",
  errors: string[]
) {
  if (!record[field] || record[field].trim().length === 0) {
    errors.push(`${record.id}: missing ${field}`);
  }
}

function validatePrestige(record: CFB27Team, errors: string[]) {
  if (!Number.isInteger(record.teamPrestige) || record.teamPrestige < 1 || record.teamPrestige > 5) {
    errors.push(`${record.id}: teamPrestige must be between 1 and 5`);
  }
}

function validateRating(
  record: CFB27Team,
  field: "overall" | "offense" | "defense",
  errors: string[]
) {
  const value = record[field];

  if (value === notAvailable) {
    return;
  }

  if (!Number.isInteger(value) || value < 0 || value > 99) {
    errors.push(`${record.id}: ${field} must be an integer between 0 and 99`);
  }
}

function validateDynastyPoints(record: CFB27Team, errors: string[]) {
  Object.entries(record.dynastyPoints).forEach(([key, value]) => {
    if (value === notAvailable || value === undefined) {
      return;
    }

    if (!Number.isFinite(value) || value < 0) {
      errors.push(`${record.id}: dynastyPoints.${key} must be non-negative`);
    }
  });
}

function validateMySchoolGrades(record: CFB27Team, errors: string[]) {
  mySchoolGradeKeys.forEach((key) => {
    if (!gradeValues.has(record.mySchoolGrades[key])) {
      errors.push(`${record.id}: mySchoolGrades.${key} must be a supported grade`);
    }
  });
}

function buildImportIssues(records: CFB27Team[], validationErrors: string[]) {
  const issues: ImportIssue[] = [];

  records.forEach((record) => {
    if (!record.verified) {
      issues.push({
        id: record.id,
        school: record.school,
        sourceFile: record.sourceFile ?? notAvailable,
        issue: "Record imported from vision-reviewed path but is not marked verified."
      });
    }

    if (hasNotAvailableValues(record)) {
      issues.push({
        id: record.id,
        school: record.school,
        sourceFile: record.sourceFile ?? notAvailable,
        issue: "Record contains Not Available values that need future review."
      });
    }
  });

  validationErrors.forEach((error) => {
    issues.push({
      id: "validation",
      school: "Validation",
      sourceFile: reviewedInputFile,
      issue: error
    });
  });

  return issues;
}

function hasNotAvailableValues(record: CFB27Team) {
  return (
    record.mascot === notAvailable ||
    record.shortName === notAvailable ||
    record.conference === notAvailable ||
    record.overall === notAvailable ||
    record.offense === notAvailable ||
    record.defense === notAvailable ||
    Object.values(record.dynastyPoints).some((value) => value === notAvailable) ||
    Object.values(record.mySchoolGrades).some((value) => value === notAvailable)
  );
}

function generateDatabaseFile(records: CFB27Team[]) {
  return `import type { CFB27Team } from "@/types/team";

/*
 * CFB27 Master Team Database
 *
 * This file stores verified facts only. Unknown screenshot values are marked
 * "Not Available" until Vision extraction or human review confirms the data.
 * Do not add recommendations, AI output, user dynasty data, roster progression,
 * or recruiting data here.
 */
export const cfb27TeamRecords = ${JSON.stringify(records, null, 2)} satisfies CFB27Team[];
`;
}

function generateImportReport(input: {
  records: CFB27Team[];
  issues: ImportIssue[];
  validationErrors: string[];
  successfulImports: string[];
}) {
  return `# CFB27 Master Team Database Import Report

Generated from:

- ${relative(repoRoot, reviewedInputFile)}

## Summary

- Import Method: vision-reviewed
- Total Teams Imported: ${input.records.length}
- Total Teams Flagged: ${input.issues.length}
- Missing Teams: 0
- Validation Errors: ${input.validationErrors.length}
- Successful Imports: ${input.successfulImports.length}

## Validation Errors

${input.validationErrors.length > 0 ? input.validationErrors.map((error) => `- ${error}`).join("\n") : "- None"}

## Teams Needing Review

${input.issues.length > 0 ? input.issues.map((issue) => `- ${issue.school} (${issue.id}): ${issue.issue}`).join("\n") : "- None"}

## Missing Teams

- None reported by source data

## Successful Imports

${input.successfulImports.length > 0 ? input.successfulImports.map((team) => `- ${team}`).join("\n") : "- None"}

## Review Notes

This report was generated from externally reviewed Vision data. Missing values remain "Not Available"; the importer does not invent facts.
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  importReviewedTeamData()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
