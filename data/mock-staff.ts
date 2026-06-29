import type {
  Coordinator,
  StaffOverview,
  StaffSummary,
  SupportStaffOption
} from "@/types/staff";

export const oklahomaStaffOverview: StaffOverview = {
  headCoach: "Coach McCreary",
  offensiveCoordinator: "Graham Harrell",
  defensiveCoordinator: "Brent Venables",
  supportStaffSlots: 4,
  staffGrade: "B+",
  staffBudget: 18
};

export const oklahomaCoordinators: Coordinator[] = [
  {
    id: "graham-harrell",
    name: "Graham Harrell",
    role: "Offensive Coordinator",
    level: 28,
    archetype: "QB Developer",
    schemeFit: "Good",
    recruitingImpact: "Good",
    developmentImpact: "Excellent",
    dynastyPointCost: 6
  },
  {
    id: "brent-venables",
    name: "Brent Venables",
    role: "Defensive Coordinator",
    level: 32,
    archetype: "Defensive Architect",
    schemeFit: "Excellent",
    recruitingImpact: "Good",
    developmentImpact: "Excellent",
    dynastyPointCost: 8
  },
  {
    id: "marcus-bell",
    name: "Marcus Bell",
    role: "Offensive Coordinator",
    level: 18,
    archetype: "Recruiter",
    schemeFit: "Average",
    recruitingImpact: "Excellent",
    developmentImpact: "Average",
    dynastyPointCost: 4
  },
  {
    id: "anthony-carter",
    name: "Anthony Carter",
    role: "Defensive Coordinator",
    level: 16,
    archetype: "Talent Developer",
    schemeFit: "Good",
    recruitingImpact: "Average",
    developmentImpact: "Good",
    dynastyPointCost: 5
  }
];

export const oklahomaSupportStaff: SupportStaffOption[] = [
  {
    id: "recruiting-staff",
    type: "Recruiting Staff",
    benefit: "Improves target management and pipeline pressure.",
    cost: 4,
    bestUseCase: "Use when multiple high-priority needs are active.",
    recommendation: "Hire"
  },
  {
    id: "player-development-staff",
    type: "Player Development Staff",
    benefit: "Raises long-term growth for young contributors.",
    cost: 5,
    bestUseCase: "Use when the roster has a strong young core.",
    recommendation: "Retain"
  },
  {
    id: "nil-retention-staff",
    type: "NIL/Retention Staff",
    benefit: "Helps protect key players from roster churn.",
    cost: 4,
    bestUseCase: "Use before offseason retention risk increases.",
    recommendation: "Monitor"
  },
  {
    id: "facilities-fundraising-staff",
    type: "Facilities/Fundraising Staff",
    benefit: "Supports facility growth and long-term program investment.",
    cost: 3,
    bestUseCase: "Use when facilities are lagging the program standard.",
    recommendation: "Monitor"
  }
];

export const oklahomaStaffSummary: StaffSummary = {
  fit: "Oklahoma's staff fits a championship-contender profile. The current coordinator group supports development and scheme stability, while support staff should be used to protect recruiting execution and player growth.",
  hiringRecommendation:
    "Retain the strongest coordinator fits, prioritize recruiting support, and monitor NIL/retention staffing before the offseason roster window."
};
