import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { ensureProgramOperationsProfile } from "@/program/services/program-engine";
import type { ProgramProfile } from "@/types/program";
import type {
  PersistenceMode,
  ProgramLoadResult,
  ProgramProfileRow,
  ProgramSaveResult
} from "@/types/database";

const PROGRAM_PROFILE_TABLE = "program_profiles";

export function getPersistenceMode(): PersistenceMode {
  return isSupabaseConfigured ? "Supabase" : "Local";
}

export async function saveProgramProfile(
  profile: ProgramProfile
): Promise<ProgramSaveResult> {
  if (!supabase) {
    return {
      mode: "Local",
      status: "local-only",
      lastSaved: null
    };
  }

  const now = new Date().toISOString();
  const row: ProgramProfileRow = {
    id: profile.id,
    school: profile.school,
    coach_name: profile.coachName,
    coach_role: profile.coachRole,
    dynasty_type: profile.dynastyType,
    created_at: profile.createdAt,
    updated_at: now
  };

  const { error } = await supabase
    .from(PROGRAM_PROFILE_TABLE)
    .upsert(row, { onConflict: "id" });

  if (error) {
    return {
      mode: "Supabase",
      status: "error",
      lastSaved: null,
      error: error.message
    };
  }

  return {
    mode: "Supabase",
    status: "saved",
    lastSaved: now
  };
}

export async function loadMostRecentProgramProfile(): Promise<ProgramLoadResult> {
  if (!supabase) {
    return {
      mode: "Local",
      profile: null
    };
  }

  const { data, error } = await supabase
    .from(PROGRAM_PROFILE_TABLE)
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<ProgramProfileRow>();

  if (error) {
    return {
      mode: "Supabase",
      profile: null,
      error: error.message
    };
  }

  return {
    mode: "Supabase",
    profile: data ? mapProgramProfileRow(data) : null
  };
}

function mapProgramProfileRow(row: ProgramProfileRow): ProgramProfile {
  return ensureProgramOperationsProfile({
    id: row.id,
    school: row.school,
    coachName: row.coach_name,
    coachRole: row.coach_role,
    dynastyType: row.dynasty_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}
