import type {
  Coordinator,
  EvaluatedCoordinator,
  StaffFitGrade,
  StaffRecommendation
} from "@/types/staff";

const fitScore: Record<StaffFitGrade, number> = {
  Excellent: 3,
  Good: 2,
  Average: 1,
  Limited: 0
};

export function evaluateCoordinators(
  coordinators: Coordinator[]
): EvaluatedCoordinator[] {
  return coordinators.map((coordinator) => ({
    ...coordinator,
    recommendation: getCoordinatorRecommendation(coordinator)
  }));
}

function getCoordinatorRecommendation(coordinator: Coordinator): StaffRecommendation {
  const score =
    fitScore[coordinator.schemeFit] +
    fitScore[coordinator.recruitingImpact] +
    fitScore[coordinator.developmentImpact] +
    levelScore(coordinator.level) -
    costPenalty(coordinator.dynastyPointCost);

  if (score >= 8) {
    return "Hire";
  }

  if (score >= 6) {
    return "Retain";
  }

  if (score >= 4) {
    return "Monitor";
  }

  return "Pass";
}

function levelScore(level: number) {
  if (level >= 30) {
    return 2;
  }

  if (level >= 20) {
    return 1;
  }

  return 0;
}

function costPenalty(cost: number) {
  return cost >= 8 ? 1 : 0;
}
