import type { NeedLevel } from "@/types/roster";

export type PipelineFit = "Strong" | "Good" | "Limited";

export type NILExpectation = "High" | "Moderate" | "Low";

export type RecruitRecommendation = "Pursue" | "Monitor" | "Pass";

export type TargetRecruit = {
  id: string;
  name: string;
  position: string;
  starRating: number;
  archetype: string;
  homeState: string;
  pipelineFit: PipelineFit;
  nilExpectation: NILExpectation;
  teamNeedFit: NeedLevel;
};

export type EvaluatedRecruit = TargetRecruit & {
  recommendation: RecruitRecommendation;
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
  focusAreas: string[];
  summary: string;
};

export type RecruitingSummary = {
  body: string;
};
