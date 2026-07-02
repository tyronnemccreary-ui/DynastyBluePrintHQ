import type {
  BlueprintAllocation,
  BlueprintActualSpend,
  BlueprintCategory,
  FootballOperationsBudgetForecast,
  FootballOperationsBudgetSummary,
  BlueprintRecommendation
} from "@/types/blueprint";
import type { ProgramLifecyclePhase } from "@/program/types/program";
import type { ProgramProfile } from "@/types/program";

const allocationPlan: Array<
  Pick<
    BlueprintAllocation,
    "category" | "label" | "recommendedPercentage" | "changeWindow"
  >
> = [
  {
    category: "staff",
    label: "Staff",
    recommendedPercentage: 30,
    changeWindow: "Offseason Only"
  },
  {
    category: "facilities",
    label: "Facilities",
    recommendedPercentage: 25,
    changeWindow: "Offseason Only"
  },
  {
    category: "recruitingNil",
    label: "Recruiting NIL",
    recommendedPercentage: 25,
    changeWindow: "Before Recruiting Begins"
  },
  {
    category: "rosterNil",
    label: "Roster NIL",
    recommendedPercentage: 20,
    changeWindow: "Before Players Leaving"
  }
];

export function generateBlueprintRecommendation(
  totalDynastyPoints: number,
  profile: ProgramProfile,
  actualSpend: BlueprintActualSpend = {
    staff: 0,
    facilities: 0,
    recruitingNil: 0,
    rosterNil: 0
  }
): BlueprintRecommendation {
  const totalPoints = Math.max(0, Math.floor(totalDynastyPoints));
  const usedPoints = Object.values(actualSpend).reduce(
    (total, value) => total + Math.max(0, Math.floor(value)),
    0
  );
  const availablePoints = Math.max(0, totalPoints - usedPoints);
  const budgetLock = calculateBudgetLock(profile.currentPhase, profile.week);
  let allocatedPoints = 0;

  const allocations = allocationPlan.map((allocation, index) => {
    const isLast = index === allocationPlan.length - 1;
    const recommendedPoints = isLast
      ? totalPoints - allocatedPoints
      : Math.floor((totalPoints * allocation.recommendedPercentage) / 100);
    const actualPoints = Math.max(0, Math.floor(actualSpend[allocation.category] ?? 0));
    const actualPercentage =
      totalPoints > 0 ? Math.round((actualPoints / totalPoints) * 100) : 0;

    allocatedPoints += recommendedPoints;

    return {
      ...allocation,
      locked: budgetLock.locked,
      lockMessage: budgetLock.locked ? "Locked for current season." : undefined,
      recommendedPoints,
      actualPoints,
      actualPercentage,
      pointDifference: actualPoints - recommendedPoints,
      percentageDifference: actualPercentage - allocation.recommendedPercentage
    };
  });

  return {
    availablePoints,
    totalPoints,
    usedPoints,
    allocations,
    remainingPoints: Math.max(0, totalPoints - usedPoints),
    strategicSummary: `${profile.school.name} is operating from an annual football operations budget. The plan keeps resources balanced across staff quality, player development, recruiting momentum, and roster retention while protecting an end-of-year reserve.`,
    tradeoffs: [
      "A larger staff investment supports coaching stability, but leaves fewer points for immediate NIL flexibility.",
      "Facilities spending strengthens long-term development, but the payoff is less immediate than recruiting NIL.",
      "Balancing Recruiting NIL and Roster NIL protects both future talent acquisition and current roster retention."
    ]
  };
}

export function calculateRecommendedBudgetSpend(totalDynastyPoints: number) {
  const totalPoints = Math.max(0, Math.floor(totalDynastyPoints));
  let allocatedPoints = 0;

  return allocationPlan.reduce((budget, allocation, index) => {
    const isLast = index === allocationPlan.length - 1;
    const recommendedPoints = isLast
      ? totalPoints - allocatedPoints
      : Math.floor((totalPoints * allocation.recommendedPercentage) / 100);

    allocatedPoints += recommendedPoints;

    return {
      ...budget,
      [allocation.category]: recommendedPoints
    };
  }, {} as Record<BlueprintCategory, number>);
}

export function calculateBudgetLock(phase: ProgramLifecyclePhase, week: number) {
  const editable =
    phase === "Welcome" ||
    phase === "Football Operations Setup" ||
    phase === "Preseason" ||
    phase === "Offseason" ||
    (phase === "Regular Season" && week <= 1);

  return {
    locked: !editable,
    reason: editable ? undefined : "Changes available during Offseason Planning."
  };
}

export function generateBudgetForecast(
  totalDynastyPoints: number,
  actualSpend: BlueprintActualSpend,
  recommendedSpend = calculateRecommendedBudgetSpend(totalDynastyPoints)
): FootballOperationsBudgetForecast {
  const currentBudget = Math.max(0, Math.floor(totalDynastyPoints));
  const projectedStaffCost = Math.max(actualSpend.staff, recommendedSpend.staff);
  const projectedFacilityCost = Math.max(actualSpend.facilities, recommendedSpend.facilities);
  const projectedRecruitingNil = Math.max(
    actualSpend.recruitingNil,
    recommendedSpend.recruitingNil
  );
  const projectedRosterNil = Math.max(actualSpend.rosterNil, recommendedSpend.rosterNil);
  const projectedUsed =
    projectedStaffCost + projectedFacilityCost + projectedRecruitingNil + projectedRosterNil;
  const projectedRemainingBudget = Math.max(0, currentBudget - projectedUsed);

  return {
    currentBudget,
    projectedRemainingBudget,
    projectedStaffCost,
    projectedFacilityCost,
    projectedRecruitingNil,
    projectedRosterNil,
    reserve: projectedRemainingBudget
  };
}

export function summarizeBudgetForecast(
  forecast: FootballOperationsBudgetForecast
): FootballOperationsBudgetSummary {
  const reserveRate =
    forecast.currentBudget > 0 ? forecast.reserve / forecast.currentBudget : 0;
  const costs = [
    { label: "Staff", value: forecast.projectedStaffCost },
    { label: "Facilities", value: forecast.projectedFacilityCost },
    { label: "Recruiting NIL", value: forecast.projectedRecruitingNil },
    { label: "Roster NIL", value: forecast.projectedRosterNil }
  ];
  const highestCost = costs.reduce((highest, current) =>
    current.value > highest.value ? current : highest
  );

  return {
    budgetHealth:
      reserveRate >= 0.12 ? "Healthy" : reserveRate >= 0.05 ? "Watch" : "At Risk",
    dynastyPointsRemaining: forecast.projectedRemainingBudget,
    projectedEndOfYearReserve: forecast.reserve,
    highestBudgetRisk:
      forecast.reserve === 0
        ? "No reserve if projected costs hold"
        : `${highestCost.label} is the largest projected commitment`
  };
}

export function getBudgetTimeline() {
  return allocationPlan.map((allocation) => ({
    category: allocation.category,
    label: allocation.label,
    changeWindow: allocation.changeWindow
  }));
}
