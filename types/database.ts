import type { CoachRole, DynastyType, ProgramProfile } from "@/types/program";
import type { School } from "@/types/school";
import type { RecruitingPriority } from "@/types/roster";
import type { FootballRecommendation } from "@/types/recommendation";

export type PersistenceMode = "Local" | "Supabase";

export type SchoolSelectionRecord = {
  school: School;
};

export type CoachProfileRecord = {
  coachName: string;
  coachRole: CoachRole;
};

export type BlueprintSnapshotRecord = {
  availableDynastyPoints: number;
  focusAreas: string[];
};

export type RosterNeedsRecord = {
  priorities: RecruitingPriority[];
};

export type RecommendationsSnapshotRecord = {
  recommendations: FootballRecommendation[];
  generatedAt: string;
};

export type PersistedProgramProfile = ProgramProfile & {
  updatedAt: string;
};

export type ProgramProfileRow = {
  id: string;
  school: School;
  coach_name: string;
  coach_role: CoachRole;
  dynasty_type: DynastyType;
  created_at: string;
  updated_at: string;
};

export type ProgramSaveResult = {
  mode: PersistenceMode;
  status: "saved" | "local-only" | "error";
  lastSaved: string | null;
  error?: string;
};

export type ProgramLoadResult = {
  mode: PersistenceMode;
  profile: ProgramProfile | null;
  error?: string;
};
