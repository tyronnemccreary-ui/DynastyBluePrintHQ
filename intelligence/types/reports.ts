import type { BlueprintActualSpend, FootballOperationsBudgetForecast } from "@/types/blueprint";
import type { CFB27Pipeline } from "@/data/pipelines";
import type { NeedLevel, PositionGroup, RecruitingPriority } from "@/types/roster";

export type IntelligenceHealth = "Healthy" | "Stable" | "Watch" | "At Risk";

export type IntelligenceTrend = "Improving" | "Stable" | "Declining";

export type ProgramLetterGrade = "A" | "B+" | "B" | "C+" | "C";

export type RosterIntelligenceReport = {
  rosterHealth: IntelligenceHealth;
  positionStrengths: string[];
  positionWeaknesses: string[];
  graduationForecast: string;
  nflDepartureRisk: string;
  transferRisk: string;
  recruitingNeeds: RecruitingPriority[];
  developmentOutlook: string;
  rosterScore: number;
  positionGroups: PositionGroup[];
};

export type RecruitingBattle = {
  recruitName: string;
  position: string;
  offerStatus: string;
  priority: NeedLevel;
};

export type RecruitingIntelligenceReport = {
  recruitingHealth: IntelligenceHealth;
  scholarshipsRemaining: number;
  recruitingNeeds: RecruitingPriority[];
  priorityTargets: string[];
  recruitingBattles: RecruitingBattle[];
  pipelineStrength: string;
  nilExposure: string;
  visitStatus: string;
  recruitingScore: number;
};

export type BudgetIntelligenceReport = {
  budgetHealth: IntelligenceHealth;
  pointsRemaining: number;
  projectedReserve: number;
  budgetRisk: string;
  currentAllocation: BlueprintActualSpend;
  recommendedAllocation: BlueprintActualSpend;
  annualForecast: FootballOperationsBudgetForecast;
  budgetScore: number;
};

export type StaffIntelligenceReport = {
  staffHealth: IntelligenceHealth;
  recruitingImpact: string;
  developmentImpact: string;
  coordinatorSynergy: string;
  abilityCoverage: string[];
  hiringNeeds: string[];
  staffScore: number;
};

export type FacilitiesIntelligenceReport = {
  facilitiesHealth: IntelligenceHealth;
  recruitingImpact: string;
  playerDevelopmentImpact: string;
  maintenanceRisk: string;
  upgradePriority: string;
  facilitiesScore: number;
};

export type ProgramIntelligenceReport = {
  overallProgramHealth: number;
  letterGrade: ProgramLetterGrade;
  healthTrend: IntelligenceTrend;
  championshipReadiness: IntelligenceHealth;
  recruitingReadiness: IntelligenceHealth;
  rosterReadiness: IntelligenceHealth;
  budgetReadiness: IntelligenceHealth;
  staffingReadiness: IntelligenceHealth;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
};

export type DepartmentIntelligenceReports = {
  roster: RosterIntelligenceReport;
  recruiting: RecruitingIntelligenceReport;
  budget: BudgetIntelligenceReport;
  staff: StaffIntelligenceReport;
  facilities: FacilitiesIntelligenceReport;
};

export type FootballOperationsIntelligence = DepartmentIntelligenceReports & {
  program: ProgramIntelligenceReport;
};

export type PipelineSignal = {
  pipeline: CFB27Pipeline;
  strength: string;
};
