export type RecommendationCategory =
  | "Recruiting"
  | "Blueprint"
  | "Staff"
  | "Facilities"
  | "Roster"
  | "Transfer Portal"
  | "Program Health";

export type RecommendationPriority = "Critical" | "High" | "Medium" | "Low";

export type FootballRecommendation = {
  id: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  title: string;
  recommendation: string;
  reason: string;
  investment?: string;
  tradeoffs: string[];
  expectedBenefit?: string;
  expectedOutcome: string;
  impactedDepartment: string;
};

export type ProgramHealth = {
  overall: number;
  roster: number;
  recruiting: number;
  blueprint: number;
  staff: number;
};
