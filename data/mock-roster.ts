import type { MockRosterProfile } from "@/types/roster";

export const oklahomaMockRoster: MockRosterProfile = {
  players: [
    {
      playerId: "placeholder-qb-1",
      name: "Sample QB",
      position: "QB",
      overall: 88,
      year: "JR",
      archetype: "Field General",
      developmentTrait: "Star",
      projectedRole: "Starter",
      eligibilityRemaining: 2
    },
    {
      playerId: "placeholder-te-1",
      name: "Sample TE",
      position: "TE",
      overall: 79,
      year: "SR",
      archetype: "Vertical Threat",
      developmentTrait: "Impact",
      projectedRole: "Starter",
      eligibilityRemaining: 1
    },
    {
      playerId: "placeholder-lb-1",
      name: "Sample LB",
      position: "LB",
      overall: 81,
      year: "SR",
      archetype: "Field General",
      developmentTrait: "Normal",
      projectedRole: "Starter",
      eligibilityRemaining: 1
    }
  ],
  overview: {
    overallGrade: "B+",
    offensiveGrade: "A",
    defensiveGrade: "B+",
    depthGrade: "B",
    developmentOutlook: "Strong"
  },
  positionGroups: [
    {
      position: "QB",
      currentGrade: "A",
      futureGrade: "B+",
      depthStatus: "Stable",
      developmentOutlook: "Strong",
      seniorDepartureRisk: "Medium",
      needLevel: "Medium"
    },
    {
      position: "RB",
      currentGrade: "B+",
      futureGrade: "B+",
      depthStatus: "Strong",
      developmentOutlook: "Steady",
      seniorDepartureRisk: "Low",
      needLevel: "Low"
    },
    {
      position: "WR",
      currentGrade: "A",
      futureGrade: "A",
      depthStatus: "Strong",
      developmentOutlook: "Excellent",
      seniorDepartureRisk: "Low",
      needLevel: "Low"
    },
    {
      position: "TE",
      currentGrade: "B",
      futureGrade: "C+",
      depthStatus: "Thin",
      developmentOutlook: "Needs Attention",
      seniorDepartureRisk: "High",
      needLevel: "High"
    },
    {
      position: "OL",
      currentGrade: "B+",
      futureGrade: "B",
      depthStatus: "Stable",
      developmentOutlook: "Steady",
      seniorDepartureRisk: "Medium",
      needLevel: "Medium"
    },
    {
      position: "DL",
      currentGrade: "B",
      futureGrade: "B",
      depthStatus: "Stable",
      developmentOutlook: "Strong",
      seniorDepartureRisk: "Medium",
      needLevel: "Medium"
    },
    {
      position: "LB",
      currentGrade: "B",
      futureGrade: "C+",
      depthStatus: "At Risk",
      developmentOutlook: "Needs Attention",
      seniorDepartureRisk: "High",
      needLevel: "High"
    },
    {
      position: "CB",
      currentGrade: "B+",
      futureGrade: "B",
      depthStatus: "Thin",
      developmentOutlook: "Strong",
      seniorDepartureRisk: "Medium",
      needLevel: "Medium"
    },
    {
      position: "S",
      currentGrade: "B",
      futureGrade: "B+",
      depthStatus: "Stable",
      developmentOutlook: "Strong",
      seniorDepartureRisk: "Medium",
      needLevel: "Medium"
    }
  ],
  progression: {
    youngCoreStrength: "Strong skill-position foundation with multiple future contributors.",
    seniorDepartureRisk: "Moderate risk at linebacker and tight end after the current season.",
    developmentUpside: "High upside if facilities and staff attention stay aligned.",
    facilityImpact: "Championship-tier facilities support steady year-over-year growth.",
    staffImpact: "Staff quality should keep top-end players developing, but thin rooms need focus."
  },
  recommendationSummary:
    "Oklahoma has a contender-level roster, but the staff should protect future depth at tight end and linebacker while maintaining offensive skill strength. Recruiting should stay targeted rather than broad."
};
