import { oklahomaMockRoster } from "@/data/mock-roster";
import type { ProgramProfile } from "@/types/program";
import type { NeedLevel, PositionGroup, RosterGrade } from "@/types/roster";
import type { RosterIntelligenceReport, IntelligenceHealth } from "@/intelligence/types/reports";
import { generateRecruitingPriorities } from "@/utils/roster-recommendations";

const gradeScore: Record<RosterGrade, number> = {
  A: 94,
  "B+": 87,
  B: 82,
  "C+": 76,
  C: 70
};

const needWeight: Record<NeedLevel, number> = {
  High: 3,
  Medium: 2,
  Low: 1
};

export function analyze(profile: ProgramProfile): RosterIntelligenceReport {
  const roster = profile.roster.data ?? oklahomaMockRoster;
  const highNeedGroups = roster.positionGroups.filter((group) => group.needLevel === "High");
  const atRiskGroups = roster.positionGroups.filter((group) => group.depthStatus === "At Risk");
  const rosterScore = calculateRosterScore(roster.positionGroups);

  return {
    rosterHealth: getHealth(rosterScore, atRiskGroups.length),
    positionStrengths: roster.positionGroups
      .filter((group) => group.currentGrade === "A" || group.depthStatus === "Strong")
      .slice(0, 3)
      .map((group) => `${group.position}: ${group.currentGrade} current grade`),
    positionWeaknesses: [...highNeedGroups, ...atRiskGroups]
      .filter((group, index, groups) =>
        groups.findIndex((candidate) => candidate.position === group.position) === index
      )
      .slice(0, 3)
      .map((group) => `${group.position}: ${group.depthStatus} depth`),
    graduationForecast:
      highNeedGroups.length > 0
        ? `${highNeedGroups.map((group) => group.position).join(", ")} carry the highest graduation pressure.`
        : "Graduation pressure is manageable across the current roster.",
    nflDepartureRisk:
      roster.overview.overallGrade === "A" ? "Elevated for top-end starters." : "Moderate.",
    transferRisk:
      atRiskGroups.length > 0
        ? `${atRiskGroups.map((group) => group.position).join(", ")} need portal contingency.`
        : "No immediate transfer dependency is projected.",
    recruitingNeeds: generateRecruitingPriorities(roster.positionGroups),
    developmentOutlook: roster.overview.developmentOutlook,
    rosterScore,
    positionGroups: roster.positionGroups
  };
}

function calculateRosterScore(groups: PositionGroup[]) {
  if (groups.length === 0) {
    return 70;
  }

  const total = groups.reduce((score, group) => {
    const base = gradeScore[group.currentGrade];
    const future = gradeScore[group.futureGrade];
    const depthPenalty = group.depthStatus === "At Risk" ? 10 : group.depthStatus === "Thin" ? 6 : 0;
    const needPenalty = needWeight[group.needLevel] * 2;

    return score + Math.max(60, Math.round((base + future) / 2) - depthPenalty - needPenalty);
  }, 0);

  return Math.round(total / groups.length);
}

function getHealth(score: number, atRiskCount: number): IntelligenceHealth {
  if (score >= 88 && atRiskCount === 0) {
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
