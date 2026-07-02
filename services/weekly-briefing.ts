import { oklahomaRecruitingOverview } from "@/data/mock-recruits";
import { oklahomaMockRoster } from "@/data/mock-roster";
import { oklahomaStaffOverview } from "@/data/mock-staff";
import { oklahomaTransferOverview } from "@/data/mock-transfers";
import type { ProgramProfile } from "@/types/program";
import type { NumericValue } from "@/types/team";
import type {
  DepartmentReport,
  WeeklyOperationsBriefing
} from "@/types/weekly-briefing";
import { getTopFootballOperationsIntelligence } from "@/services/football-operations-engine";

type WeeklyBriefingInput = {
  programProfile: ProgramProfile;
};

export function getWeeklyOperationsBriefing({
  programProfile
}: WeeklyBriefingInput): WeeklyOperationsBriefing {
  const topDecisions = getTopFootballOperationsIntelligence({ programProfile });
  const prestige = programProfile.school.teamPrestige ?? programProfile.school.prestige;
  const mainRosterConcern =
    topDecisions.find((decision) => decision.category === "Roster")?.title ??
    "overall roster balance";
  const mainRecruitingConcern =
    topDecisions.find((decision) => decision.category === "Recruiting")?.title ??
    "targeted class construction";
  const mainBlueprintConcern =
    topDecisions.find((decision) =>
      ["Blueprint", "Facilities", "Staff"].includes(decision.category)
    )?.title ?? "resource discipline";

  return {
    executiveSummary: `Coach, ${programProfile.school.name} remains in a strong program position with ${formatPrestige(prestige)} prestige and a ${oklahomaMockRoster.overview.overallGrade} roster profile. The main roster concern is ${mainRosterConcern.toLowerCase()}, while recruiting should stay focused on ${mainRecruitingConcern.toLowerCase()}. From a Football Operations Budget standpoint, ${mainBlueprintConcern.toLowerCase()} should guide the next resource conversation. Overall direction is positive, but the staff should keep the week centered on roster stability and disciplined spending.`,
    departmentReports: buildDepartmentReports(programProfile),
    topDecisions
  };
}

function buildDepartmentReports(programProfile: ProgramProfile): DepartmentReport[] {
  const prestige = programProfile.school.teamPrestige ?? programProfile.school.prestige;
  const expectationLevel =
    programProfile.school.adExpectations?.expectationLevel ?? "not available";
  const dynastyPoints = programProfile.seasonBudget.pointsAvailable;

  return [
    {
      departmentName: "Program Office",
      status: "Stable",
      keyObservation: `${programProfile.school.name} has ${formatPrestige(prestige)} prestige with ${expectationLevel.toLowerCase()} expectations.`,
      recommendedFocus:
        "Keep program standards aligned with AD expectations before approving new resource shifts."
    },
    {
      departmentName: "Football Operations Budget",
      status: "Active",
      keyObservation: `${formatPoints(dynastyPoints)} Dynasty Points are available for the current planning window.`,
      recommendedFocus:
        "Protect flexibility across staff, facilities, recruiting NIL, and roster NIL."
    },
    {
      departmentName: "Roster Intelligence",
      status: "Watch",
      keyObservation: `The roster grades ${oklahomaMockRoster.overview.overallGrade} overall, but high-need rooms still require attention.`,
      recommendedFocus:
        "Prioritize position groups with high need levels before adding luxury depth."
    },
    {
      departmentName: "Recruiting Command Center",
      status: "Active",
      keyObservation: `The class grades ${oklahomaRecruitingOverview.classGrade} with ${oklahomaRecruitingOverview.openScholarships} open scholarships.`,
      recommendedFocus:
        "Shift attention toward roster-driven needs instead of broad target chasing."
    },
    {
      departmentName: "Transfer Portal",
      status: "Selective",
      keyObservation: `${oklahomaTransferOverview.transferBudget} transfer budget points are available for contingency moves.`,
      recommendedFocus:
        "Use the portal as a targeted fallback if recruiting misses at thin positions."
    },
    {
      departmentName: "Staff Management",
      status: "Stable",
      keyObservation: `The current staff grade is ${oklahomaStaffOverview.staffGrade} with ${oklahomaStaffOverview.staffBudget} staff budget points.`,
      recommendedFocus:
        "Support recruiting execution and player development before expanding optional staff roles."
    }
  ];
}

function formatPrestige(prestige?: number) {
  return typeof prestige === "number" ? `${prestige}-star` : "not available";
}

function formatPoints(points?: NumericValue) {
  return typeof points === "number" ? `${points}` : "Not Available";
}
