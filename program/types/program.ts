import type { School } from "@/types/school";
import type {
  AnnualBudgetHistoryEntry,
  FootballOperationsBudgetForecast,
  SeasonBudget
} from "@/types/blueprint";
import type { MockRosterProfile } from "@/types/roster";
import type { DynastyPoints, NumericValue } from "@/types/team";

export type DynastyType = "new" | "existing";

export type CoachRole = "head_coach" | "offensive_coordinator" | "defensive_coordinator";

export type ProgramLifecyclePhase =
  | "Welcome"
  | "Football Operations Setup"
  | "Preseason"
  | "Regular Season"
  | "Conference Championship"
  | "Bowl Season"
  | "Offseason";

export type JobSecurity = "Secure" | "Stable" | "Under Review" | "Hot Seat";

export type ProgramHistoryEvent = {
  id: string;
  season: number;
  week: number;
  phase: ProgramLifecyclePhase;
  title: string;
  description: string;
  createdDate: string;
};

export type ProgramBlueprintState = {
  dynastyPoints: DynastyPoints;
  focusAreas: string[];
};

export type ProgramRosterState = {
  activated: boolean;
  lastUpdated: string | null;
  sourceFileName?: string;
  data?: MockRosterProfile;
};

export type ProgramStaffState = {
  activated: boolean;
  lastUpdated: string | null;
};

export type ProgramRecruitingState = {
  activated: boolean;
  lastUpdated: string | null;
};

export type ProgramTransferPortalState = {
  activated: boolean;
  lastUpdated: string | null;
};

export type ProgramOperationsActivation = {
  rosterActivated: boolean;
  staffActivated: boolean;
  recruitingActivated: boolean;
  transferPortalActivated: boolean;
  adExpectationsActivated: boolean;
};

export type ProgramOperationsProfile = {
  profileId: string;
  coachName: string;
  coachRole: CoachRole;
  dynastyType: DynastyType;
  school: School;
  conference: string;
  mascot: string;
  createdDate: string;
  updatedDate: string;
  season: number;
  week: number;
  currentPhase: ProgramLifecyclePhase;
  blueprint: ProgramBlueprintState;
  roster: ProgramRosterState;
  staff: ProgramStaffState;
  recruiting: ProgramRecruitingState;
  transferPortal: ProgramTransferPortalState;
  jobSecurity: JobSecurity;
  teamPrestige: NumericValue;
  dynastyPoints: DynastyPoints;
  seasonBudget: SeasonBudget;
  budgetLocked: boolean;
  budgetForecast: FootballOperationsBudgetForecast;
  annualBudgetHistory: AnnualBudgetHistoryEntry[];
  activation: ProgramOperationsActivation;
  history: ProgramHistoryEvent[];

  /*
   * Compatibility fields for existing MVP screens and persistence.
   * New code should prefer the Program Operations fields above.
   */
  id: string;
  dynastyPhase?: ProgramLifecyclePhase;
  rosterAdded?: boolean;
  recruitingBoardAdded?: boolean;
  transferPortalAdded?: boolean;
  coachingStaffAdded?: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type CreateProgramOperationsProfileInput = {
  coachName: string;
  coachRole: CoachRole;
  dynastyType: DynastyType;
  selectedTeam: School;
  now?: string;
};
