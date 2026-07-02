export type {
  CoachRole,
  DynastyType,
  JobSecurity,
  ProgramBlueprintState,
  ProgramHistoryEvent,
  ProgramLifecyclePhase,
  ProgramOperationsActivation,
  ProgramOperationsProfile,
  ProgramRecruitingState,
  ProgramRosterState,
  ProgramStaffState,
  ProgramTransferPortalState
} from "@/program/types/program";

export type { ProgramOperationsProfile as ProgramProfile } from "@/program/types/program";

import type { CoachRole, DynastyType } from "@/program/types/program";

export const coachRoleLabels: Record<CoachRole, string> = {
  head_coach: "Head Coach",
  offensive_coordinator: "Offensive Coordinator",
  defensive_coordinator: "Defensive Coordinator"
};

export const dynastyTypeLabels: Record<DynastyType, string> = {
  new: "Start New Dynasty",
  existing: "Continue Existing Dynasty"
};
