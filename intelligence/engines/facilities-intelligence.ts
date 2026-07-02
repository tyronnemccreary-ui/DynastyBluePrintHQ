import type {
  FacilitiesIntelligenceReport,
  IntelligenceHealth
} from "@/intelligence/types/reports";
import type { ProgramProfile } from "@/types/program";
import type { Grade } from "@/types/team";

export function analyze(profile: ProgramProfile): FacilitiesIntelligenceReport {
  const facilityGrade =
    profile.school.facilities?.grade ??
    profile.school.mySchoolGrades.athleticFacilities ??
    "Not Available";
  const facilitiesScore = gradeToScore(facilityGrade);
  const facilitiesHealth = getHealth(facilitiesScore);

  return {
    facilitiesHealth,
    recruitingImpact:
      facilitiesScore >= 84
        ? "Facilities support recruiting credibility with national targets."
        : "Facilities may limit recruiting leverage against higher-resource programs.",
    playerDevelopmentImpact:
      facilitiesScore >= 84
        ? "Facilities support steady player development."
        : "Development upside may need staff support until facilities improve.",
    maintenanceRisk:
      facilitiesHealth === "Healthy" || facilitiesHealth === "Stable"
        ? "Maintenance risk is manageable."
        : "Facility maintenance should be protected during offseason planning.",
    upgradePriority:
      facilitiesScore >= 88
        ? "Low priority unless AD expectations change."
        : "Medium priority behind urgent recruiting and retention needs.",
    facilitiesScore
  };
}

function gradeToScore(grade: Grade | string): number {
  const scores: Record<string, number> = {
    "A+": 96,
    A: 92,
    "A-": 89,
    "B+": 86,
    B: 82,
    "B-": 79,
    "C+": 76,
    C: 72,
    "C-": 69,
    "D+": 66,
    D: 62,
    "D-": 59,
    F: 50,
    "Not Available": 78
  };

  return scores[grade] ?? 78;
}

function getHealth(score: number): IntelligenceHealth {
  if (score >= 88) {
    return "Healthy";
  }

  if (score >= 82) {
    return "Stable";
  }

  if (score >= 76) {
    return "Watch";
  }

  return "At Risk";
}
