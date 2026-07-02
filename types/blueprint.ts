export type BlueprintCategory = "staff" | "facilities" | "recruitingNil" | "rosterNil";

export type BudgetChangeWindow =
  | "Offseason Only"
  | "Before Recruiting Begins"
  | "Before Players Leaving";

export type BudgetCategorySpend = Record<BlueprintCategory, number>;

export type BlueprintAllocation = {
  category: BlueprintCategory;
  label: string;
  changeWindow: BudgetChangeWindow;
  locked: boolean;
  lockMessage?: string;
  recommendedPercentage: number;
  recommendedPoints: number;
  actualPoints: number;
  actualPercentage: number;
  pointDifference: number;
  percentageDifference: number;
};

export type BlueprintRecommendation = {
  availablePoints: number;
  totalPoints: number;
  usedPoints: number;
  allocations: BlueprintAllocation[];
  remainingPoints: number;
  strategicSummary: string;
  tradeoffs: string[];
};

export type BlueprintActualSpend = BudgetCategorySpend;

export type FootballOperationsBudgetForecast = {
  currentBudget: number;
  projectedRemainingBudget: number;
  projectedStaffCost: number;
  projectedFacilityCost: number;
  projectedRecruitingNil: number;
  projectedRosterNil: number;
  reserve: number;
};

export type FootballOperationsBudgetSummary = {
  budgetHealth: "Healthy" | "Watch" | "At Risk";
  dynastyPointsRemaining: number;
  projectedEndOfYearReserve: number;
  highestBudgetRisk: string;
};

export type SeasonBudget = {
  totalDynastyPoints: number;
  pointsUsed: number;
  pointsAvailable: number;
  allocations: BudgetCategorySpend;
  recommendedAllocations: BudgetCategorySpend;
  locked: boolean;
  lockReason?: string;
};

export type AnnualBudgetHistoryEntry = {
  season: number;
  totalDynastyPoints: number;
  pointsUsed: number;
  pointsAvailable: number;
  completedDate: string;
};
