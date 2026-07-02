import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Grade, MySchoolGrades } from "@/types/team";

type ReviewedTeamRecord = {
  id: string;
  school: string;
  conference: string;
  teamPrestige: number;
  overall: number | "Not Available";
  offense: number | "Not Available";
  defense: number | "Not Available";
  dynastyPoints: {
    total?: number | "Not Available";
    allocated?: number | "Not Available";
    used?: number | "Not Available";
    available?: number | "Not Available";
  };
  mySchoolGrades: Partial<Record<keyof MySchoolGrades, Grade>>;
  sourceFile: string;
  verified: boolean;
};

type ReviewedFile = {
  generatedAt: string;
  records: ReviewedTeamRecord[];
};

type DiagnosticsFile = {
  tierSummary: Array<{
    prestigeTier: string;
    teamsProcessed: number;
    successfulFields: number;
    failedFields: number;
    teamsNeedingReview: number;
    commonMissingFields: Record<string, number>;
  }>;
};

const builderRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDir = join(builderRoot, "output");
const visionReviewedFile = join(outputDir, "cfb27-teams.vision-reviewed.json");
const diagnosticsFile = join(outputDir, "extraction-diagnostics.json");
const completionReportFile = join(outputDir, "human-review-completion-report.md");
const reviewQueueFile = join(outputDir, "human-review-queue.json");
const notAvailable = "Not Available" as const;

const reviewPriority = [3, 2, 1, 5, 4];

