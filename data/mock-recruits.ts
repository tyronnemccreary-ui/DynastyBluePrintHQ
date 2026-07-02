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
    pipeline: "East Texas",
    pipelineStrength: "Tier 2",
    expectedNil: 250,
    currentOffer: 250,
    teamNeedFit: "High"
  },
  {
    id: "devon-harris",
    name: "Devon Harris",
    position: "LB",
    starRating: 4,
    archetype: "Field General",
    homeState: "Oklahoma",
    pipeline: "Oklahoma",
    pipelineStrength: "Tier 1",
    expectedNil: 325,
    currentOffer: 275,
    teamNeedFit: "High"
  },
  {
    id: "jaylen-brooks",
    name: "Jaylen Brooks",
    position: "CB",
    starRating: 4,
    archetype: "Man Coverage",
    homeState: "Louisiana",
    pipeline: "Louisiana",
    pipelineStrength: "Tier 3",
    expectedNil: 225,
    currentOffer: 225,
    teamNeedFit: "Medium"
  },
  {
    id: "noah-williams",
    name: "Noah Williams",
    position: "WR",
    starRating: 5,
    archetype: "Deep Threat",
    homeState: "Florida",
    pipeline: "South Florida",
    pipelineStrength: "Tier 5",
    expectedNil: 500,
    currentOffer: 350,
    teamNeedFit: "Low"
  },
  {
    id: "caleb-price",
    name: "Caleb Price",
    position: "OL",
    starRating: 3,
    archetype: "Power Protector",
    homeState: "Texas",
    pipeline: "North Texas",
    pipelineStrength: "Tier 2",
    expectedNil: 125,
    currentOffer: 150,
    teamNeedFit: "Medium"
  }
];

export const oklahomaNILGuidance: NILRecruitingGuidance = {
  approach: "Aggressive but targeted",
  recommendation:
    "Spend Recruiting NIL around high-need front-seven and tight end targets first, then reserve flexibility for premium defensive backs."
};

export const oklahomaPipelineStrategy: PipelineStrategy = {
  focusAreas: ["Oklahoma", "East Texas", "North Texas", "Louisiana"],
  summary:
    "Protect the regional base while using Oklahoma's brand for selective national swings. Pipeline attention should support roster need, not chase stars in already healthy rooms."
};

export const oklahomaRecruitingSummary: RecruitingSummary = {
  body: "Oklahoma should recruit like a contender without spreading attention too thin. Tight end and linebacker are the clearest needs, while cornerback and offensive line should remain active secondary priorities."
};
