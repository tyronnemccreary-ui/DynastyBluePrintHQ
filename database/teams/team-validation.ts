import { isGrade, mySchoolGradeKeys } from "@/database/teams/team-schema";
import type { CFB27Team, DynastyPoints } from "@/types/team";

export type TeamValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validateTeamRecord(team: CFB27Team): TeamValidationResult {
  const errors: string[] = [];

  validateRequiredFields(team, errors);
  validateRating("overall", team.overall, errors);
  validateRating("offense", team.offense, errors);
  validateRating("defense", team.defense, errors);
  validateTeamPrestige(team.teamPrestige, errors);
  validateDynastyPoints(team.dynastyPoints, errors);
  validateMySchoolGrades(team, errors);

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateTeamRecords(teams: CFB27Team[]): TeamValidationResult {
  const errors = teams.flatMap((team) =>
    validateTeamRecord(team).errors.map((error) => `${team.id}: ${error}`)
  );

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateRequiredFields(team: CFB27Team, errors: string[]) {
  const requiredFields: Array<keyof CFB27Team> = [
    "id",
    "school",
    "mascot",
    "shortName",
    "conference",
    "teamPrestige",
    "overall",
    "offense",
    "defense",
    "dynastyPoints",
    "mySchoolGrades"
  ];

  requiredFields.forEach((field) => {
    if (team[field] === undefined || team[field] === null || team[field] === "") {
      errors.push(`Missing required field: ${field}`);
    }
  });
}

function validateRating(label: string, value: CFB27Team["overall"], errors: string[]) {
  if (value === "Not Available") {
    return;
  }

  if (!Number.isInteger(value) || value < 0 || value > 99) {
    errors.push(`${label} rating must be an integer between 0 and 99`);
  }
}

function validateTeamPrestige(value: number, errors: string[]) {
  if (typeof value !== "number" || value < 1 || value > 5) {
    errors.push("teamPrestige must be between 1 and 5");
  }
}

function validateDynastyPoints(points: DynastyPoints, errors: string[]) {
  Object.entries(points).forEach(([key, value]) => {
    if (value === "Not Available") {
      return;
    }

    if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
      errors.push(`dynastyPoints.${key} must be non-negative`);
    }
  });
}

function validateMySchoolGrades(team: CFB27Team, errors: string[]) {
  mySchoolGradeKeys.forEach((key) => {
    const grade = team.mySchoolGrades[key];

    if (!isGrade(grade)) {
      errors.push(`mySchoolGrades.${key} must be a supported grade`);
    }
  });
}
