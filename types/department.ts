export type DepartmentStatus = "Ready" | "Needs Activation" | "Season Locked";

export type DepartmentId =
  | "program-office"
  | "blueprint-planner"
  | "roster-intelligence"
  | "recruiting-command-center"
  | "transfer-portal"
  | "staff-management"
  | "screenshot-import";

export type DepartmentActivation = {
  id: DepartmentId;
  name: string;
  description: string;
  status: DepartmentStatus;
  requiredData: string[];
  optionalData: string[];
  activationMessage: string;
  actionLabel: string;
  actionHref: string;
};

export type DynastyPhase = "Preseason" | "Regular Season" | "Postseason" | "Offseason";
