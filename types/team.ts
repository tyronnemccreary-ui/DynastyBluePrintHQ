export type Grade =
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

export type NotAvailable = "Not Available";

export type NumericValue = number | NotAvailable;

export type MySchoolGrades = {
  academicPrestige: Grade;
  athleticFacilities: Grade;
  brandExposure: Grade;
  campusLifestyle: Grade;
  championshipContender: Grade;
  coachPrestige: Grade;
  coachStability: Grade;
  conferencePrestige: Grade;
  playingStyle: Grade;
  playingTime: Grade;
  proximityToHome: Grade;
  programTradition: Grade;
  stadiumAtmosphere: Grade;
  proPotential: Grade;
};

export type DynastyPoints = {
  total?: NumericValue;
  allocated?: NumericValue;
  used?: NumericValue;
  available?: NumericValue;
};

export type TeamADExpectations = {
  demeanor?: string;
  expectationLevel?: string;
  activeGoals?: string[];
};

export type TeamExtractionMethod = "vision-reviewed";

export type CFB27Team = {
  id: string;
  school: string;
  mascot: string;
  shortName: string;
  conference: string;
  teamPrestige: number;
  overall: NumericValue;
  offense: NumericValue;
  defense: NumericValue;
  dynastyPoints: DynastyPoints;
  mySchoolGrades: MySchoolGrades;
  schoolDemeanor?: string;
  adExpectations?: TeamADExpectations;
  facilityTier?: string;
  pipelineStates?: string[];
  rivalries?: string[];
  sourceFile?: string;
  extractionMethod?: TeamExtractionMethod;
  verified?: boolean;
};
