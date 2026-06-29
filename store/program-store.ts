"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProgramProfile } from "@/types/program";

type ProgramStore = {
  programProfile: ProgramProfile | null;
  hasHydrated: boolean;
  setProgramProfile: (profile: ProgramProfile) => void;
  clearProgramProfile: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useProgramStore = create<ProgramStore>()(
  persist(
    (set) => ({
      programProfile: null,
      hasHydrated: false,
      setProgramProfile: (profile) => set({ programProfile: profile }),
      clearProgramProfile: () => set({ programProfile: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated })
    }),
    {
      name: "dynasty-blueprint-program-profile",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        programProfile: state.programProfile
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
