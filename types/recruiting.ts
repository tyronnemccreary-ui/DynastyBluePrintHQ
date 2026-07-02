import type { NeedLevel } from "@/types/roster";
import type { CFB27Pipeline } from "@/data/pipelines";

export type PipelineStrength = "Tier 1" | "Tier 2" | "Tier 3" | "Tier 4" | "Tier 5";

export type RecruitRecommendation = "Pursue" | "Monitor" | "Pass";

export type RecruitStatus = "Open" | "Top 5" | "Top 3" | "Verbal Commit" | "Hard Commit";

export type RecruitOfferStatus = "Below Expected" | "At Expected" | "Above Expected";

export type TargetRecruit = {
  id: string;
  name: string;
  position: string;
  starRating: number;
  archetype: string;
  homeState: string;
  pipeline: CFB27Pipeline;
  pipelineStrength: PipelineStrength;
  expectedNil: number;
  currentOffer: number;
  teamNeedFit: NeedLevel;
};

export type EvaluatedRecruit = TargetRecruit & {
  recommendation: RecruitRecommendation;
  offerStatus: RecruitOfferStatus;
  interestModifier: number;
};

export type RecruitingOverview = {
  classGrade: string;
  currentCommits: number;
  openScholarships: number;
  pipelineStrength: string;
};

export type NILRecruitingGuidance = {
  approach: string;
  recommendation: string;
};

export type PipelineStrategy = {
  focusAreas: CFB27Pipeline[];
  summary: string;
};

export type RecruitingSummary = {
  body: string;
};
