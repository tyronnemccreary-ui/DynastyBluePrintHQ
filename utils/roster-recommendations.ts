import type {
  NeedLevel,
  PositionGroup,
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

function buildPriorityReason(group: PositionGroup) {
  if (group.needLevel === "High") {
    return `${group.position} needs immediate attention because future grade and depth status show roster risk.`;
  }

  if (group.needLevel === "Medium") {
    return `${group.position} should stay on the board to prevent a future depth gap.`;
  }

  return `${group.position} is healthy, so only pursue clear upgrades.`;
}
