import type {
  ProgramLifecyclePhase,
  ProgramOperationsActivation,
  ProgramRosterState,
  ProgramStaffState,
  ProgramRecruitingState,
  ProgramTransferPortalState
} from "@/program/types/program";
import type {
  BlueprintActualSpend,
  FootballOperationsBudgetForecast,
  SeasonBudget
} from "@/types/blueprint";
import type { DynastyPoints } from "@/types/team";
import {
  calculateBudgetLock,
  calculateRecommendedBudgetSpend,
  generateBudgetForecast
} from "@/utils/blueprint-recommendations";

export const initialProgramPhase: ProgramLifecyclePhase = "Football Operations Setup";

export const initialSeason = 1;

export const initialWeek = 0;

export const defaultProgramActivation: ProgramOperationsActivation = {
  rosterActivated: false,
  staffActivated: false,
  recruitingActivated: false,
  transferPortalActivated: false,
  adExpectationsActivated: false
};

export const defaultProgramFocusAreas = [
  "Staff",
  "Facilities",
  "Recruiting NIL",
  "Roster NIL"
];

export function createInitialDynastyPoints(points: DynastyPoints): DynastyPoints {
  return {
    total: points.total ?? "Not Available",
    allocated: points.allocated ?? "Not Available",
    used: points.used ?? "Not Available",
    available: points.available ?? "Not Available"
  };
}

export function createInitialSeasonBudget(
  points: DynastyPoints,
  phase: ProgramLifecyclePhase,
  week: number
): SeasonBudget {
  const totalDynastyPoints = typeof points.total === "number" ? points.total : 0;
  const fallbackUsed = typeof points.used === "number" ? points.used : 0;
  const allocations: BlueprintActualSpend = {
    staff: 0,
    facilities: 0,
    recruitingNil: 0,
    rosterNil: 0
  };
  const pointsUsed = Object.values(allocations).reduce(
    (total, value) => total + value,
    fallbackUsed
  );
  const lock = calculateBudgetLock(phase, week);

  return {
    totalDynastyPoints,
    pointsUsed,
    pointsAvailable: Math.max(0, totalDynastyPoints - pointsUsed),
    allocations,
    recommendedAllocations: calculateRecommendedBudgetSpend(totalDynastyPoints),
    locked: lock.locked,
    lockReason: lock.reason
  };
}

export function createInitialBudgetForecast(
  seasonBudget: SeasonBudget
): FootballOperationsBudgetForecast {
  return generateBudgetForecast(
    seasonBudget.totalDynastyPoints,
    seasonBudget.allocations,
    seasonBudget.recommendedAllocations
  );
}

export function createInactiveRosterState(): ProgramRosterState {
  return {
    activated: false,
    lastUpdated: null
  };
}

export function createInactiveStaffState(): ProgramStaffState {
  return {
    activated: false,
    lastUpdated: null
  };
}

export function createInactiveRecruitingState(): ProgramRecruitingState {
  return {
    activated: false,
    lastUpdated: null
  };
}

export function createInactiveTransferPortalState(): ProgramTransferPortalState {
  return {
    activated: false,
    lastUpdated: null
  };
}
