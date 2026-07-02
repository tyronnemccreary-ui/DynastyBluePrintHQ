import * as budgetIntelligence from "@/intelligence/engines/budget-intelligence";
import * as facilitiesIntelligence from "@/intelligence/engines/facilities-intelligence";
import * as recruitingIntelligence from "@/intelligence/engines/recruiting-intelligence";
import * as rosterIntelligence from "@/intelligence/engines/roster-intelligence";
import * as staffIntelligence from "@/intelligence/engines/staff-intelligence";
import type {
  DepartmentIntelligenceReports,
  FootballOperationsIntelligence
} from "@/intelligence/types/reports";
import type { ProgramProfile } from "@/types/program";
import { calculateProgramIntelligence } from "@/intelligence/services/program-health-service";

export function getDepartmentIntelligence(
  programProfile: ProgramProfile
): DepartmentIntelligenceReports {
  const roster = rosterIntelligence.analyze(programProfile);
  const recruiting = recruitingIntelligence.analyze(programProfile, roster);
  const budget = budgetIntelligence.analyze(programProfile);
  const staff = staffIntelligence.analyze(programProfile);
  const facilities = facilitiesIntelligence.analyze(programProfile);

  return {
    roster,
    recruiting,
    budget,
    staff,
    facilities
  };
}

export function getFootballOperationsIntelligence(
  programProfile: ProgramProfile
): FootballOperationsIntelligence {
  const reports = getDepartmentIntelligence(programProfile);

  return {
    ...reports,
    program: calculateProgramIntelligence(reports)
  };
}
