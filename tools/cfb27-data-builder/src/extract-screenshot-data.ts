import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { Grade } from "@/types/team";
import type {
  BuilderDynastyPoints,
  BuilderMySchoolGrades,
  FieldConfidence,
  RawExtractedTeamRecord,
  ReviewItem
} from "./types";

type ScreenshotInput = {
  absolutePath: string;
  relativePath: string;
  fileName: string;
  prestige: number;
};

type ExtractionMode = "apple-vision" | "tesseract" | "vision-json" | "manual-reviewed";

type ExtractionOptions = {
  mode: ExtractionMode;
  prestigeFilter?: number;
};

type StructuredTeamRecord = {
  id?: string;
  school?: string;
  mascot?: string;
  shortName?: string;
  conference?: string;
  teamPrestige?: number;
  overall?: number | "Not Available";
  offense?: number | "Not Available";
  defense?: number | "Not Available";
  dynastyPoints?: BuilderDynastyPoints;
  mySchoolGrades?: Partial<BuilderMySchoolGrades>;
  sourceFile?: string;
  verified?: boolean;
};

type ExtractionSource = {
  methodUsed: ExtractionMode | "sidecar";
  text: string;
  structuredRecord?: StructuredTeamRecord;
  sourceNote?: string;
};

type ExtractionDiagnostic = {
  sourceFile: string;
  school: string;
  requestedMode: ExtractionMode;
  methodUsed: ExtractionSource["methodUsed"];
  successfulFields: string[];
  failedFields: string[];
  confidence: number;
  sourceNote?: string;
};

type ExtractionOutput = {
  generatedAt: string;
  extractionMode: ExtractionMode;
  records: RawExtractedTeamRecord[];
  validation: {
    valid: boolean;
    errors: string[];
  };
};

const builderRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const inputDir = join(builderRoot, "input");
const outputDir = join(builderRoot, "output");
const visionReviewedFile = join(outputDir, "cfb27-teams.vision-reviewed.json");
const manualReviewedFile = join(outputDir, "cfb27-teams.manual-reviewed.json");

const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".heic"]);
const textExtensions = [".manual.txt", ".tesseract.txt", ".ocr.txt", ".txt"];
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
  "Not Available"
]);

const gradeLabels: Array<[keyof BuilderMySchoolGrades, string[]]> = [
  ["academicPrestige", ["Academic Prestige"]],
  ["athleticFacilities", ["Athletic Facilities", "Facilities"]],
  ["brandExposure", ["Brand Exposure"]],
  ["campusLifestyle", ["Campus Lifestyle"]],
  ["championshipContender", ["Championship Contender"]],
  ["coachPrestige", ["Coach Prestige"]],
  ["coachStability", ["Coach Stability"]],
  ["conferencePrestige", ["Conference Prestige"]],
  ["playingStyle", ["Playing Style"]],
  ["playingTime", ["Playing Time"]],
  ["proximityToHome", ["Proximity To Home", "Proximity to Home"]],
  ["programTradition", ["Program Tradition"]],
  ["stadiumAtmosphere", ["Stadium Atmosphere"]],
  ["proPotential", ["Pro Potential"]]
];

const ratingLabels = {
  overall: ["Overall", "OVR"],
  offense: ["Offense", "OFF"],
  defense: ["Defense", "DEF"]
} as const;

export async function extractScreenshotData(options = parseExtractionOptions()) {
  const screenshots = await findScreenshots(inputDir, options.prestigeFilter);
  const structuredRecords = await readStructuredRecords(options.mode);
  const extractedRecords = await Promise.all(
    screenshots.map((screenshot) => extractRecord(screenshot, options, structuredRecords))
  );
  const records = ensureUniqueTeamIds(extractedRecords);
  const validation = validateRecords(records);
  const reviewItems = buildReviewItems(records, validation.errors);
  const diagnostics = records.map((record) => buildDiagnostic(record, options.mode));

  await writeJson("cfb27-teams.raw.json", {
    generatedAt: new Date().toISOString(),
    extractionMode: options.mode,
    records,
    validation
  } satisfies ExtractionOutput);

  await writeJson("cfb27-teams.needs-review.json", {
    generatedAt: new Date().toISOString(),
    items: reviewItems
  });

  await writeFile(
    join(outputDir, "cfb27-teams.generated.ts"),
    generateTypeScriptDatabase(records),
    "utf8"
  );

  await writeJson("extraction-diagnostics.json", {
    generatedAt: new Date().toISOString(),
    extractionMode: options.mode,
    prestigeFilter: options.prestigeFilter ?? "all",
    totalScreenshots: screenshots.length,
    tierSummary: buildTierSummary(diagnostics),
    diagnostics
  });

  return {
    records,
    reviewItems,
    validation,
    diagnostics
  };
}

