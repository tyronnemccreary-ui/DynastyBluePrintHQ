export type RosterGrade = "A" | "B+" | "B" | "C+" | "C";

export type DepthStatus = "Strong" | "Stable" | "Thin" | "At Risk";

export type DevelopmentOutlook = "Excellent" | "Strong" | "Steady" | "Needs Attention";

export type NeedLevel = "Low" | "Medium" | "High";

export type PositionGroup = {
  position: string;
  currentGrade: RosterGrade;
  futureGrade: RosterGrade;
  depthStatus: DepthStatus;
  developmentOutlook: DevelopmentOutlook;
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
