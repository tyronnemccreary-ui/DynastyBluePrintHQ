import type { NeedLevel } from "@/types/roster";

export type TransferYear = "Freshman" | "Sophomore" | "Junior" | "Senior";

export type ProjectedImpact =
  | "Immediate Starter"
  | "Strong Rotation"
  | "Development Prospect"
  | "Not Recommended";

export type TransferRecommendation = "Should Pursue" | "Maybe Pursue" | "Pass";

export type TransferFitGrade = "Excellent" | "Good" | "Limited";

export type TransferPlayer = {
  id: string;
  name: string;
  position: string;
  overallRating: number;
  year: TransferYear;
  archetype: string;
  previousSchool: string;
  projectedImpact: ProjectedImpact;
  positionNeed: NeedLevel;
  schemeFit: TransferFitGrade;
  rosterFit: TransferFitGrade;
  developmentTimeline: string;
  scholarshipValue: TransferFitGrade;
};

export type EvaluatedTransfer = TransferPlayer & {
  recommendation: TransferRecommendation;
  explanation: string;
};

export type TransferPortalOverview = {
  totalAvailableTransfers: number;
  teamPositionNeeds: string[];
  availableScholarships: number;
  currentRecruitingClassSize: number;
  transferBudget: number;
};

export type TransferSummary = {
  body: string;
};