function ensureUniqueTeamIds(records: RawExtractedTeamRecord[]) {
  const seenIds = new Map<string, number>();

  return records.map((record) => {
    const currentCount = seenIds.get(record.id) ?? 0;
    seenIds.set(record.id, currentCount + 1);

    if (currentCount === 0) {
      return record;
    }

    const uniqueId = `${record.id}-${currentCount + 1}`;

    return {
      ...record,
      id: uniqueId,
      issues: [
        ...record.issues,
        {
          field: "id",
          confidence: 0.5,
          issue: `Duplicate normalized team id detected. Generated temporary unique id: ${uniqueId}.`,
          sourceFile: record.sourceFile
        }
      ]
    };
  });
}

async function findScreenshots(
  root: string,
  prestigeFilter?: number
): Promise<ScreenshotInput[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const screenshots: ScreenshotInput[] = [];

  for (const entry of entries) {
    const absolutePath = join(root, entry.name);

    if (!entry.isDirectory()) {
      continue;
    }

    const prestige = parsePrestigeFolder(entry.name);

    if (!prestige) {
      continue;
    }

    if (prestigeFilter && prestige !== prestigeFilter) {
      continue;
    }

    const files = await readdir(absolutePath, { withFileTypes: true });

    files.forEach((file) => {
      if (!file.isFile() || !imageExtensions.has(extname(file.name).toLowerCase())) {
        return;
      }

      const imagePath = join(absolutePath, file.name);

      screenshots.push({
        absolutePath: imagePath,
        relativePath: relative(builderRoot, imagePath),
        fileName: file.name,
        prestige
      });
    });
  }

  return screenshots;
}

function parsePrestigeFolder(folderName: string) {
  const match = folderName.match(/^([1-5])\s*Star$/i);
  return match ? Number(match[1]) : null;
}

async function extractRecord(
  input: ScreenshotInput,
  options: ExtractionOptions,
  structuredRecords: StructuredTeamRecord[]
): Promise<RawExtractedTeamRecord> {
  const source = await readExtractionSource(input, options.mode, structuredRecords);
  const text = source.text;
  const structuredRecord = source.structuredRecord;
  const school =
    normalizeStructuredText(structuredRecord?.school) ??
    extractTextValue(text, ["School", "Team"]) ??
    schoolFromFileName(input.fileName);
  const mascot =
    normalizeStructuredText(structuredRecord?.mascot) ??
    extractTextValue(text, ["Mascot"]) ??
    "Not Available";
  const conference =
    normalizeStructuredText(structuredRecord?.conference) ??
    extractTextValue(text, ["Conference"]) ??
    "Not Available";
  const overall = normalizeStructuredRating(structuredRecord?.overall) ?? extractRating(text, ratingLabels.overall);
  const offense = normalizeStructuredRating(structuredRecord?.offense) ?? extractRating(text, ratingLabels.offense);
  const defense = normalizeStructuredRating(structuredRecord?.defense) ?? extractRating(text, ratingLabels.defense);
  const dynastyPoints = mergeDynastyPoints(
    extractDynastyPoints(text),
    structuredRecord?.dynastyPoints
  );
  const mySchoolGrades = mergeMySchoolGrades(
    extractMySchoolGrades(text),
    structuredRecord?.mySchoolGrades
  );

  const issues = buildFieldIssues({
    input,
    methodUsed: source.methodUsed,
    text,
    school,
    mascot,
    conference,
    overall,
    offense,
    defense,
    dynastyPoints,
    mySchoolGrades
  });

  return {
    id: normalizeSchoolId(school),
    school,
    mascot,
    shortName:
      normalizeStructuredText(structuredRecord?.shortName) ??
      extractTextValue(text, ["Short Name", "Abbreviation"]) ??
      school,
    conference,
    teamPrestige: structuredRecord?.teamPrestige ?? input.prestige,
    overall: overall ?? "Not Available",
    offense: offense ?? "Not Available",
    defense: defense ?? "Not Available",
    dynastyPoints: {
      ...dynastyPoints,
      available: calculateAvailableDynastyPoints(dynastyPoints)
    },
    mySchoolGrades,
    sourceFile: input.relativePath,
    confidence: calculateRecordConfidence(issues),
    issues: [
      ...issues,
      {
        field: "extractionMethod",
        confidence: source.structuredRecord || text.trim() ? 1 : 0.25,
        issue: `OCR method used: ${source.methodUsed}.`,
        sourceFile: input.relativePath
      }
    ]
  };
}

