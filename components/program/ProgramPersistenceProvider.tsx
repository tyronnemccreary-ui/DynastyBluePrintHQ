"use client";

import { ReactNode, useEffect, useRef } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { loadMostRecentProgramProfile } from "@/services/program-service";
import { useProgramStore } from "@/store/program-store";

type ProgramPersistenceProviderProps = {
  children: ReactNode;
};

export function ProgramPersistenceProvider({
  children
}: ProgramPersistenceProviderProps) {
  const hasLoadedFromSupabase = useRef(false);
  const hasHydrated = useProgramStore((state) => state.hasHydrated);
  const programProfile = useProgramStore((state) => state.programProfile);
  const setProgramProfile = useProgramStore((state) => state.setProgramProfile);

  useEffect(() => {
    if (
      !hasHydrated ||
      hasLoadedFromSupabase.current ||
      !isSupabaseConfigured ||
      programProfile
    ) {
      return;
    }

    hasLoadedFromSupabase.current = true;

    async function loadProfile() {
      const result = await loadMostRecentProgramProfile();

      if (result.profile) {
        setProgramProfile(result.profile);
      }
    }

    void loadProfile();
  }, [hasHydrated, programProfile, setProgramProfile]);

  return children;
}
