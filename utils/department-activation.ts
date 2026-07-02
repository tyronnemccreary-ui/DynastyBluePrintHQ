import type { DepartmentActivation, DepartmentId, DepartmentStatus } from "@/types/department";
import type { ProgramProfile } from "@/types/program";
import type { NumericValue } from "@/types/team";

type DepartmentDefinition = Omit<DepartmentActivation, "status" | "activationMessage"> & {
  messages: Record<DepartmentStatus, string>;
};

const departmentDefinitions: DepartmentDefinition[] = [
  {
    id: "program-office",
    name: "Program Office",
    description: "Program identity, school profile, expectations, facilities, and Blueprint snapshot.",
    requiredData: ["Selected school", "Coach profile"],
    optionalData: ["AD expectations", "Facilities detail", "My School Grades"],
    actionLabel: "Open Program Office",
    actionHref: "/program-office",
    messages: {
      Ready: "Program identity is loaded from the selected school.",
      "Needs Activation": "Select a school and create a Program Profile to open the office.",
      "Season Locked": "Program Office is available throughout the year."
    }
  },
  {
    id: "blueprint-planner",
    name: "Football Operations Budget",
    description: "Annual Dynasty Point planning across staff, facilities, recruiting NIL, and roster NIL.",
    requiredData: ["Dynasty Points"],
    optionalData: ["Facilities grade", "Staff needs", "NIL priorities"],
    actionLabel: "Open Budget",
    actionHref: "/blueprint-planner",
    messages: {
      Ready: "Dynasty Points are available, so annual budget planning can begin.",
      "Needs Activation": "Add or import Dynasty Point data to strengthen annual budget planning.",
      "Season Locked": "Budget changes are available during Offseason Planning."
    }
  },
  {
    id: "roster-intelligence",
    name: "Roster Intelligence",
    description: "Roster strength, position depth, progression outlook, and future needs.",
    requiredData: ["Roster screenshot or roster entry"],
    optionalData: ["Player years", "Development traits", "Position depth"],
    actionLabel: "Add Roster Data",
    actionHref: "/screenshot-import",
    messages: {
      Ready: "Roster data is active and can support position-level recommendations.",
      "Needs Activation": "Add roster data before treating roster recommendations as live.",
      "Season Locked": "Roster Intelligence is available once roster data is added."
    }
  },
  {
    id: "recruiting-command-center",
    name: "Recruiting Command Center",
    description: "Recruiting board, team needs, target fit, NIL guidance, and pipeline strategy.",
    requiredData: ["Recruiting board"],
    optionalData: ["Recruit interest", "Pipeline states", "NIL expectations"],
    actionLabel: "Add Recruiting Board",
    actionHref: "/screenshot-import",
    messages: {
      Ready: "Recruiting board data is active for target and need evaluation.",
      "Needs Activation": "Add recruiting board data before using recruiting recommendations as live guidance.",
      "Season Locked": "Recruiting Command Center is available once recruiting data is added."
    }
  },
  {
    id: "transfer-portal",
    name: "Transfer Portal",
    description: "Portal targets, scholarship value, roster fit, and short-term impact.",
    requiredData: ["Offseason phase", "Transfer portal board"],
    optionalData: ["Scholarships", "Roster needs", "Transfer budget"],
    actionLabel: "Review Portal",
    actionHref: "/transfer-portal",
    messages: {
      Ready: "Portal data is active for offseason transfer decisions.",
      "Needs Activation": "The portal is open. Add transfer data before evaluating targets.",
      "Season Locked": "Transfer Portal is season locked until the dynasty reaches offseason."
    }
  },
  {
    id: "staff-management",
    name: "Staff Management",
    description: "Coordinator quality, support staff, staff fit, and development impact.",
    requiredData: ["Coaching staff"],
    optionalData: ["Coordinator archetypes", "Staff costs", "Development impact"],
    actionLabel: "Add Staff Data",
    actionHref: "/screenshot-import",
    messages: {
      Ready: "Staff data is active for coordinator and support staff evaluation.",
      "Needs Activation": "Add coaching staff data before treating staff recommendations as live.",
      "Season Locked": "Staff Management is available once staff data is added."
    }
  },
  {
    id: "screenshot-import",
    name: "Screenshot Import",
    description: "Local upload workflow for preparing future Football Operations data.",
    requiredData: [],
    optionalData: ["Team Overview", "Roster", "Recruiting Board", "Transfer Portal", "Staff"],
    actionLabel: "Upload Screenshots",
    actionHref: "/screenshot-import",
    messages: {
      Ready: "Import support is available for preparing future department data.",
      "Needs Activation": "Screenshot Import is available as an optional support tool.",
      "Season Locked": "Screenshot Import is available throughout the year."
    }
  }
];

export function getDepartmentActivations(
  programProfile: ProgramProfile | null
): DepartmentActivation[] {
  return departmentDefinitions.map((department) => {
    const status = getDepartmentStatus(department.id, programProfile);

    return {
      ...department,
      status,
      activationMessage: department.messages[status]
    };
  });
}

export function getDepartmentActivation(
  id: DepartmentId,
  programProfile: ProgramProfile | null
) {
  return getDepartmentActivations(programProfile).find((department) => department.id === id);
}

function getDepartmentStatus(
  id: DepartmentId,
  programProfile: ProgramProfile | null
): DepartmentStatus {
  if (id === "screenshot-import") {
    return "Ready";
  }

  if (!programProfile) {
    return "Needs Activation";
  }

  if (id === "program-office") {
    return "Ready";
  }

  if (id === "blueprint-planner") {
    return hasDynastyPointData(programProfile) ? "Ready" : "Needs Activation";
  }

  if (id === "roster-intelligence") {
    return programProfile.activation.rosterActivated || programProfile.rosterAdded
      ? "Ready"
      : "Needs Activation";
  }

  if (id === "recruiting-command-center") {
    return programProfile.activation.recruitingActivated || programProfile.recruitingBoardAdded
      ? "Ready"
      : "Needs Activation";
  }

  if (id === "transfer-portal") {
    if (programProfile.currentPhase !== "Offseason") {
      return "Season Locked";
    }

    return programProfile.activation.transferPortalActivated || programProfile.transferPortalAdded
      ? "Ready"
      : "Needs Activation";
  }

  if (id === "staff-management") {
    return programProfile.activation.staffActivated || programProfile.coachingStaffAdded
      ? "Ready"
      : "Needs Activation";
  }

  return "Needs Activation";
}

function hasDynastyPointData(programProfile: ProgramProfile) {
  const points = programProfile.school.dynastyPoints;

  return (
    isKnownNumber(points.total) ||
    isKnownNumber(points.allocated) ||
    isKnownNumber(points.used) ||
    isKnownNumber(points.available)
  );
}

function isKnownNumber(value: NumericValue | undefined) {
  return typeof value === "number" && Number.isFinite(value);
}