async function readExtractionSource(
  input: ScreenshotInput,
  mode: ExtractionMode,
  structuredRecords: StructuredTeamRecord[]
): Promise<ExtractionSource> {
  if (mode === "vision-json" || mode === "manual-reviewed") {
    const structuredRecord = findStructuredRecord(input, structuredRecords);

    if (structuredRecord) {
      return {
        methodUsed: mode,
        text: structuredRecordToTranscript(structuredRecord),
        structuredRecord,
        sourceNote: `${mode} record matched by source file, id, or school name.`
      };
    }
  }

  if (mode === "tesseract") {
    const tesseractText = await runTesseract(input.absolutePath);

    if (tesseractText.trim()) {
      await writeFile(
        input.absolutePath.replace(extname(input.absolutePath), ".tesseract.txt"),
        tesseractText,
        "utf8"
      );

      return {
        methodUsed: "tesseract",
        text: tesseractText,
        sourceNote: "Generated with local Tesseract OCR."
      };
    }
  }

  return {
    methodUsed: "sidecar",
    text: await readSidecarText(input.absolutePath),
    sourceNote:
      mode === "tesseract"
        ? "Tesseract unavailable or returned no text; existing sidecar was used."
        : "Existing sidecar transcript was used."
  };
}

async function runTesseract(imagePath: string) {
  if (!(await commandExists("tesseract"))) {
    return "";
  }

  return new Promise<string>((resolve) => {
    const child = spawn("tesseract", [imagePath, "stdout", "--psm", "6"]);
    const stdoutChunks: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer) => stdoutChunks.push(chunk));
    child.on("error", () => resolve(""));
    child.on("close", (code) => {
      resolve(code === 0 ? Buffer.concat(stdoutChunks).toString("utf8") : "");
    });
  });
}

async function commandExists(command: string) {
  const pathEntries = (process.env.PATH ?? "").split(":").filter(Boolean);

  for (const pathEntry of pathEntries) {
    try {
      await access(join(pathEntry, command));
      return true;
    } catch {
      // Keep checking the rest of PATH.
    }
  }

  return false;
}

async function readSidecarText(imagePath: string) {
  const sidecarPaths = textExtensions.flatMap((extension) => [
    imagePath.replace(extname(imagePath), extension),
    `${imagePath}${extension}`
  ]);

  for (const sidecarPath of sidecarPaths) {

    try {
      return await readFile(sidecarPath, "utf8");
    } catch {
      // Sidecar transcripts are optional until OCR exists.
    }
  }

  return "";
}

async function readStructuredRecords(mode: ExtractionMode) {
  if (mode === "vision-json") {
    return readStructuredRecordFile(visionReviewedFile);
  }

  if (mode === "manual-reviewed") {
    const manualRecords = await readStructuredRecordFile(manualReviewedFile);

    if (manualRecords.length > 0) {
      return manualRecords;
    }

    return readStructuredRecordFile(visionReviewedFile);
  }

  return [];
}

async function readStructuredRecordFile(filePath: string): Promise<StructuredTeamRecord[]> {
  try {
    const contents = await readFile(filePath, "utf8");
    const parsed = JSON.parse(contents) as { records?: StructuredTeamRecord[] };

    return Array.isArray(parsed.records) ? parsed.records : [];
  } catch {
    return [];
  }
}

