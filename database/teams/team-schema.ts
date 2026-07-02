import type { Grade, MySchoolGrades } from "@/types/team";

export const gradeValues = [
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
] as const satisfies readonly Grade[];

export const mySchoolGradeKeys = [
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
] as const satisfies ReadonlyArray<keyof MySchoolGrades>;

export const notAvailableGrade: Grade = "Not Available";

export function isGrade(value: unknown): value is Grade {
  return typeof value === "string" && gradeValues.includes(value as Grade);
}
