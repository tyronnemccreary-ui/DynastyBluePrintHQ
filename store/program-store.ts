"use client";

import { create } from "zustand";
import type { ProgramProfile } from "@/types/program";

type ProgramStore = {
  programProfile: ProgramProfile | null;
  setProgramProfile: (profile: ProgramProfile) => void;
  clearProgramProfile: () => void;
};

export const useProgramStore = create<ProgramStore>((set) => ({
  programProfile: null,
  setProgramProfile: (profile) => set({ programProfile: profile }),
  clearProgramProfile: () => set({ programProfile: null })
}));