const gradeFields: Array<keyof MySchoolGrades> = [
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

export async function generateHumanReviewReport() {
  const reviewed = await readJson<ReviewedFile>(visionReviewedFile);
  const diagnostics = await readJson<DiagnosticsFile>(diagnosticsFile);
  const records = reviewed.records;
  const verifiedTeams = records.filter((record) => record.verified);
  const remainingTeams = records.filter((record) => !record.verified).sort(sortByReviewPriority);
  const incompleteDynastyPoints = records.filter(hasIncompleteDynastyPoints);
  const incompleteGrades = records.filter(hasIncompleteGrades);
  const missingFieldCounts = countMissingFields(records);
  const queue = {
    generatedAt: new Date().toISOString(),
    priorityOrder: ["3 Star", "2 Star", "1 Star", "5 Star", "4 Star"],
    remainingTeams: remainingTeams.map((record) => ({
      id: record.id,
      school: record.school,
      teamPrestige: record.teamPrestige,
      sourceFile: record.sourceFile,
      missingFields: listMissingFields(record)
    }))
  };

  await writeFile(reviewQueueFile, `${JSON.stringify(queue, null, 2)}\n`, "utf8");
  await writeFile(
    completionReportFile,
    renderReport({
      generatedAt: queue.generatedAt,
      records,
      verifiedTeams,
      remainingTeams,
      incompleteDynastyPoints,
      incompleteGrades,
      missingFieldCounts,
      diagnostics
    }),
    "utf8"
  );

  return {
    totalTeams: records.length,
    verifiedTeams: verifiedTeams.length,
    remainingTeams: remainingTeams.length,
    incompleteDynastyPoints: incompleteDynastyPoints.length,
    incompleteGrades: incompleteGrades.length
  };
}

async function readJson<T>(filePath: string) {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

function sortByReviewPriority(a: ReviewedTeamRecord, b: ReviewedTeamRecord) {
  const prestigeA = reviewPriority.indexOf(a.teamPrestige);
  const prestigeB = reviewPriority.indexOf(b.teamPrestige);

  if (prestigeA !== prestigeB) {
    return prestigeA - prestigeB;
  }

  return a.school.localeCompare(b.school);
}

function hasIncompleteDynastyPoints(record: ReviewedTeamRecord) {
  return ["total", "used", "available"].some((field) => {
    const value = record.dynastyPoints[field as keyof ReviewedTeamRecord["dynastyPoints"]];
    return value === undefined || value === notAvailable;
  });
}

function hasIncompleteGrades(record: ReviewedTeamRecord) {
  return gradeFields.some((field) => record.mySchoolGrades[field] === undefined);
}

function countMissingFields(records: ReviewedTeamRecord[]) {
  const counts: Record<string, number> = {};

  records.forEach((record) => {
    listMissingFields(record).forEach((field) => {
      counts[field] = (counts[field] ?? 0) + 1;
    });
  });

  return Object.entries(counts).sort(([, countA], [, countB]) => countB - countA);
}

function listMissingFields(record: ReviewedTeamRecord) {
  const fields: string[] = [];

  [
    ["conference", record.conference],
    ["overall", record.overall],
    ["offense", record.offense],
    ["defense", record.defense],
    ["dynastyPoints.total", record.dynastyPoints.total],
    ["dynastyPoints.used", record.dynastyPoints.used],
    ["dynastyPoints.available", record.dynastyPoints.available]
  ].forEach(([field, value]) => {
    if (value === undefined || value === notAvailable) {
      fields.push(String(field));
    }
  });

  gradeFields.forEach((field) => {
    if (record.mySchoolGrades[field] === undefined) {
      fields.push(`mySchoolGrades.${field}`);
    }
  });

  return fields;
}

function renderReport(input: {
  generatedAt: string;
  records: ReviewedTeamRecord[];
  verifiedTeams: ReviewedTeamRecord[];
  remainingTeams: ReviewedTeamRecord[];
  incompleteDynastyPoints: ReviewedTeamRecord[];
  incompleteGrades: ReviewedTeamRecord[];
  missingFieldCounts: Array<[string, number]>;
  diagnostics: DiagnosticsFile;
}) {
  const verifiedByTier = groupCount(input.verifiedTeams);
  const remainingByTier = groupCount(input.remainingTeams);

  return `# CFB27 Human Review Completion Report

Generated: ${input.generatedAt}

## Summary

- Total Teams: ${input.records.length}
- Verified Teams: ${input.verifiedTeams.length}
- Remaining Teams Needing Review: ${input.remainingTeams.length}
- Teams with Incomplete Dynasty Points: ${input.incompleteDynastyPoints.length}
- Teams with Incomplete My School Grades: ${input.incompleteGrades.length}

## Verified Teams by Prestige

${renderTierCounts(verifiedByTier)}

## Remaining Teams by Prestige

${renderTierCounts(remainingByTier)}

## Review Priority

1. 3 Star
2. 2 Star
3. 1 Star

## Fields Most Often Missing

${input.missingFieldCounts
  .slice(0, 16)
  .map(([field, count]) => `- ${field}: ${count}`)
  .join("\n")}

## Teams with Incomplete Dynasty Points

${renderTeamList(input.incompleteDynastyPoints)}

## Teams with Incomplete My School Grades

${renderTeamList(input.incompleteGrades)}

## Extraction Diagnostics by Prestige

${input.diagnostics.tierSummary
  .map(
    (tier) =>
      `- ${tier.prestigeTier}: ${tier.teamsProcessed} processed, ${tier.successfulFields} successful fields, ${tier.failedFields} failed fields, ${tier.teamsNeedingReview} needing review`
  )
  .join("\n")}

## Human Review Rule

Only mark a team verified when school, conference, prestige, ratings, visible Dynasty Points, and visible My School Grades have been confirmed from the screenshot. Keep hidden or unclear values as "Not Available".
`;
}

function groupCount(records: ReviewedTeamRecord[]) {
  return records.reduce<Record<string, number>>((counts, record) => {
    const tier = `${record.teamPrestige} Star`;
    counts[tier] = (counts[tier] ?? 0) + 1;
    return counts;
  }, {});
}

function renderTierCounts(counts: Record<string, number>) {
  return ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"]
    .map((tier) => `- ${tier}: ${counts[tier] ?? 0}`)
    .join("\n");
}

function renderTeamList(records: ReviewedTeamRecord[]) {
  if (records.length === 0) {
    return "- None";
  }

  return records
    .sort(sortByReviewPriority)
    .map((record) => `- ${record.school} (${record.teamPrestige} Star)`)
    .join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateHumanReviewReport()
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
