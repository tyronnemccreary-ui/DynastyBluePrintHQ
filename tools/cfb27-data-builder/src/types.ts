export type ScreenshotCategory =
  | "team-overview"
  | "my-school-grades"
  | "dynasty-blueprint"
  | "ad-expectations";

export type ExtractionStatus =
  | "pending"
  | "manual-review"
  | "validated"
  | "failed";

export type BuilderGrade =
  | "A+"
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "C-"
  | "D+"
  | "D"
  | "D-"
  | "F"
  | "Not Available";

export type RawScreenshotFile = {
  fileName: string;
  filePath: string;
  category: ScreenshotCategory;
  schoolId?: string;
  status: ExtractionStatus;
};

export type BuilderDynastyPoints = {
  total?: number;
  allocated?: number;
  used?: number;
  available?: number;
};

export type BuilderMySchoolGrades = {
  academicPrestige: BuilderGrade;
  athleticFacilities: BuilderGrade;
  brandExposure: BuilderGrade;
  campusLifestyle: BuilderGrade;
  championshipContender: BuilderGrade;
  coachPrestige: BuilderGrade;
  coachStability: BuilderGrade;
  conferencePrestige: BuilderGrade;
  playingStyle: BuilderGrade;
  playingTime: BuilderGrade;
  proximityToHome: BuilderGrade;
  programTradition: BuilderGrade;
  stadiumAtmosphere: BuilderGrade;
  proPotential: BuilderGrade;
};

export type ExtractedTeamRecord = {
  id?: string;
  school: string;
  mascot: string;
  shortName: string;
  conference: string;
  teamPrestige: number;
  overall: number | "Not Available";
  offense: number | "Not Available";
  defense: number | "Not Available";
  dynastyPoints: BuilderDynastyPoints;
  mySchoolGrades: BuilderMySchoolGrades;
};

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export type BuilderOutput = {
  generatedAt: string;
  sourceFiles: string[];
  records: ExtractedTeamRecord[];
  validation: ValidationResult;
};

export type FieldConfidence = {
  field: string;
  confidence: number;
  issue?: string;
  sourceFile: string;
};

export type RawExtractedTeamRecord = ExtractedTeamRecord & {
  id: string;
  sourceFile: string;
  confidence: number;
  issues: FieldConfidence[];
};

export type ReviewItem = {
  id: string;
  school: string;
  sourceFile: string;
  confidence: number;
  issue: string;
  fields: FieldConfidence[];
};
