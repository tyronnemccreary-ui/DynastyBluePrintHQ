import {
  oklahomaRecruitingOverview,
  oklahomaTargetRecruits
} from "@/data/mock-recruits";
import type { RosterIntelligenceReport } from "@/intelligence/types/reports";
import type {
  IntelligenceHealth,
  RecruitingIntelligenceReport
} from "@/intelligence/types/reports";
import type { ProgramProfile } from "@/types/program";
import { evaluateTargetRecruits } from "@/utils/recruiting-recommendations";

export function analyze(
  profile: ProgramProfile,
  rosterReport: RosterIntelligenceReport
): RecruitingIntelligenceReport {
  const evaluatedRecruits = evaluateTargetRecruits(oklahomaTargetRecruits);
  const priorityTargets = evaluatedRecruits
    .filter((recruit) => recruit.recommendation === "Pursue")
    .map((recruit) => `${recruit.name} (${recruit.position})`);
  const belowExpected = evaluatedRecruits.filter(
    (recruit) => recruit.offerStatus === "Below Expected"
  );
  const scholarshipsRemaining = profile.recruiting.activated
    ? oklahomaRecruitingOverview.openScholarships
    : 35;
  const recruitingScore = calculateRecruitingScore(priorityTargets.length, belowExpected.length);

  return {
    recruitingHealth: getHealth(recruitingScore, belowExpected.length),
    scholarshipsRemaining,
    recruitingNeeds: rosterReport.recruitingNeeds,
    priorityTargets,
    recruitingBattles: evaluatedRecruits
      .filter((recruit) => recruit.recommendation !== "Pass")
      .map((recruit) => ({
        recruitName: recruit.name,
        position: recruit.position,
        offerStatus: recruit.offerStatus,
        priority: recruit.teamNeedFit
      })),
    pipelineStrength: oklahomaRecruitingOverview.pipelineStrength,
    nilExposure:
      belowExpected.length > 0
        ? `${belowExpected.length} priority target offers are below expected NIL.`
        : "Current offers are aligned with visible expected NIL.",
    visitStatus: "Visit data not active yet.",
    recruitingScore
  };
}

function calculateRecruitingScore(priorityTargetCount: number, belowExpectedCount: number) {
  return Math.max(70, Math.min(94, 84 + priorityTargetCount * 2 - belowExpectedCount * 3));
}

function getHealth(score: number, belowExpectedCount: number): IntelligenceHealth {
  if (score >= 88 && belowExpectedCount === 0) {
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
