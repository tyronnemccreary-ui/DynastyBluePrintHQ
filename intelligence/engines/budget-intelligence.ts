import type {
  BudgetIntelligenceReport,
  IntelligenceHealth
} from "@/intelligence/types/reports";
import type { ProgramProfile } from "@/types/program";
import {
  calculateRecommendedBudgetSpend,
  generateBudgetForecast,
  summarizeBudgetForecast
} from "@/utils/blueprint-recommendations";

export function analyze(profile: ProgramProfile): BudgetIntelligenceReport {
  const recommendedAllocation =
    profile.seasonBudget.recommendedAllocations ??
    calculateRecommendedBudgetSpend(profile.seasonBudget.totalDynastyPoints);
  const annualForecast =
    profile.budgetForecast ??
    generateBudgetForecast(
      profile.seasonBudget.totalDynastyPoints,
      profile.seasonBudget.allocations,
      recommendedAllocation
    );
  const summary = summarizeBudgetForecast(annualForecast);
  const budgetScore = calculateBudgetScore(profile.seasonBudget.pointsAvailable, annualForecast.reserve);

  return {
    budgetHealth: mapHealth(summary.budgetHealth),
    pointsRemaining: profile.seasonBudget.pointsAvailable,
    projectedReserve: annualForecast.reserve,
    budgetRisk: summary.highestBudgetRisk,
    currentAllocation: profile.seasonBudget.allocations,
    recommendedAllocation,
    annualForecast,
    budgetScore
  };
}

function calculateBudgetScore(pointsRemaining: number, reserve: number) {
  if (reserve >= 500) {
    return 90;
  }

  if (reserve >= 250) {
    return 84;
  }

  if (pointsRemaining > 0) {
    return 78;
  }

  return 70;
}

function mapHealth(health: "Healthy" | "Watch" | "At Risk"): IntelligenceHealth {
  if (health === "Healthy") {
    return "Healthy";
  }

  return health;
}
