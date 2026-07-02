import type {
  DepartmentIntelligenceReports,
  IntelligenceHealth,
  IntelligenceTrend,
  ProgramIntelligenceReport,
  ProgramLetterGrade
} from "@/intelligence/types/reports";

export function calculateProgramIntelligence(
  reports: DepartmentIntelligenceReports
): ProgramIntelligenceReport {
  const overallProgramHealth = Math.round(
    reports.roster.rosterScore * 0.28 +
      reports.recruiting.recruitingScore * 0.22 +
      reports.budget.budgetScore * 0.2 +
      reports.staff.staffScore * 0.15 +
      reports.facilities.facilitiesScore * 0.15
  );

  return {
    overallProgramHealth,
    letterGrade: getLetterGrade(overallProgramHealth),
    healthTrend: getHealthTrend(reports),
    championshipReadiness: getReadiness(overallProgramHealth),
    recruitingReadiness: reports.recruiting.recruitingHealth,
    rosterReadiness: reports.roster.rosterHealth,
    budgetReadiness: reports.budget.budgetHealth,
    staffingReadiness: reports.staff.staffHealth,
    strengths: getTopStrengths(reports),
    weaknesses: getTopWeaknesses(reports),
    opportunities: getTopOpportunities(reports)
  };
}

function getTopStrengths(reports: DepartmentIntelligenceReports) {
  return [
    reports.roster.positionStrengths[0] ?? "Roster has a stable foundation.",
    reports.recruiting.pipelineStrength,
    reports.staff.coordinatorSynergy,
    reports.facilities.recruitingImpact,
    `${reports.budget.pointsRemaining} Dynasty Points remain available.`
  ].slice(0, 3);
}

function getTopWeaknesses(reports: DepartmentIntelligenceReports) {
  return [
    reports.roster.positionWeaknesses[0] ?? "No urgent roster weakness is active.",
    reports.budget.budgetRisk,
    reports.recruiting.nilExposure,
    reports.facilities.maintenanceRisk,
    reports.staff.hiringNeeds[0] ?? "No urgent staff weakness is active."
  ].slice(0, 3);
}

function getTopOpportunities(reports: DepartmentIntelligenceReports) {
  const topNeed = reports.roster.recruitingNeeds[0];

  return [
    topNeed
      ? `Use recruiting resources to stabilize ${topNeed.position}.`
      : "Keep recruiting balanced across future depth.",
    `Protect a projected reserve of ${reports.budget.projectedReserve} Dynasty Points.`,
    reports.facilities.upgradePriority,
    reports.staff.recruitingImpact
  ].slice(0, 3);
}

function getLetterGrade(score: number): ProgramLetterGrade {
  if (score >= 90) {
    return "A";
  }

  if (score >= 86) {
    return "B+";
  }

  if (score >= 82) {
    return "B";
  }

  if (score >= 76) {
    return "C+";
  }

  return "C";
}

function getReadiness(score: number): IntelligenceHealth {
  if (score >= 88) {
    return "Healthy";
  }

  if (score >= 82) {
    return "Stable";
  }

  if (score >= 76) {
    return "Watch";
  }

  return "At Risk";
}

function getHealthTrend(reports: DepartmentIntelligenceReports): IntelligenceTrend {
  const atRiskCount = [
    reports.roster.rosterHealth,
    reports.recruiting.recruitingHealth,
    reports.budget.budgetHealth,
    reports.staff.staffHealth,
    reports.facilities.facilitiesHealth
  ].filter((health) => health === "At Risk").length;

  if (atRiskCount > 1) {
    return "Declining";
  }

  if (reports.roster.rosterHealth === "Healthy" && reports.recruiting.recruitingHealth === "Healthy") {
    return "Improving";
  }

  return "Stable";
}
