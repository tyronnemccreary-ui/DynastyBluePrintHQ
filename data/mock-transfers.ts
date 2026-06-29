import type {
  TransferPlayer,
  TransferPortalOverview,
  TransferSummary
} from "@/types/transfer";

export const oklahomaTransferOverview: TransferPortalOverview = {
  totalAvailableTransfers: 42,
  teamPositionNeeds: ["TE", "LB", "CB"],
  availableScholarships: 6,
  currentRecruitingClassSize: 8,
  transferBudget: 9
};

export const oklahomaTransferTargets: TransferPlayer[] = [
  {
    id: "marcus-fields",
    name: "Marcus Fields",
    position: "LB",
    overallRating: 86,
    year: "Junior",
    archetype: "Run Stopper",
    previousSchool: "Missouri",
    projectedImpact: "Immediate Starter",
    positionNeed: "High",
    schemeFit: "Excellent",
    rosterFit: "Excellent",
    developmentTimeline: "Immediate",
    scholarshipValue: "Excellent"
  },
  {
    id: "eli-carter",
    name: "Eli Carter",
    position: "TE",
    overallRating: 82,
    year: "Sophomore",
    archetype: "Possession",
    previousSchool: "Baylor",
    projectedImpact: "Strong Rotation",
    positionNeed: "High",
    schemeFit: "Good",
    rosterFit: "Good",
    developmentTimeline: "One season",
    scholarshipValue: "Good"
  },
  {
    id: "darius-king",
    name: "Darius King",
    position: "CB",
    overallRating: 80,
    year: "Junior",
    archetype: "Slot Corner",
    previousSchool: "Tulane",
    projectedImpact: "Strong Rotation",
    positionNeed: "Medium",
    schemeFit: "Good",
    rosterFit: "Good",
    developmentTimeline: "Immediate rotation",
    scholarshipValue: "Good"
  },
  {
    id: "jonah-price",
    name: "Jonah Price",
    position: "WR",
    overallRating: 79,
    year: "Senior",
    archetype: "Deep Threat",
    previousSchool: "Arizona State",
    projectedImpact: "Not Recommended",
    positionNeed: "Low",
    schemeFit: "Limited",
    rosterFit: "Limited",
    developmentTimeline: "Short-term only",
    scholarshipValue: "Limited"
  }
];

export const oklahomaTransferSummary: TransferSummary = {
  body: "Oklahoma should treat the portal as a targeted correction tool, not a roster-building foundation. Linebacker and tight end are the only clear portal priorities unless recruiting misses create a late-cycle need."
};
