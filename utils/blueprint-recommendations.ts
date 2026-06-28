import type {
  BlueprintAllocation,
  BlueprintRecommendation
} from "@/types/blueprint";
import type { ProgramProfile } from "@/types/program";

const allocationPlan: Array<Omit<BlueprintAllocation, "recommendedPoints">> = [
  {
    category: "staff",
    label: "Staff",
    recommendedPercentage: 30
  },
  {
    category: "facilities",
    label: "Facilities",
    recommendedPercentage: 25
  },
  {
    category: "recruitingNil",
    label: "Recruiting NIL",
    recommendedPercentage: 25
  },
  {
    category: "rosterNil",
    label: "Roster NIL",
    recommendedPercentage: 20
  }
];

export function generateBlueprintRecommendation(
  availablePoints: number,
  profile: ProgramProfile
): BlueprintRecommendation {
  const safePoints = Math.max(0, Math.floor(availablePoints));
  let allocatedPoints = 0;

  const allocations = allocationPlan.map((allocation, index) => {
    const isLast = index === allocationPlan.length - 1;
    const recommendedPoints = isLast
      ? safePoints - allocatedPoints
      : Math.floor((safePoints * allocation.recommendedPercentage) / 100);

    allocatedPoints += recommendedPoints;

    return {
      ...allocation,
      recommendedPoints
    };
  });

  return {
    availablePoints: safePoints,
    allocations,
    remainingPoints: safePoints - allocatedPoints,
    strategicSummary: `${profile.school.name} has championship expectations, so the plan keeps resources balanced across staff quality, player development, recruiting momentum, and roster retention.`,
    tradeoffs: [
      "A larger staff investment supports coaching stability, but leaves fewer points for immediate NIL flexibility.",
      "Facilities spending strengthens long-term development, but the payoff is less immediate than recruiting NIL.",
      "Balancing Recruiting NIL and Roster NIL protects both future talent acquisition and current roster retention."
    ]
  };
}
