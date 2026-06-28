export type BlueprintCategory = "staff" | "facilities" | "recruitingNil" | "rosterNil";

export type BlueprintAllocation = {
  category: BlueprintCategory;
  label: string;
  recommendedPercentage: number;
  recommendedPoints: number;
};

export type BlueprintRecommendation = {
  availablePoints: number;
  allocations: BlueprintAllocation[];
  remainingPoints: number;
  strategicSummary: string;
  tradeoffs: string[];
};
