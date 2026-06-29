export type StaffRole =
  | "Head Coach"
  | "Offensive Coordinator"
  | "Defensive Coordinator";

export type StaffFitGrade = "Excellent" | "Good" | "Average" | "Limited";

export type StaffRecommendation = "Hire" | "Retain" | "Monitor" | "Pass";

export type Coordinator = {
  id: string;
  name: string;
  role: StaffRole;
  level: number;
  archetype: string;
  schemeFit: StaffFitGrade;
  recruitingImpact: StaffFitGrade;
  developmentImpact: StaffFitGrade;
  dynastyPointCost: number;
};

export type EvaluatedCoordinator = Coordinator & {
  recommendation: StaffRecommendation;
};

export type SupportStaffType =
  | "Recruiting Staff"
  | "Player Development Staff"
  | "NIL/Retention Staff"
  | "Facilities/Fundraising Staff";

export type SupportStaffOption = {
  id: string;
  type: SupportStaffType;
  benefit: string;
  cost: number;
  bestUseCase: string;
  recommendation: StaffRecommendation;
};

export type StaffOverview = {
  headCoach: string;
  offensiveCoordinator: string;
  defensiveCoordinator: string;
  supportStaffSlots: number;
  staffGrade: string;
  staffBudget: number;
};

export type StaffSummary = {
  fit: string;
  hiringRecommendation: string;
};
