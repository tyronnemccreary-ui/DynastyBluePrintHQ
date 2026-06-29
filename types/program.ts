import type { School } from "@/types/school";

export type DynastyType = "new" | "existing";

export type CoachRole = "head_coach" | "offensive_coordinator" | "defensive_coordinator";

export type ProgramProfile = {
  id: string;
  dynastyType: DynastyType;
  school: School;
  coachName: string;
  coachRole: CoachRole;
  createdAt: string;
  updatedAt?: string;
};

export const coachRoleLabels: Record<CoachRole, string> = {
  head_coach: "Head Coach",
  offensive_coordinator: "Offensive Coordinator",
  defensive_coordinator: "Defensive Coordinator"
};

export const dynastyTypeLabels: Record<DynastyType, string> = {
  new: "Start New Dynasty",
  existing: "Continue Existing Dynasty"
};
