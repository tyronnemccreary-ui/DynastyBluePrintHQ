import type { School } from "@/types/school";
import type { PositionGroup, RosterGrade } from "@/types/roster";
import type {
  FootballRecommendation,
  RecommendationPriority
} from "@/types/recommendation";

const gradeRank: Record<RosterGrade | string, number> = {
  A: 5,
  "B+": 4,
  B: 3,
  "B-": 2.5,
  "C+": 2,
  C: 1
};

export const priorityRank: Record<RecommendationPriority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

export function isGradeBelow(grade: string, baseline: string) {
  return (gradeRank[grade] ?? 0) < (gradeRank[baseline] ?? 0);
}

export function sortRecommendations(
  recommendations: FootballRecommendation[]
): FootballRecommendation[] {
  return [...recommendations].sort(
    (a, b) => priorityRank[b.priority] - priorityRank[a.priority]
  );
}

export function quarterbackRecruitingRule(
  groups: PositionGroup[]
): FootballRecommendation | null {
  const quarterback = groups.find((group) => group.position === "QB");

  if (!quarterback || !isGradeBelow(quarterback.futureGrade, "B")) {
    return null;
  }

  return {
    id: "prioritize-quarterback-recruiting",
    category: "Recruiting",
    priority: "Critical",
    title: "Recruit a Quarterback",
    recommendation:
      "Prioritize a quarterback prospect who can develop before the future depth chart becomes urgent.",
    reason:
      "Your quarterback room projects below championship level after next season.",
    tradeoffs: [
      "A quarterback target will take attention away from another position group.",
      "Ignoring this need may force you into the Transfer Portal later."
    ],
    expectedOutcome:
      "Adding a young quarterback now creates development time and protects long-term roster stability.",
    impactedDepartment: "Recruiting Command Center"
  };
}

export function facilitiesInvestmentRule(school: School): FootballRecommendation | null {
  if (
    school.blueprintSnapshot.availableDynastyPoints <= 500 ||
    !isGradeBelow(school.facilities.grade, "B")
  ) {
    return null;
  }

  return {
    id: "invest-in-facilities",
    category: "Facilities",
    priority: "High",
    title: "Invest in Facilities",
    recommendation:
      "Commit Dynasty Points to facilities before expanding lower-impact spending areas.",
    reason:
      "You have enough Dynasty Points to materially improve the development environment, and facilities grade below the expected baseline.",
    tradeoffs: [
      "Facilities spending improves the program foundation but may not solve immediate roster gaps.",
      "Delaying upgrades can limit development gains for multiple recruiting classes."
    ],
    expectedOutcome:
      "Improved facilities should support stronger player development and make future roster building more stable.",
    impactedDepartment: "Program Office"
  };
}

export function offensiveLineDepthRule(
  groups: PositionGroup[]
): FootballRecommendation | null {
  const offensiveLine = groups.find((group) => group.position === "OL");

  if (!offensiveLine || !["Thin", "At Risk"].includes(offensiveLine.depthStatus)) {
    return null;
  }

  return {
    id: "prioritize-offensive-line-recruiting",
    category: "Recruiting",
    priority: "High",
    title: "Prioritize Offensive Line Recruiting",
    recommendation:
      "Keep offensive line recruiting active until the depth profile is stable.",
    reason:
      "Offensive line depth is weak enough to threaten future offensive consistency.",
    tradeoffs: [
      "Pushing offensive line recruiting may reduce resources for skill-position upgrades.",
      "Waiting too long can leave the roster dependent on emergency portal additions."
    ],
    expectedOutcome:
      "Adding offensive line depth now protects the offense from short-term injuries and future graduation losses.",
    impactedDepartment: "Recruiting Command Center"
  };
}

export function prestigeInvestmentRule(school: School): FootballRecommendation | null {
  if (school.prestige >= 4) {
    return null;
  }

  return {
    id: "invest-in-recruiting-before-facilities",
    category: "Blueprint",
    priority: "High",
    title: "Invest in Recruiting Before Facilities",
    recommendation:
      "Use early Blueprint resources to improve recruiting reach before making major facilities bets.",
    reason:
      "Programs below four-star prestige need talent acquisition momentum before facility spending can fully pay off.",
    tradeoffs: [
      "Recruiting investment can raise roster quality faster, but facilities may lag temporarily.",
      "Facilities upgrades are still important, but they should not outrank talent access yet."
    ],
    expectedOutcome:
      "Improved recruiting focus should help raise the talent floor and make later facility investments more valuable.",
    impactedDepartment: "Blueprint Planner"
  };
}

export function staffImprovementRule(staffRating: string): FootballRecommendation | null {
  if (!isGradeBelow(staffRating, "B")) {
    return null;
  }

  return {
    id: "improve-coordinator-talent",
    category: "Staff",
    priority: "High",
    title: "Improve Coordinator Talent",
    recommendation:
      "Evaluate coordinator quality before committing the next major resource cycle.",
    reason:
      "Staff rating is below the baseline needed to support championship-level player development and game planning.",
    tradeoffs: [
      "Staff upgrades can consume resources that might otherwise go to facilities or NIL.",
      "Keeping a weaker staff may reduce the value of strong recruiting classes."
    ],
    expectedOutcome:
      "Improved coordinator talent should raise development consistency and make roster strengths easier to convert into wins.",
    impactedDepartment: "Staff Management"
  };
}

export function highNeedPositionRule(group: PositionGroup): FootballRecommendation | null {
  if (group.needLevel !== "High") {
    return null;
  }

  return {
    id: `address-${group.position.toLowerCase()}-roster-need`,
    category: "Roster",
    priority: group.depthStatus === "At Risk" ? "Critical" : "High",
    title: `Address ${group.position} Roster Risk`,
    recommendation: `Prioritize ${group.position} recruiting and monitor portal options if the board does not develop.`,
    reason: `${group.position} has a high need level with a ${group.futureGrade} future grade and ${group.depthStatus.toLowerCase()} depth status.`,
    tradeoffs: [
      "Committing resources here can slow movement at healthier position groups.",
      "Waiting may force a more expensive Transfer Portal solution later."
    ],
    expectedOutcome: `Improving ${group.position} depth should reduce future roster volatility and protect program standards.`,
    impactedDepartment: "Roster Intelligence"
  };
}

export function transferPortalFallbackRule(
  groups: PositionGroup[]
): FootballRecommendation | null {
  const atRiskGroup = groups.find((group) => group.depthStatus === "At Risk");

  if (!atRiskGroup) {
    return null;
  }

  return {
    id: `monitor-${atRiskGroup.position.toLowerCase()}-portal-market`,
    category: "Transfer Portal",
    priority: "Medium",
    title: `Monitor ${atRiskGroup.position} Portal Market`,
    recommendation:
      "Track transfer options as a contingency while recruiting remains the first move.",
    reason: `${atRiskGroup.position} is at risk from a depth perspective, so the portal should be a fallback plan if recruiting misses.`,
    tradeoffs: [
      "Portal additions can solve immediate gaps but may cost development reps for younger players.",
      "Using the portal too early can reduce long-term roster continuity."
    ],
    expectedOutcome:
      "Maintaining a portal contingency gives the staff a second path if the high school recruiting board does not close.",
    impactedDepartment: "Transfer Portal"
  };
}
