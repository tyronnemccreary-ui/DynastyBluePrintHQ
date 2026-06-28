import type {
  NILRecruitingGuidance,
  PipelineStrategy,
  RecruitingOverview,
  RecruitingSummary,
  TargetRecruit
} from "@/types/recruiting";

export const oklahomaRecruitingOverview: RecruitingOverview = {
  classGrade: "B+",
  currentCommits: 8,
  openScholarships: 14,
  pipelineStrength: "National with strong Texas/Oklahoma influence"
};

export const oklahomaTargetRecruits: TargetRecruit[] = [
  {
    id: "miles-carter",
    name: "Miles Carter",
    position: "TE",
    starRating: 4,
    archetype: "Vertical Threat",
    homeState: "Texas",
    pipelineFit: "Strong",
    nilExpectation: "Moderate",
    teamNeedFit: "High"
  },
  {
    id: "devon-harris",
    name: "Devon Harris",
    position: "LB",
    starRating: 4,
    archetype: "Field General",
    homeState: "Oklahoma",
    pipelineFit: "Strong",
    nilExpectation: "High",
    teamNeedFit: "High"
  },
  {
    id: "jaylen-brooks",
    name: "Jaylen Brooks",
    position: "CB",
    starRating: 4,
    archetype: "Man Coverage",
    homeState: "Louisiana",
    pipelineFit: "Good",
    nilExpectation: "Moderate",
    teamNeedFit: "Medium"
  },
  {
    id: "noah-williams",
    name: "Noah Williams",
    position: "WR",
    starRating: 5,
    archetype: "Deep Threat",
    homeState: "Florida",
    pipelineFit: "Limited",
    nilExpectation: "High",
    teamNeedFit: "Low"
  },
  {
    id: "caleb-price",
    name: "Caleb Price",
    position: "OL",
    starRating: 3,
    archetype: "Power Protector",
    homeState: "Texas",
    pipelineFit: "Good",
    nilExpectation: "Low",
    teamNeedFit: "Medium"
  }
];

export const oklahomaNILGuidance: NILRecruitingGuidance = {
  approach: "Aggressive but targeted",
  recommendation:
    "Spend Recruiting NIL around high-need front-seven and tight end targets first, then reserve flexibility for premium defensive backs."
};

export const oklahomaPipelineStrategy: PipelineStrategy = {
  focusAreas: ["Texas", "Oklahoma", "Louisiana", "Selective national five-star targets"],
  summary:
    "Protect the regional base while using Oklahoma's brand for selective national swings. Pipeline attention should support roster need, not chase stars in already healthy rooms."
};

export const oklahomaRecruitingSummary: RecruitingSummary = {
  body: "Oklahoma should recruit like a contender without spreading attention too thin. Tight end and linebacker are the clearest needs, while cornerback and offensive line should remain active secondary priorities."
};
