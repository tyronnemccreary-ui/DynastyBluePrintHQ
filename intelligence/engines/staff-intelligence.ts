import { oklahomaCoordinators, oklahomaStaffOverview } from "@/data/mock-staff";
import type {
  IntelligenceHealth,
  StaffIntelligenceReport
} from "@/intelligence/types/reports";
import type { ProgramProfile } from "@/types/program";
import { evaluateCoordinators } from "@/utils/staff-analysis";

export function analyze(profile: ProgramProfile): StaffIntelligenceReport {
  void profile;

  const coordinators = evaluateCoordinators(oklahomaCoordinators);
  const hireNeeds = coordinators
    .filter((coordinator) => coordinator.recommendation === "Hire")
    .map((coordinator) => `${coordinator.role}: ${coordinator.name}`);
  const staffScore = gradeToScore(oklahomaStaffOverview.staffGrade);

  return {
    staffHealth: getHealth(staffScore),
    recruitingImpact: "Current staff provides good recruiting support, but support staff can improve execution.",
    developmentImpact: "Coordinator development impact is strong for top-end player growth.",
    coordinatorSynergy: "Offensive and defensive coordinator fit is stable for a contender profile.",
    abilityCoverage: ["QB development", "Defensive structure", "Recruiting support"],
    hiringNeeds: hireNeeds.length > 0 ? hireNeeds : ["No urgent coordinator change required."],
    staffScore
  };
}

function gradeToScore(grade: string) {
  const scores: Record<string, number> = {
    A: 92,
    "B+": 86,
    B: 82,
    "C+": 76,
    C: 70
  };

  return scores[grade] ?? 80;
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
