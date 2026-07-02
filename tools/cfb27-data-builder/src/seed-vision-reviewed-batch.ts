import { readdir, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import type { Grade, MySchoolGrades } from "@/types/team";

type ReviewedTeamRecord = {
  id: string;
  school: string;
  mascot: string;
  shortName: string;
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
  mySchoolGrades: Partial<MySchoolGrades>;
  sourceFile: string;
  extractionMethod: "vision-reviewed";
  verified: boolean;
};

type ReviewedFile = {
  generatedAt: string | null;
  extractionMethod: "vision-reviewed";
  records: ReviewedTeamRecord[];
};

type ReviewedOverride = Partial<Omit<ReviewedTeamRecord, "sourceFile" | "extractionMethod">>;

const builderRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const inputDir = join(builderRoot, "input");
const outputFile = join(builderRoot, "output/cfb27-teams.vision-reviewed.json");
const imageExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".heic"]);
const notAvailable = "Not Available" as const;

const reviewedOverrides: Record<string, ReviewedOverride> = {
  alabama: {
    mascot: "Crimson Tide",
    conference: "SEC",
    teamPrestige: 5,
    overall: 92,
    offense: 91,
    defense: 94,
    dynastyPoints: { total: 12500, used: 5870, available: 6630 },
    mySchoolGrades: {
      academicPrestige: "D+",
      athleticFacilities: "A+",
      brandExposure: "A+",
      campusLifestyle: "A-",
      championshipContender: "A-",
      coachPrestige: "A-",
      coachStability: "B+",
      conferencePrestige: "A+"
    },
    verified: true
  },
  georgia: {
    mascot: "Bulldogs",
    conference: "SEC",
    teamPrestige: 5,
    overall: 94,
    offense: 94,
    defense: 94,
    dynastyPoints: { total: 12200, used: 5135, available: 7065 },
    mySchoolGrades: {
      academicPrestige: "B+",
      athleticFacilities: "A+",
      brandExposure: "A+",
      campusLifestyle: "A",
      championshipContender: "A+",
      coachPrestige: "A+",
      coachStability: "A+",
      conferencePrestige: "A+"
    },
    verified: true
  },
  "ohio-state": {
    mascot: "Buckeyes",
    conference: "Big Ten",
    teamPrestige: 5,
    overall: 94,
    offense: 94,
    defense: 94,
    dynastyPoints: { total: 12500, used: 4875, available: 7625 },
    mySchoolGrades: {
      academicPrestige: "B+",
      athleticFacilities: "A+",
      brandExposure: "A+",
      campusLifestyle: "A",
      championshipContender: "A+",
      coachPrestige: "A+",
      coachStability: "A+",
      conferencePrestige: "A+"
    },
    verified: true
  },
  lsu: {
    mascot: "Tigers",
    conference: "SEC",
    overall: 89,
    offense: 89,
    defense: 89,
    dynastyPoints: { total: 10100, used: 3450, available: 6650 },
    mySchoolGrades: visibleGrades("D+", "A+", "A-", "A+", "A-", "A", "B+", "A+"),
    verified: true
  },
  miami: {
    mascot: "Hurricanes",
    conference: "ACC",
    overall: 87,
    offense: 86,
    defense: 89,
    dynastyPoints: { total: 10225, used: 4195, available: 6030 },
    mySchoolGrades: visibleGrades("B-", "B", "A+", "A+", "A", "A", "A", "A"),
    verified: true
  },
  michigan: {
    mascot: "Wolverines",
    conference: "Big Ten",
    overall: 89,
    offense: 89,
    defense: 89,
    dynastyPoints: { total: 11630, used: 6540, available: 5090 },
    mySchoolGrades: visibleGrades("A-", "A", "A+", "A-", "B+", "A-", "C+", "A+"),
    verified: true
  },
  nebraska: {
    mascot: "Cornhuskers",
    conference: "Big Ten",
    overall: 84,
    offense: 84,
    defense: 84,
    dynastyPoints: { total: 8300, used: 4060, available: 4240 },
    mySchoolGrades: visibleGrades("A-", "A", "A+", "A-", "B+", "A-", "C+", "A+"),
    verified: true
  },
  "notre-dame": {
    mascot: "Fighting Irish",
    conference: "Independent",
    overall: 91,
    offense: 91,
    defense: 91,
    dynastyPoints: { total: 11275, used: 4635, available: 6640 },
    mySchoolGrades: visibleGrades("A", "A", "A+", "B+", "A+", "A+", "A", "A"),
    verified: true
  },
  oklahoma: {
    mascot: "Sooners",
    conference: "SEC",
    overall: 86,
    offense: 86,
    defense: 86,
    dynastyPoints: { total: 10930, used: 6015, available: 4915 },
    mySchoolGrades: visibleGrades("C", "A-", "A", "B+", "A-", "A", "B+", "A+"),
    verified: true
  },
  "ole-miss": {
    mascot: "Rebels",
    conference: "SEC",
    overall: 86,
    offense: 86,
    defense: 86,
    dynastyPoints: { total: 8350, used: 3160, available: 5190 },
    mySchoolGrades: visibleGrades("D+", "B+", "A-", "A-", "A", "B", "B-", "A+"),
    verified: true
  },
  oregon: {
    mascot: "Ducks",
    conference: "Big Ten",
    overall: 91,
    offense: 91,
    defense: 91,
    dynastyPoints: { total: 10280, used: 2900, available: 7380 },
    mySchoolGrades: visibleGrades("C+", "A+", "A", "A", "A+", "A+", "A", "A+"),
    verified: true
  },
  "penn-st": {
    mascot: "Nittany Lions",
    conference: "Big Ten",
    overall: 84,
    offense: 84,
    defense: 84,
    dynastyPoints: { total: 9750, used: 5770, available: 3980 },
    mySchoolGrades: visibleGrades("B", "B+", "A-", "A-", "B+", "B+", "B", "A+"),
    verified: true
  },
  tennessee: {
    mascot: "Volunteers",
    conference: "SEC",
    overall: 86,
    offense: 86,
    defense: 86,
    dynastyPoints: { total: 9180, used: 5135, available: 4045 },
    mySchoolGrades: visibleGrades("C", "B-", "A-", "B+", "B", "A", "B+", "A+"),
    verified: true
  },
  "texas-aandm": {
    mascot: "Aggies",
    conference: "SEC",
    overall: 89,
    offense: 89,
    defense: 91,
    dynastyPoints: { total: 8180, used: 2545, available: 5635 },
    mySchoolGrades: visibleGrades("B", "A+", "B+", "B+", "A", "B+", "A-", "A+"),
    verified: true
  },
  texas: {
    mascot: "Longhorns",
    conference: "SEC",
    overall: 89,
    offense: 89,
    defense: 91,
    dynastyPoints: { total: 10630, used: 3460, available: 7170 },
    mySchoolGrades: visibleGrades("B+", "A+", "A", "A+", "A", "A+", "A", "A+"),
    verified: true
  },
  usc: {
    mascot: "Trojans",
    conference: "Big Ten",
    overall: 84,
    offense: 84,
    defense: 84,
    dynastyPoints: { total: 10400, used: 5710, available: 4690 },
    mySchoolGrades: visibleGrades("A-", "A", "A", "A+", "B+", "A-", "B", "A+"),
    verified: true
  },
  "4:washington-st": {
    id: "washington",
    school: "Washington",
    mascot: "Huskies",
    conference: "Big Ten",
    overall: 82,
    offense: 81,
    defense: 84,
    dynastyPoints: { total: 7880, used: 5015, available: 2865 },
    mySchoolGrades: visibleGrades("B", "B", "B+", "B+", "B-", "B-", "C", "A+"),
    verified: true
  },
  "arizona-st": {
    mascot: "Sun Devils",
    conference: "Big 12",
    overall: 79,
    offense: 79,
    defense: 81,
    dynastyPoints: { total: 5575, used: 2295, available: 3280 },
    mySchoolGrades: visibleGrades("C", "C+", "B", "A+", "C", "B+", "A-", "A-"),
    verified: true
  },
  arkansas: {
    mascot: "Razorbacks",
    conference: "SEC",
    overall: 82,
    offense: 81,
    defense: 84,
    dynastyPoints: { total: 5850, used: 2525, available: 3325 },
    mySchoolGrades: visibleGrades("D+", "A", "B-", "B", "C", "B", "C+", "A+"),
    verified: true
  },
  auburn: {
    mascot: "Tigers",
    conference: "SEC",
    overall: 85,
    offense: 86,
    defense: 84,
    dynastyPoints: { total: 6980, used: 2695, available: 4285 },
    mySchoolGrades: visibleGrades("C+", "A", "B-", "A-", "B-", "B", "D+", "A+"),
    verified: true
  },
  california: {
    mascot: "Golden Bears",
    conference: "ACC",
    overall: 79,
    offense: 79,
    defense: 79,
    dynastyPoints: { total: 5025, used: 2650, available: 2375 },
    mySchoolGrades: visibleGrades("A", "B", "B", "B-", "C+", "D+", "C-", "A"),
    verified: true
  },
  colorado: {
    mascot: "Buffaloes",
    conference: "Big 12",
    overall: 81,
    offense: 81,
    defense: 81,
    dynastyPoints: { total: 5875, used: 2990, available: 2885 },
    mySchoolGrades: visibleGrades("C+", "B", "B+", "A-", "C-", "B", "D", "A-"),
    verified: true
  }
};

