import type { FootballOperationsIntelligence } from "@/intelligence/types/reports";
import type { ProgramProfile } from "@/types/program";
import type {
  FootballRecommendation,
  RecommendationPriority
} from "@/types/recommendation";
import type { PositionGroup, RosterGrade } from "@/types/roster";

const gradeRank: Record<RosterGrade | string, number> = {
  A: 5,
  "B+": 4,
  B: 3,
  "B-": 2.5,
  "C+": 2,
  C: 1
};

export const operationsPriorityRank: Record<RecommendationPriority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

export function sortOperationsRecommendations(
  recommendations: FootballRecommendation[]
) {
  return [...recommendations].sort(
    (a, b) => operationsPriorityRank[b.priority] - operationsPriorityRank[a.priority]
  );
}

export function isOperationsGradeBelow(grade: string, baseline: string) {
  return (gradeRank[grade] ?? 0) < (gradeRank[baseline] ?? 0);
}

export function evaluateQuarterbackFuture(
  groups: PositionGroup[]
): FootballRecommendation | null {
  const quarterback = groups.find((group) => group.position === "QB");

  if (!quarterback || !isOperationsGradeBelow(quarterback.futureGrade, "B+")) {
    return null;
  }

  return {
    id: "ops-qb-future-recruiting",
    category: "Recruiting",
    priority: "High",
    title: "Prioritize Quarterback Recruiting",
    recommendation:
      "Add a developmental quarterback before the room falls below the program standard.",
    reason:
      "The future quarterback grade is below championship level for a program with Oklahoma's expectations.",
    tradeoffs: [
      "This reduces attention available for lower-risk offensive rooms.",
      "Ignoring it may force a more expensive Transfer Portal correction later."
    ],
    expectedOutcome:
      "A young quarterback creates succession stability and gives the staff time to develop the next starter.",
    impactedDepartment: "Recruiting Command Center"
  };
}

export function evaluateFacilitiesInvestment(
  intelligence: FootballOperationsIntelligence
): FootballRecommendation | null {
  if (
    intelligence.budget.pointsRemaining <= 0 ||
    !["Watch", "At Risk"].includes(intelligence.facilities.facilitiesHealth)
  ) {
    return null;
  }

  return {
    id: "ops-protect-facility-investment",
    category: "Facilities",
    priority: "Medium",
    title: "Protect Facility Investment",
    recommendation:
      "Reserve Blueprint resources for facilities before expanding optional spending.",
    reason:
      "AD expectations and contender standards require facilities to stay aligned with player development goals.",
    tradeoffs: [
      "Facilities spending may slow short-term NIL flexibility.",
      "Ignoring facilities increases the risk of losing development edge over multiple seasons."
    ],
    expectedOutcome:
      "Maintaining facilities protects long-term player growth and supports the program's national standard.",
    impactedDepartment: "Program Office"
  };
}

export function evaluateBudgetRecruitingROI(
  intelligence: FootballOperationsIntelligence
): FootballRecommendation | null {
  const highNeedGroup = intelligence.roster.positionGroups.find(
    (group) => group.needLevel === "High" && ["OL", "QB", "DL", "LB", "CB"].includes(group.position)
  );
  const recommendedRecruitingNil = intelligence.budget.recommendedAllocation.recruitingNil;
  const currentRecruitingNil = intelligence.budget.currentAllocation.recruitingNil;
  const investment = Math.max(0, recommendedRecruitingNil - currentRecruitingNil);

  if (!highNeedGroup || investment <= 0) {
    return null;
  }

  return {
    id: "ops-budget-recruiting-nil-roi",
    category: "Blueprint",
    priority: highNeedGroup.depthStatus === "At Risk" ? "Critical" : "High",
    title: `Increase Recruiting NIL by ${investment}`,
    recommendation: `Move ${investment} Dynasty Points into Recruiting NIL before the board reaches the final decision window.`,
    reason: `${highNeedGroup.position} is a high-need position group, and the current Recruiting NIL allocation is below the recommended annual budget split.`,
    investment: `${investment} Dynasty Points`,
    tradeoffs: [
      "Delay lower-priority facility or staff spending until the next offseason.",
      "Ignoring this gap may leave the staff short when priority recruits compare offers."
    ],
    expectedBenefit: `Higher probability of landing priority ${highNeedGroup.position} targets without forcing a late Transfer Portal correction.`,
    expectedOutcome: `Recruiting NIL aligns with the roster need at ${highNeedGroup.position} while preserving a clearer annual budget plan.`,
    impactedDepartment: "Football Operations Budget"
  };
}

export function evaluateOffensiveLineDepth(
  groups: PositionGroup[]
): FootballRecommendation | null {
  const offensiveLine = groups.find((group) => group.position === "OL");

  if (!offensiveLine || !["Thin", "At Risk"].includes(offensiveLine.depthStatus)) {
    return null;
  }

  return {
    id: "ops-offensive-line-depth",
    category: "Roster",
    priority: "High",
    title: "Prioritize Offensive Line Recruiting",
    recommendation:
      "Move offensive line into the priority recruiting board until the future two-deep stabilizes.",
    reason:
      "Weak offensive line depth can damage offensive continuity faster than most skill-position gaps.",
    tradeoffs: [
      "This may reduce recruiting emphasis at a healthier position group.",
      "Ignoring it increases the chance of starting inexperienced linemen next season."
    ],
    expectedOutcome:
      "Improved offensive line depth keeps the offense stable and reduces emergency portal dependence.",
    impactedDepartment: "Roster Intelligence"
  };
}

