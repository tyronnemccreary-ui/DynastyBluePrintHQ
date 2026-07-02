export type RosterGrade = "A" | "B+" | "B" | "C+" | "C";

export type DepthStatus = "Strong" | "Stable" | "Thin" | "At Risk";

export type DevelopmentOutlook = "Excellent" | "Strong" | "Steady" | "Needs Attention";

export type NeedLevel = "Low" | "Medium" | "High";

export type RosterYear = "FR" | "SO" | "JR" | "SR";

export type DevelopmentTrait = "Normal" | "Impact" | "Star" | "Elite";

export type ProjectedRole = "Starter" | "Rotation" | "Development" | "Depth";

export type RosterPlayer = {
  playerId: string;
  name: string;
  position: string;
  overall: number;
  year: RosterYear;
  archetype: string;
  developmentTrait: DevelopmentTrait;
  projectedRole: ProjectedRole;
  eligibilityRemaining: number;
};

export type PositionGroup = {
  position: string;
  currentGrade: RosterGrade;
  futureGrade: RosterGrade;
  depthStatus: DepthStatus;
  developmentOutlook: DevelopmentOutlook;
  seniorDepartureRisk: NeedLevel;
  needLevel: NeedLevel;
};

export type RosterOverview = {
  overallGrade: RosterGrade;
  offensiveGrade: RosterGrade;
  defensiveGrade: RosterGrade;
  depthGrade: RosterGrade;
  developmentOutlook: DevelopmentOutlook;
};

export type PlayerProgressionSnapshot = {
  youngCoreStrength: string;
  seniorDepartureRisk: string;
  developmentUpside: string;
  facilityImpact: string;
  staffImpact: string;
};

export type MockRosterProfile = {
  players: RosterPlayer[];
  overview: RosterOverview;
  positionGroups: PositionGroup[];
  progression: PlayerProgressionSnapshot;
  recommendationSummary: string;
};

export type RecruitingPriority = {
  position: string;
  needLevel: NeedLevel;
  reason: string;
};

export type FutureRosterNeeds = {
  criticalNeeds: RecruitingPriority[];
  importantNeeds: RecruitingPriority[];
  depthNeeds: RecruitingPriority[];
};

export type RosterAlert = {
  topStrength: string;
  topWeakness: string;
  topRecruitingNeed: string;
};
