import type {
  FutureRosterNeeds,
  NeedLevel,
  PositionGroup,
  RosterAlert,
  RecruitingPriority
} from "@/types/roster";

const needWeight: Record<NeedLevel, number> = {
  High: 3,
  Medium: 2,
  Low: 1
};

export function generateRecruitingPriorities(
  positionGroups: PositionGroup[]
): RecruitingPriority[] {
  return [...positionGroups]
    .sort((a, b) => needWeight[b.needLevel] - needWeight[a.needLevel])
    .slice(0, 3)
    .map((group) => ({
      position: group.position,
      needLevel: group.needLevel,
      reason: buildPriorityReason(group)
    }));
}

export function generateFutureRosterNeeds(
  positionGroups: PositionGroup[]
): FutureRosterNeeds {
  const priorities = generateRecruitingPriorities(positionGroups);

  return {
    criticalNeeds: priorities.filter((priority) => priority.needLevel === "High"),
    importantNeeds: priorities.filter((priority) => priority.needLevel === "Medium"),
    depthNeeds: priorities.filter((priority) => priority.needLevel === "Low")
  };
}

export function generateRosterAlert(positionGroups: PositionGroup[]): RosterAlert {
  const topStrength =
    positionGroups.find(
      (group) => group.currentGrade === "A" && group.depthStatus === "Strong"
    ) ?? positionGroups[0];
  const topWeakness =
    [...positionGroups]
      .filter((group) => group.needLevel === "High")
      .sort((a, b) => needWeight[b.needLevel] - needWeight[a.needLevel])[0] ??
    positionGroups[0];

  return {
    topStrength: `${topStrength.position} is the clearest roster strength.`,
    topWeakness: `${topWeakness.position} is the top roster weakness.`,
    topRecruitingNeed: `${topWeakness.position} should drive the next recruiting board update.`
  };
}

export function generateRecruitingImpact(positionGroups: PositionGroup[]) {
  const priority = [...positionGroups]
    .filter((group) => group.needLevel === "High")
    .sort((a, b) => {
      if (a.depthStatus === "At Risk" && b.depthStatus !== "At Risk") {
        return -1;
      }

      if (b.depthStatus === "At Risk" && a.depthStatus !== "At Risk") {
        return 1;
      }

      return needWeight[b.needLevel] - needWeight[a.needLevel];
    })[0];

  if (!priority) {
    return "Recruiting can stay balanced because no position group currently shows critical roster pressure.";
  }

  return `${priority.position} should be a top recruiting priority because current depth projects to decline after this season.`;
}

function buildPriorityReason(group: PositionGroup) {
  if (group.needLevel === "High") {
    return `${group.position} needs immediate attention because future grade, depth status, and senior departure risk show roster pressure.`;
  }

  if (group.needLevel === "Medium") {
    return `${group.position} should stay on the board to prevent a future depth gap.`;
  }

  return `${group.position} is healthy, so only pursue clear upgrades.`;
}