export async function seedVisionReviewedBatch() {
  const screenshots = await findScreenshots();
  const records = screenshots.map(toReviewedRecord);
  const output = {
    generatedAt: new Date().toISOString(),
    extractionMethod: "vision-reviewed",
    records
  } satisfies ReviewedFile;

  await writeFile(outputFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  return {
    records: records.length,
    verified: records.filter((record) => record.verified).length,
    needsReview: records.filter((record) => !record.verified).length
  };
}

async function findScreenshots() {
  const folders = await readdir(inputDir, { withFileTypes: true });
  const screenshots: Array<{ fileName: string; prestige: number; sourceFile: string }> = [];

  for (const folder of folders) {
    if (!folder.isDirectory()) {
      continue;
    }

    const prestige = parsePrestige(folder.name);

    if (!prestige) {
      continue;
    }

    const folderPath = join(inputDir, folder.name);
    const files = await readdir(folderPath, { withFileTypes: true });

    files.forEach((file) => {
      if (!file.isFile() || !imageExtensions.has(extname(file.name).toLowerCase())) {
        return;
      }

      const sourceFile = relative(builderRoot, join(folderPath, file.name));
      screenshots.push({ fileName: file.name, prestige, sourceFile });
    });
  }

  return screenshots.sort((a, b) => a.sourceFile.localeCompare(b.sourceFile));
}

function toReviewedRecord(input: { fileName: string; prestige: number; sourceFile: string }) {
  const fileSchool = schoolFromFileName(input.fileName);
  const fileId = normalizeId(fileSchool);
  const override = reviewedOverrides[`${input.prestige}:${fileId}`] ?? reviewedOverrides[fileId] ?? {};
  const id = "id" in override && typeof override.id === "string" ? override.id : fileId;
  const school = "school" in override && typeof override.school === "string" ? override.school : fileSchool;
  const record = {
    id,
    school,
    mascot: override.mascot ?? notAvailable,
    shortName: school,
    conference: override.conference ?? notAvailable,
    teamPrestige: override.teamPrestige ?? input.prestige,
    overall: override.overall ?? notAvailable,
    offense: override.offense ?? notAvailable,
    defense: override.defense ?? notAvailable,
    dynastyPoints: override.dynastyPoints ?? {
      total: notAvailable,
      used: notAvailable,
      available: notAvailable
    },
    mySchoolGrades: override.mySchoolGrades ?? {},
    sourceFile: input.sourceFile,
    extractionMethod: "vision-reviewed",
    verified: override.verified === true
  } satisfies ReviewedTeamRecord;

  return record;
}

function visibleGrades(
  academicPrestige: Grade,
  athleticFacilities: Grade,
  brandExposure: Grade,
  campusLifestyle: Grade,
  championshipContender: Grade,
  coachPrestige: Grade,
  coachStability: Grade,
  conferencePrestige: Grade
): Partial<MySchoolGrades> {
  return {
    academicPrestige,
    athleticFacilities,
    brandExposure,
    campusLifestyle,
    championshipContender,
    coachPrestige,
    coachStability,
    conferencePrestige
  };
}

function parsePrestige(folderName: string) {
  const match = folderName.match(/^([1-5])\s*Star$/i);
  return match ? Number(match[1]) : null;
}

function schoolFromFileName(fileName: string) {
  return fileName
    .replace(extname(fileName), "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedVisionReviewedBatch()
    .then((result) => console.log(JSON.stringify(result, null, 2)))
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
