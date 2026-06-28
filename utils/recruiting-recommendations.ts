import type {
  EvaluatedRecruit,
  NILExpectation,
  PipelineFit,
  RecruitRecommendation,
  TargetRecruit
} from "@/types/recruiting";
import type { NeedLevel, RecruitingPriority } from "@/types/roster";

const needScore: Record<NeedLevel, number> = {
  High: 3,
  Medium: 2,
  Low: 1
};

const pipelineScore: Record<PipelineFit, number> = {
  Strong: 2,
  Good: 1,
  Limited: 0
};

const nilCost: Record<NILExpectation, number> = {
  High: 1,
  Moderate: 0,
  Low: 0
};

export function evaluateTargetRecruits(recruits: TargetRecruit[]): EvaluatedRecruit[] {
  return recruits.map((recruit) => ({
    ...recruit,
    recommendation: recommendRecruit(recruit)
  }));
}

export function getTopPositionNeeds(priorities: RecruitingPriority[]) {
  return priorities.map((priority) => priority.position).join(", ");
}

function recommendRecruit(recruit: TargetRecruit): RecruitRecommendation {
  const score =
    needScore[recruit.teamNeedFit] +
    pipelineScore[recruit.pipelineFit] +
    starScore(recruit.starRating) -
    nilCost[recruit.nilExpectation];

  if (score >= 5) {
    return "Pursue";
  }

  if (score >= 3) {
    return "Monitor";
  }

  return "Pass";
}

function starScore(stars: number) {
  if (stars >= 5) {
    return 2;
  }

  if (stars >= 4) {
    return 1;
  }

  return 0;
}
