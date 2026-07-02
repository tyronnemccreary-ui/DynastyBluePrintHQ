import type {
  EvaluatedRecruit,
  PipelineStrength,
  RecruitOfferStatus,
  RecruitRecommendation,
  TargetRecruit
} from "@/types/recruiting";
import type { NeedLevel, RecruitingPriority } from "@/types/roster";

const needScore: Record<NeedLevel, number> = {
  High: 3,
  Medium: 2,
  Low: 1
};

const pipelineScore: Record<PipelineStrength, number> = {
  "Tier 1": 4,
  "Tier 2": 3,
  "Tier 3": 2,
  "Tier 4": 1,
  "Tier 5": 0
};

const highNilAskThreshold = 350;

export function evaluateTargetRecruits(recruits: TargetRecruit[]): EvaluatedRecruit[] {
  return recruits.map((recruit) => {
    const offerStatus = calculateOfferStatus(recruit.currentOffer, recruit.expectedNil);

    return {
      ...recruit,
      offerStatus,
      interestModifier: calculateInterestModifier(offerStatus),
      recommendation: recommendRecruit(recruit)
    };
  });
}

export function getTopPositionNeeds(priorities: RecruitingPriority[]) {
  return priorities.map((priority) => priority.position).join(", ");
}

function recommendRecruit(recruit: TargetRecruit): RecruitRecommendation {
  const score =
    needScore[recruit.teamNeedFit] +
    pipelineScore[recruit.pipelineStrength] +
    starScore(recruit.starRating) -
    nilExpectationCost(recruit.expectedNil) +
    offerFitScore(recruit.currentOffer, recruit.expectedNil);

  if (score >= 5) {
    return "Pursue";
  }

  if (score >= 3) {
    return "Monitor";
  }

  return "Pass";
}

export function calculateOfferStatus(
  currentOffer: number,
  expectedNil: number
): RecruitOfferStatus {
  if (currentOffer < expectedNil) {
    return "Below Expected";
  }

  if (currentOffer > expectedNil) {
    return "Above Expected";
  }

  return "At Expected";
}

export function calculateInterestModifier(status: RecruitOfferStatus) {
  if (status === "Above Expected") {
    return 1;
  }

  if (status === "Below Expected") {
    return -1;
  }

  return 0;
}

function offerFitScore(currentOffer: number, expectedNil: number) {
  const status = calculateOfferStatus(currentOffer, expectedNil);

  if (status === "Below Expected") {
    return -1;
  }

  if (status === "Above Expected") {
    return 1;
  }

  return 0;
}

function nilExpectationCost(expectedNil: number) {
  return expectedNil >= highNilAskThreshold ? 1 : 0;
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
