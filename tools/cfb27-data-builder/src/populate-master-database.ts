import { readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { CFB27Team, Grade, NumericValue } from "@/types/team";
import type { RawExtractedTeamRecord, ReviewItem } from "./types";

type RawOutput = {
  records: RawExtractedTeamRecord[];
  validation: {
    valid: boolean;
    errors: string[];
  };
};

type ReviewOutput = {
  items: ReviewItem[];
};

const builderRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = dirname(dirname(builderRoot));
const outputDir = join(builderRoot, "output");
const databaseFile = join(repoRoot, "database/teams/cfb27-teams.ts");
const importReportFile = join(repoRoot, "database/import-report.md");

export async function populateMasterDatabase() {
  const rawOutput = await readJson<RawOutput>("cfb27-teams.raw.json");
  const reviewOutput = await readJson<ReviewOutput>("cfb27-teams.needs-review.json");
  const records = rawOutput.records.map(toTrustedRecord);
  const validationErrors = validateTrustedRecords(records);
  const flaggedIds = new Set(reviewOutput.items.map((item) => item.id));

  await writeFile(databaseFile, generateDatabaseFile(records), "utf8");
  await writeFile(
    importReportFile,
    generateImportReport({
      totalTeamsImported: records.length,
      totalTeamsFlagged: flaggedIds.size,
      missingTeams: [],
      validationErrors,
      successfulImports: records.map((record) => record.school)
    }),
    "utf8"
  );

  return {
    records,
    validationErrors,
    flaggedCount: flaggedIds.size
  };
}

async function readJson<T>(fileName: string): Promise<T> {
  const contents = await readFile(join(outputDir, fileName), "utf8");
  return JSON.parse(contents) as T;
}

function toTrustedRecord(record: RawExtractedTeamRecord): CFB27Team {
  return {
    id: record.id,
    school: record.school,
    mascot: trustString(record, "mascot", record.mascot),
    shortName: record.shortName,
    conference: trustString(record, "conference", record.conference),
    teamPrestige: record.teamPrestige,
    overall: trustNumber(record, "overall", record.overall),
    offense: trustNumber(record, "offense", record.offense),
    defense: trustNumber(record, "defense", record.defense),
    dynastyPoints: {
      total: trustPoint(record, "total", record.dynastyPoints.total),
      allocated: trustPoint(record, "allocated", record.dynastyPoints.allocated),
      used: trustPoint(record, "used", record.dynastyPoints.used),
      available: trustPoint(record, "available", record.dynastyPoints.available)
    },
    mySchoolGrades: {
      academicPrestige: trustGrade(record.mySchoolGrades.academicPrestige),
      athleticFacilities: trustGrade(record.mySchoolGrades.athleticFacilities),
      brandExposure: trustGrade(record.mySchoolGrades.brandExposure),
      campusLifestyle: trustGrade(record.mySchoolGrades.campusLifestyle),
      championshipContender: trustGrade(record.mySchoolGrades.championshipContender),
      coachPrestige: trustGrade(record.mySchoolGrades.coachPrestige),
      coachStability: trustGrade(record.mySchoolGrades.coachStability),
      conferencePrestige: trustGrade(record.mySchoolGrades.conferencePrestige),
      playingStyle: trustGrade(record.mySchoolGrades.playingStyle),
      playingTime: trustGrade(record.mySchoolGrades.playingTime),
      proximityToHome: trustGrade(record.mySchoolGrades.proximityToHome),
      programTradition: trustGrade(record.mySchoolGrades.programTradition),
      stadiumAtmosphere: trustGrade(record.mySchoolGrades.stadiumAtmosphere),
      proPotential: trustGrade(record.mySchoolGrades.proPotential)
    }
  };
}

function trustString(
  record: RawExtractedTeamRecord,
  field: string,
  value: string
) {
  return hasIssue(record, field) ? "Not Available" : value;
}

function trustNumber(
  record: RawExtractedTeamRecord,
  field: string,
  value: number | "Not Available"
): NumericValue {
  if (value === "Not Available") {
    return "Not Available";
  }

  return hasIssue(record, field) ? "Not Available" : value;
}

function trustPoint(
  record: RawExtractedTeamRecord,
  field: string,
  value: number | undefined
): NumericValue {
  if (record.issues.some((issue) => issue.field === "sourceText")) {
    return "Not Available";
  }

  return typeof value === "number" ? value : "Not Available";
}

function trustGrade(value: Grade): Grade {
  return value;
}

function hasIssue(record: RawExtractedTeamRecord, field: string) {
  return record.issues.some((issue) => issue.field === field);
}

function validateTrustedRecords(records: CFB27Team[]) {
  const errors: string[] = [];
  const ids = new Set<string>();

  records.forEach((record) => {
    if (ids.has(record.id)) {
      errors.push(`${record.id}: duplicate id`);
    }

    ids.add(record.id);
    validateRequired(record, errors);
    validateRating(record, "overall", errors);
    validateRating(record, "offense", errors);
    validateRating(record, "defense", errors);
    validatePrestige(record, errors);
    validateDynastyPoints(record, errors);
  });

  return errors;
}

function validateRequired(record: CFB27Team, errors: string[]) {
  const requiredFields: Array<keyof CFB27Team> = [
    "id",
    "school",
    "shortName",
    "mascot",
    "conference",
    "teamPrestige",
    "overall",
    "offense",
    "defense",
    "dynastyPoints",
    "mySchoolGrades"
  ];

  requiredFields.forEach((field) => {
    if (record[field] === undefined || record[field] === null || record[field] === "") {
      errors.push(`${record.id}: missing ${field}`);
    }
  });
}

function validateRating(
  record: CFB27Team,
  field: "overall" | "offense" | "defense",
  errors: string[]
) {
  const value = record[field];

  if (value === "Not Available") {
    return;
  }

  if (!Number.isInteger(value) || value < 0 || value > 99) {
    errors.push(`${record.id}: ${field} must be between 0 and 99`);
  }
}

function validatePrestige(record: CFB27Team, errors: string[]) {
  if (record.teamPrestige < 1 || record.teamPrestige > 5) {
    errors.push(`${record.id}: teamPrestige must be between 1 and 5`);
  }
}

function validateDynastyPoints(record: CFB27Team, errors: string[]) {
  Object.entries(record.dynastyPoints).forEach(([key, value]) => {
    if (value === "Not Available" || value === undefined) {
      return;
    }

    if (!Number.isFinite(value) || value < 0) {
      errors.push(`${record.id}: dynastyPoints.${key} must be non-negative`);
    }
  });
}

function generateDatabaseFile(records: CFB27Team[]) {
  return `import type { CFB27Team } from "@/types/team";

/*
 * CFB27 Master Team Database
 *
 * This file stores verified facts only. Unknown screenshot values are marked
 * "Not Available" until OCR or human review confirms the data.
 * Do not add recommendations, AI output, user dynasty data, roster progression,
 * or recruiting data here.
 */
export const cfb27TeamRecords = ${JSON.stringify(records, null, 2)} satisfies CFB27Team[];
`;
}

function generateImportReport(input: {
  totalTeamsImported: number;
  totalTeamsFlagged: number;
  missingTeams: string[];
  validationErrors: string[];
  successfulImports: string[];
}) {
  return `# CFB27 Master Team Database Import Report

Generated from:

- ${relative(repoRoot, join(outputDir, "cfb27-teams.raw.json"))}
- ${relative(repoRoot, join(outputDir, "cfb27-teams.needs-review.json"))}

## Summary

- Total Teams Imported: ${input.totalTeamsImported}
- Total Teams Flagged: ${input.totalTeamsFlagged}
- Missing Teams: ${input.missingTeams.length}
- Validation Errors: ${input.validationErrors.length}
- Successful Imports: ${input.successfulImports.length}

## Validation Errors

${input.validationErrors.length > 0 ? input.validationErrors.map((error) => `- ${error}`).join("\n") : "- None"}

## Missing Teams

${input.missingTeams.length > 0 ? input.missingTeams.map((team) => `- ${team}`).join("\n") : "- None reported by source data"}

## Successful Imports

${input.successfulImports.map((team) => `- ${team}`).join("\n")}

## Review Notes

Imported records remain flagged for human review when their OCR transcripts are missing, incomplete, or generated from fallback failure sidecars. Known facts from file organization were imported, including school identifier, school display name, short name, and team prestige. Uncertain values were set to "Not Available".
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  populateMasterDatabase()
    .then((result) => {
      console.log(
        JSON.stringify(
          {
            imported: result.records.length,
            flagged: result.flaggedCount,
            validationErrors: result.validationErrors.length
          },
          null,
          2
        )
      );
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
