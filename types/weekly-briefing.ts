import type { FootballRecommendation } from "@/types/recommendation";

export type DepartmentReport = {
  departmentName: string;
  status: string;
  keyObservation: string;
  recommendedFocus: string;
};

export type WeeklyOperationsBriefing = {
  executiveSummary: string;
  departmentReports: DepartmentReport[];
  topDecisions: FootballRecommendation[];
};