function findStructuredRecord(
  input: ScreenshotInput,
  records: StructuredTeamRecord[]
) {
  const fileSchoolId = normalizeSchoolId(schoolFromFileName(input.fileName));

  return records.find((record) => {
    const recordSourceFile = record.sourceFile?.replace(/^tools\/cfb27-data-builder\//, "");
    const normalizedSchool = record.school ? normalizeSchoolId(record.school) : "";
    const normalizedId = record.id ? normalizeSchoolId(record.id) : "";

    return (
      recordSourceFile === input.relativePath ||
      normalizedSchool === fileSchoolId ||
      normalizedId === fileSchoolId
    );
  });
}

function structuredRecordToTranscript(record: StructuredTeamRecord) {
  const lines = [
    `School: ${record.school ?? "Not Available"}`,
    `Mascot: ${record.mascot ?? "Not Available"}`,
    `Short Name: ${record.shortName ?? record.school ?? "Not Available"}`,
    `Conference: ${record.conference ?? "Not Available"}`,
    `Overall: ${record.overall ?? "Not Available"}`,
    `Offense: ${record.offense ?? "Not Available"}`,
    `Defense: ${record.defense ?? "Not Available"}`,
    `Dynasty Points Total: ${record.dynastyPoints?.total ?? "Not Available"}`,
    `Dynasty Points Allocated: ${record.dynastyPoints?.allocated ?? "Not Available"}`,
    `Dynasty Points Used: ${record.dynastyPoints?.used ?? "Not Available"}`,
    `Dynasty Points Available: ${record.dynastyPoints?.available ?? "Not Available"}`
  ];

  Object.entries(record.mySchoolGrades ?? {}).forEach(([field, value]) => {
    lines.push(`${toGradeLabel(field)}: ${value ?? "Not Available"}`);
  });

  return lines.join("\n");
}

function toGradeLabel(field: string) {
  return field.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) =>
    letter.toUpperCase()
  );
}

function normalizeStructuredText(value?: string) {
  if (!value || value.trim().length === 0 || value === "Not Available") {
    return null;
  }

  return value.trim();
}

function normalizeStructuredRating(value?: number | "Not Available") {
  return typeof value === "number" ? value : null;
}

function mergeDynastyPoints(
  extracted: BuilderDynastyPoints,
  structured?: BuilderDynastyPoints
): BuilderDynastyPoints {
  return {
    total: normalizeStructuredPoint(structured?.total) ?? extracted.total,
    allocated: normalizeStructuredPoint(structured?.allocated) ?? extracted.allocated,
    used: normalizeStructuredPoint(structured?.used) ?? extracted.used,
    available: normalizeStructuredPoint(structured?.available) ?? extracted.available
  };
}

