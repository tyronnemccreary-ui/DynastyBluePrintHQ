import { cfb27TeamRecords } from "@/database/teams/cfb27-teams";
import {
  normalizeTeamRecord,
  normalizeTeamRecords
} from "@/database/teams/team-normalizers";
import { validateTeamRecords } from "@/database/teams/team-validation";

export { cfb27TeamRecords } from "@/database/teams/cfb27-teams";
export {
  calculateAvailableDynastyPoints,
  normalizeTeamRecord,
  normalizeTeamRecords
} from "@/database/teams/team-normalizers";
export {
  validateTeamRecord,
  validateTeamRecords,
  type TeamValidationResult
} from "@/database/teams/team-validation";
export { gradeValues, mySchoolGradeKeys } from "@/database/teams/team-schema";

export const teamDatabaseValidation = validateTeamRecords(cfb27TeamRecords);

export const cfb27Teams = normalizeTeamRecords(cfb27TeamRecords);

export const primaryTeam = cfb27Teams[0];

export function findTeamById(id: string) {
  return cfb27Teams.find((team) => team.id === id);
}

export function findTeamRecordById(id: string) {
  const record = cfb27TeamRecords.find((team) => team.id === id);

  return record ? normalizeTeamRecord(record) : undefined;
}