export function evaluateDefensiveLineRecruiting(): FootballRecommendation | null {
  return null;
}

export function evaluateRecruitingBoardGaps(
  intelligence: FootballOperationsIntelligence
): FootballRecommendation | null {
  const defensiveLineNeed = intelligence.roster.recruitingNeeds.find(
    (need) => need.position === "DL"
  );

  if (!defensiveLineNeed) {
    return null;
  }

  return {
    id: "ops-defensive-line-recruiting-gap",
    category: "Recruiting",
    priority: "High",
    title: "Shift Resources to Defensive Line",
    recommendation:
      "Add defensive line prospects to the active recruiting board before the class hardens.",
    reason:
      "The current mock recruiting class has no defensive line target despite defensive front depth carrying medium need.",
    tradeoffs: [
      "Adding defensive line targets can reduce NIL and attention for secondary options.",
      "Ignoring the gap may force the staff to solve defensive front depth through transfers."
    ],
    expectedOutcome:
      "A defensive line addition balances the class and protects future front-seven depth.",
    impactedDepartment: "Recruiting Command Center"
  };
}

export function evaluateHighRiskRosterGroups(
  groups: PositionGroup[]
): FootballRecommendation[] {
  return groups
    .filter((group) => group.needLevel === "High")
    .map((group) => ({
      id: `ops-${group.position.toLowerCase()}-roster-risk`,
      category: "Roster",
      priority: group.depthStatus === "At Risk" ? "Critical" : "High",
      title: `Address ${group.position} Roster Risk`,
      recommendation: `Treat ${group.position} as a priority in recruiting and keep a portal contingency active.`,
      reason: `${group.position} shows high need with ${group.futureGrade} future grade and ${group.depthStatus.toLowerCase()} depth.`,
      tradeoffs: [
        "Prioritizing this room limits resources available for luxury upgrades.",
        "Ignoring the risk may create a forced transfer pursuit later."
      ],
      expectedOutcome: `Stabilizing ${group.position} improves future roster balance and protects the program from depth volatility.`,
      impactedDepartment: "Roster Intelligence"
    }));
}

export function evaluateTransferPortalContingency(
  intelligence: FootballOperationsIntelligence
): FootballRecommendation | null {
  const atRiskGroup = intelligence.roster.positionGroups.find(
    (group) => group.depthStatus === "At Risk"
  );

  if (!atRiskGroup) {
    return null;
  }

  return {
    id: "ops-transfer-contingency",
    category: "Transfer Portal",
    priority: "Medium",
    title: `Maintain ${atRiskGroup.position} Portal Contingency`,
    recommendation:
      "Keep portal evaluation active as a backup plan while recruiting remains the first solution.",
    reason:
      "The roster has an at-risk position group and a defined transfer budget available.",
    tradeoffs: [
      "Portal pursuit can reduce development reps for younger players.",
      "Ignoring the portal leaves fewer options if recruiting misses late."
    ],
    expectedOutcome:
      "A controlled portal contingency gives the staff flexibility without making transfers the primary roster plan.",
    impactedDepartment: "Transfer Portal"
  };
}

export function evaluateStaffSupport(
  intelligence: FootballOperationsIntelligence
): FootballRecommendation | null {
  if (!["Watch", "At Risk"].includes(intelligence.staff.staffHealth)) {
    return null;
  }

  return {
    id: "ops-staff-support-investment",
    category: "Staff",
    priority: "Medium",
    title: "Strengthen Staff Support",
    recommendation:
      "Use staff budget on recruiting and player development support before expanding lower-impact staff roles.",
    reason:
      "The staff grade is solid but not elite, and the program is managing high recruiting and development demands.",
    tradeoffs: [
      "Staff spending may delay other Blueprint improvements.",
      "Ignoring support staff can reduce execution quality across recruiting and development."
    ],
    expectedOutcome:
      "Better support staff improves operational consistency and helps the coordinators convert talent into production.",
    impactedDepartment: "Staff Management"
  };
}

export function evaluateProgramHealth(
  intelligence: FootballOperationsIntelligence
): FootballRecommendation | null {
  if (intelligence.program.overallProgramHealth >= 84) {
    return null;
  }

  return {
    id: "ops-program-health-recruiting-base",
    category: "Program Health",
    priority: "Low",
    title: "Protect Program Health Through Recruiting",
    recommendation:
      "Keep recruiting investment ahead of optional facility or staff upgrades until class quality stabilizes.",
    reason:
      "Program health depends on talent flow matching prestige and AD expectations.",
    tradeoffs: [
      "Recruiting investment can slow improvements in other departments.",
      "Ignoring class quality weakens long-term roster health."
    ],
    expectedOutcome:
      "A stable recruiting base keeps program health aligned with long-term contender expectations.",
    impactedDepartment: "War Room"
  };
}

export function buildFootballOperationsRecommendations(
  _profile: ProgramProfile,
  intelligence: FootballOperationsIntelligence
) {
  const groups = intelligence.roster.positionGroups;
  const recommendations: Array<FootballRecommendation | null> = [
    evaluateBudgetRecruitingROI(intelligence),
    evaluateQuarterbackFuture(groups),
    evaluateFacilitiesInvestment(intelligence),
    evaluateOffensiveLineDepth(groups),
    evaluateRecruitingBoardGaps(intelligence),
    evaluateTransferPortalContingency(intelligence),
    evaluateStaffSupport(intelligence),
    evaluateProgramHealth(intelligence),
    ...evaluateHighRiskRosterGroups(groups)
  ];

  return recommendations.filter(
    (recommendation): recommendation is FootballRecommendation =>
      recommendation !== null
  );
}