function normalizeStructuredPoint(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

function mergeMySchoolGrades(
  extracted: BuilderMySchoolGrades,
  structured: Partial<BuilderMySchoolGrades> = {}
): BuilderMySchoolGrades {
  return Object.fromEntries(
    gradeLabels.map(([key]) => [key, structured[key] ?? extracted[key]])
  ) as BuilderMySchoolGrades;
}

function extractTextValue(text: string, labels: string[]) {
  for (const label of labels) {
    const pattern = new RegExp(`${escapeRegExp(label)}\\s*[:\\-]?\\s*([^\\n\\r]+)`, "i");
    const match = text.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

function extractRating(text: string, labels: readonly string[]) {
  for (const label of labels) {
    const pattern = new RegExp(`${escapeRegExp(label)}\\s*[:\\-]?\\s*(\\d{1,2})`, "i");
    const match = text.match(pattern);

    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  return null;
}

function extractDynastyPoints(text: string): BuilderDynastyPoints {
  const total = extractNumber(text, ["Total Dynasty Points", "Dynasty Points Total", "Total"]);
  const allocated = extractNumber(text, ["Allocated Dynasty Points", "Allocated"]);
  const used = extractNumber(text, ["Used Dynasty Points", "Used"]);
  const available = extractNumber(text, ["Available Dynasty Points", "Available"]);

  return {
    total,
    allocated,
    used,
    available
  };
}

function extractNumber(text: string, labels: string[]) {
  for (const label of labels) {
    const pattern = new RegExp(`${escapeRegExp(label)}\\s*[:\\-]?\\s*(\\d+)`, "i");
    const match = text.match(pattern);

    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  return undefined;
}

function extractMySchoolGrades(text: string): BuilderMySchoolGrades {
  return Object.fromEntries(
    gradeLabels.map(([key, labels]) => [key, extractGrade(text, labels)])
  ) as BuilderMySchoolGrades;
}

function extractGrade(text: string, labels: string[]): Grade {
  for (const label of labels) {
    const pattern = new RegExp(
      `${escapeRegExp(label)}\\s*[:\\-]?\\s*(A\\+|A-|A|B\\+|B-|B|C\\+|C-|C|D\\+|D-|D|F)`,
      "i"
    );
    const match = text.match(pattern);

    if (match?.[1]) {
      return normalizeGrade(match[1]);
    }
  }

  return "Not Available";
}

function normalizeGrade(value: string): Grade {
  const upper = value.toUpperCase() as Grade;
  return gradeValues.has(upper) ? upper : "Not Available";
}

function buildFieldIssues(input: {
  input: ScreenshotInput;
  methodUsed: ExtractionSource["methodUsed"];
  text: string;
  school: string;
  mascot: string;
  conference: string;
  overall: number | null | "Not Available";
  offense: number | null | "Not Available";
  defense: number | null | "Not Available";
  dynastyPoints: BuilderDynastyPoints;
  mySchoolGrades: BuilderMySchoolGrades;
}): FieldConfidence[] {
  const issues: FieldConfidence[] = [];
  const sourceFile = input.input.relativePath;
  const isFallbackFailureTranscript = /OCR Status:\s*Failed/i.test(input.text);

  if (input.methodUsed === "sidecar" && !input.text.trim()) {
    issues.push({
      field: "extractionMethod",
      confidence: 0.25,
      issue: "No OCR, Vision JSON, manual review, or transcript data was available.",
      sourceFile
    });
  }

  if (!input.text.trim()) {
    issues.push({
      field: "sourceText",
      confidence: 0,
      issue: "No OCR transcript sidecar found; screenshot requires human review.",
      sourceFile
    });
  }

  if (isFallbackFailureTranscript) {
    issues.push({
      field: "sourceText",
      confidence: 0,
      issue: "OCR transcript is a fallback failure transcript; screenshot requires human review.",
      sourceFile
    });
  }

  addMissingIssue(issues, "school", input.school, sourceFile);
  addMissingIssue(issues, "mascot", input.mascot, sourceFile);
  addMissingIssue(issues, "conference", input.conference, sourceFile);
  addMissingNumberIssue(issues, "overall", input.overall, sourceFile);
  addMissingNumberIssue(issues, "offense", input.offense, sourceFile);
  addMissingNumberIssue(issues, "defense", input.defense, sourceFile);
  addMissingOptionalNumberIssue(
    issues,
    "dynastyPoints.total",
    input.dynastyPoints.total,
    sourceFile
  );
  addMissingOptionalNumberIssue(
    issues,
    "dynastyPoints.allocated",
    input.dynastyPoints.allocated,
    sourceFile
  );
  addMissingOptionalNumberIssue(
    issues,
    "dynastyPoints.used",
    input.dynastyPoints.used,
    sourceFile
  );
  addMissingOptionalNumberIssue(
    issues,
    "dynastyPoints.available",
    input.dynastyPoints.available,
    sourceFile
  );

  Object.entries(input.mySchoolGrades).forEach(([field, grade]) => {
    if (grade === "Not Available") {
      issues.push({
        field: `mySchoolGrades.${field}`,
        confidence: 0.25,
        issue: "Grade not visible or not confidently extracted.",
        sourceFile
      });
    }
  });

  return issues;
}

function addMissingIssue(
  issues: FieldConfidence[],
  field: string,
  value: string,
  sourceFile: string
) {
  if (value === "Not Available" || value.trim().length === 0) {
    issues.push({
      field,
      confidence: 0.25,
      issue: `${field} was not confidently extracted.`,
      sourceFile
    });
  }
}

function addMissingNumberIssue(
  issues: FieldConfidence[],
  field: string,
  value: number | null | "Not Available",
  sourceFile: string
) {
  if (value === null || value === "Not Available") {
    issues.push({
      field,
      confidence: 0.25,
      issue: `${field} rating was not confidently extracted.`,
      sourceFile
    });
  }
}

function addMissingOptionalNumberIssue(
  issues: FieldConfidence[],
  field: string,
  value: number | undefined,
  sourceFile: string
) {
  if (value === undefined) {
    issues.push({
      field,
      confidence: 0.25,
      issue: `${field} was not confidently extracted.`,
      sourceFile
    });
  }
}

function calculateRecordConfidence(issues: FieldConfidence[]) {
  if (issues.length === 0) {
    return 1;
  }

  return Number(Math.max(0.1, 1 - issues.length * 0.05).toFixed(2));
}

function buildReviewItems(records: RawExtractedTeamRecord[], validationErrors: string[]) {
  const items: ReviewItem[] = records
    .filter((record) => record.issues.length > 0)
    .map((record) => ({
      id: record.id,
      school: record.school,
      sourceFile: record.sourceFile,
      confidence: record.confidence,
      issue: "Human review required before importing this team record.",
      fields: record.issues
    }));

  validationErrors.forEach((error) => {
    items.push({
      id: "validation",
      school: "Validation",
      sourceFile: "validation",
      confidence: 0,
      issue: error,
      fields: []
    });
  });

  return items;
}

function buildDiagnostic(
  record: RawExtractedTeamRecord,
  requestedMode: ExtractionMode
): ExtractionDiagnostic {
  const failedFields = record.issues
    .filter((issue) => issue.field !== "extractionMethod")
    .map((issue) => issue.field);
  const successfulFields = [
    ["school", record.school],
    ["mascot", record.mascot],
    ["conference", record.conference],
    ["overall", record.overall],
    ["offense", record.offense],
    ["defense", record.defense],
    ["dynastyPoints.total", record.dynastyPoints.total],
    ["dynastyPoints.allocated", record.dynastyPoints.allocated],
    ["dynastyPoints.used", record.dynastyPoints.used],
    ["dynastyPoints.available", record.dynastyPoints.available],
    ...Object.entries(record.mySchoolGrades).map(([key, value]) => [
      `mySchoolGrades.${key}`,
      value
    ])
  ]
    .filter(([, value]) => value !== undefined && value !== "Not Available")
    .map(([field]) => String(field));
  const methodIssue = record.issues.find((issue) => issue.field === "extractionMethod");

  return {
    sourceFile: record.sourceFile,
    school: record.school,
    requestedMode,
    methodUsed: getMethodFromIssue(methodIssue?.issue),
    successfulFields,
    failedFields,
    confidence: record.confidence,
    sourceNote: methodIssue?.issue
  };
}

function buildTierSummary(diagnostics: ExtractionDiagnostic[]) {
  const summaries = new Map<
    string,
    {
      prestigeTier: string;
      teamsProcessed: number;
      successfulFields: number;
      failedFields: number;
      teamsNeedingReview: number;
      commonMissingFields: Record<string, number>;
    }
  >();

  diagnostics.forEach((diagnostic) => {
    const prestigeTier = diagnostic.sourceFile.split("/")[1] ?? "Unknown";
    const summary =
      summaries.get(prestigeTier) ??
      {
        prestigeTier,
        teamsProcessed: 0,
        successfulFields: 0,
        failedFields: 0,
        teamsNeedingReview: 0,
        commonMissingFields: {}
      };

    summary.teamsProcessed += 1;
    summary.successfulFields += diagnostic.successfulFields.length;
    summary.failedFields += diagnostic.failedFields.length;
    summary.teamsNeedingReview += diagnostic.failedFields.length > 0 ? 1 : 0;

    diagnostic.failedFields.forEach((field) => {
      summary.commonMissingFields[field] = (summary.commonMissingFields[field] ?? 0) + 1;
    });

    summaries.set(prestigeTier, summary);
  });

  return Array.from(summaries.values()).sort((a, b) =>
    b.prestigeTier.localeCompare(a.prestigeTier)
  );
}

function getMethodFromIssue(issue = ""): ExtractionDiagnostic["methodUsed"] {
  if (issue.includes("vision-json")) {
    return "vision-json";
  }

  if (issue.includes("manual-reviewed")) {
    return "manual-reviewed";
  }

  if (issue.includes("tesseract")) {
    return "tesseract";
  }

  if (issue.includes("apple-vision")) {
    return "apple-vision";
  }

  return "sidecar";
}

function validateRecords(records: RawExtractedTeamRecord[]) {
  const errors: string[] = [];
  const ids = new Set<string>();

  records.forEach((record) => {
    if (ids.has(record.id)) {
      errors.push(`${record.id}: duplicate team id`);
    }

    ids.add(record.id);

    validateRating(record, "overall", errors);
    validateRating(record, "offense", errors);
    validateRating(record, "defense", errors);

    if (record.teamPrestige < 1 || record.teamPrestige > 5) {
      errors.push(`${record.id}: teamPrestige must be between 1 and 5`);
    }

    Object.entries(record.dynastyPoints).forEach(([key, value]) => {
      if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
        errors.push(`${record.id}: dynastyPoints.${key} must be non-negative`);
      }
    });

    Object.entries(record.mySchoolGrades).forEach(([key, value]) => {
      if (!gradeValues.has(value)) {
        errors.push(`${record.id}: mySchoolGrades.${key} is not an allowed grade`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateRating(
  record: RawExtractedTeamRecord,
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

function calculateAvailableDynastyPoints(points: BuilderDynastyPoints) {
  if (typeof points.available === "number") {
    return Math.max(0, points.available);
  }

  const total = points.total ?? 0;
  const allocated = points.allocated ?? 0;
  const used = points.used ?? 0;

  return Math.max(0, total - allocated - used);
}

function generateTypeScriptDatabase(records: RawExtractedTeamRecord[]) {
  const recordsForDatabase = records.map(toDatabaseRecord);

  return `import type { CFB27Team } from "@/types/team";

// Generated by tools/cfb27-data-builder/src/extract-screenshot-data.ts
// Human review is required before importing generated records into the live app.
export const generatedCfb27TeamRecords = ${JSON.stringify(recordsForDatabase, null, 2)} satisfies CFB27Team[];
`;
}

function toDatabaseRecord(record: RawExtractedTeamRecord) {
  return {
    id: record.id,
    school: record.school,
    mascot: record.mascot,
    shortName: record.shortName,
    conference: record.conference,
    teamPrestige: record.teamPrestige,
    overall: record.overall,
    offense: record.offense,
    defense: record.defense,
    dynastyPoints: record.dynastyPoints,
    mySchoolGrades: record.mySchoolGrades
  };
}

async function writeJson(fileName: string, value: unknown) {
  await writeFile(join(outputDir, fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function schoolFromFileName(fileName: string) {
  return fileName
    .replace(extname(fileName), "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeSchoolId(school: string) {
  return school
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseExtractionOptions(): ExtractionOptions {
  const args = process.argv.slice(2);
  const modeArg = getArgValue(args, "--mode");
  const prestigeArg = getArgValue(args, "--prestige");
  const mode = isExtractionMode(modeArg) ? modeArg : "apple-vision";
  const prestigeFilter =
    prestigeArg && Number.isInteger(Number(prestigeArg)) ? Number(prestigeArg) : undefined;

  return {
    mode,
    prestigeFilter
  };
}

function getArgValue(args: string[], key: string) {
  const inlineArg = args.find((arg) => arg.startsWith(`${key}=`));

  if (inlineArg) {
    return inlineArg.slice(key.length + 1);
  }

  const argIndex = args.indexOf(key);
  return argIndex >= 0 ? args[argIndex + 1] : undefined;
}

function isExtractionMode(value: string | undefined): value is ExtractionMode {
  return (
    value === "apple-vision" ||
    value === "tesseract" ||
    value === "vision-json" ||
    value === "manual-reviewed"
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  extractScreenshotData()
    .then((result) => {
      console.log(
        JSON.stringify(
          {
            records: result.records.length,
            reviewItems: result.reviewItems.length,
            validationErrors: result.validation.errors.length,
            diagnostics: result.diagnostics.length
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
