"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ensureProgramOperationsProfile } from "@/program/services/program-engine";
import type { BlueprintActualSpend } from "@/types/blueprint";
import type { ProgramProfile } from "@/types/program";
import type { MockRosterProfile } from "@/types/roster";
import {
  calculateBudgetLock,
  calculateRecommendedBudgetSpend,
  generateBudgetForecast
} from "@/utils/blueprint-recommendations";

type ProgramStore = {
  programProfile: ProgramProfile | null;
  hasHydrated: boolean;
  setProgramProfile: (profile: ProgramProfile) => void;
  updateFootballOperationsBudget: (input: {
    totalDynastyPoints: number;
    allocations: BlueprintActualSpend;
  }) => void;
  activateRosterIntelligence: (input: {
    roster: MockRosterProfile;
    sourceFileName: string;
  }) => void;
  clearProgramProfile: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

export const useProgramStore = create<ProgramStore>()(
  persist(
    (set) => ({
      programProfile: null,
      hasHydrated: false,
      setProgramProfile: (profile) =>
        set({ programProfile: ensureProgramOperationsProfile(profile) }),
      updateFootballOperationsBudget: ({ totalDynastyPoints, allocations }) =>
        set((state) => {
          if (!state.programProfile) {
            return state;
          }

          const now = new Date().toISOString();
          const totalPoints = Math.max(0, Math.floor(totalDynastyPoints));
          const sanitizedAllocations = {
            staff: Math.max(0, Math.floor(allocations.staff)),
            facilities: Math.max(0, Math.floor(allocations.facilities)),
            recruitingNil: Math.max(0, Math.floor(allocations.recruitingNil)),
            rosterNil: Math.max(0, Math.floor(allocations.rosterNil))
          };
          const pointsUsed = Object.values(sanitizedAllocations).reduce(
            (total, value) => total + value,
            0
          );
          const recommendedAllocations = calculateRecommendedBudgetSpend(totalPoints);
          const lock = calculateBudgetLock(
            state.programProfile.currentPhase,
            state.programProfile.week
          );
          const budgetForecast = generateBudgetForecast(
            totalPoints,
            sanitizedAllocations,
            recommendedAllocations
          );

          return {
            programProfile: {
              ...state.programProfile,
              updatedAt: now,
              updatedDate: now,
              dynastyPoints: {
                ...state.programProfile.dynastyPoints,
                total: totalPoints,
                used: pointsUsed,
                available: Math.max(0, totalPoints - pointsUsed)
              },
              blueprint: {
                ...state.programProfile.blueprint,
                dynastyPoints: {
                  ...state.programProfile.blueprint.dynastyPoints,
                  total: totalPoints,
                  used: pointsUsed,
                  available: Math.max(0, totalPoints - pointsUsed)
                }
              },
              seasonBudget: {
                totalDynastyPoints: totalPoints,
                pointsUsed,
                pointsAvailable: Math.max(0, totalPoints - pointsUsed),
                allocations: sanitizedAllocations,
                recommendedAllocations,
                locked: lock.locked,
                lockReason: lock.reason
              },
              budgetLocked: lock.locked,
              budgetForecast
            }
          };
        }),
      activateRosterIntelligence: ({ roster, sourceFileName }) =>
        set((state) => {
          if (!state.programProfile) {
            return state;
          }

          const now = new Date().toISOString();

          return {
            programProfile: {
              ...state.programProfile,
              updatedAt: now,
              updatedDate: now,
              rosterAdded: true,
              activation: {
                ...state.programProfile.activation,
                rosterActivated: true
              },
              roster: {
                activated: true,
                lastUpdated: now,
                sourceFileName,
                data: roster
              }
            }
          };
        }),
      clearProgramProfile: () => set({ programProfile: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated })
    }),
    {
      name: "dynasty-blueprint-program-profile",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        programProfile: state.programProfile
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<ProgramStore>;

        return {
          ...state,
          programProfile: state.programProfile
            ? ensureProgramOperationsProfile(state.programProfile)
            : null
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      }
    }
  )
);
