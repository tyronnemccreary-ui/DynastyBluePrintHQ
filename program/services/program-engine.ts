import { createInitialProgramHistory } from "@/program/history/program-history";
import {
  createInactiveRecruitingState,
  createInactiveRosterState,
  createInactiveStaffState,
  createInactiveTransferPortalState,
  createInitialBudgetForecast,
  createInitialDynastyPoints,
  createInitialSeasonBudget,
  defaultProgramActivation,
  defaultProgramFocusAreas,
  initialProgramPhase,
  initialSeason,
  initialWeek
} from "@/program/profile/program-profile";
import type {
  CreateProgramOperationsProfileInput,
  ProgramOperationsProfile
} from "@/program/types/program";
import type { School } from "@/types/school";

type LegacyProgramProfile = Partial<ProgramOperationsProfile> & {
  id?: string;
  school: School;
  coachName: string;
  coachRole: ProgramOperationsProfile["coachRole"];
  dynastyType: ProgramOperationsProfile["dynastyType"];
  createdAt?: string;
  updatedAt?: string;
  rosterAdded?: boolean;
  recruitingBoardAdded?: boolean;
  transferPortalAdded?: boolean;
  coachingStaffAdded?: boolean;
};

export function createProgramOperationsProfile({
  coachName,
  coachRole,
  dynastyType,
  selectedTeam,
  now = new Date().toISOString()
}: CreateProgramOperationsProfileInput): ProgramOperationsProfile {
  const livingSchool = cloneSelectedTeam(selectedTeam);
  const dynastyPoints = createInitialDynastyPoints(livingSchool.dynastyPoints);
  const profileId = `program-${Date.now()}`;
  const phase = initialProgramPhase;
  const seasonBudget = createInitialSeasonBudget(dynastyPoints, phase, initialWeek);
  const budgetForecast = createInitialBudgetForecast(seasonBudget);
  const history = createInitialProgramHistory({
    coachName,
    schoolName: livingSchool.name,
    season: initialSeason,
    week: initialWeek,
    phase,
    createdDate: now
  });

  return {
    profileId,
    id: profileId,
    coachName,
    coachRole,
    dynastyType,
    school: livingSchool,
    conference: livingSchool.conference,
    mascot: livingSchool.mascot,
    createdDate: now,
    updatedDate: now,
    createdAt: now,
    updatedAt: now,
    season: initialSeason,
    week: initialWeek,
    currentPhase: phase,
    dynastyPhase: phase,
    blueprint: {
      dynastyPoints,
      focusAreas: [...defaultProgramFocusAreas]
    },
    roster: createInactiveRosterState(),
    staff: createInactiveStaffState(),
    recruiting: createInactiveRecruitingState(),
    transferPortal: createInactiveTransferPortalState(),
    jobSecurity: "Stable",
    teamPrestige: livingSchool.teamPrestige ?? livingSchool.prestige ?? "Not Available",
    dynastyPoints,
    seasonBudget,
    budgetLocked: seasonBudget.locked,
    budgetForecast,
    annualBudgetHistory: [],
    activation: { ...defaultProgramActivation },
    rosterAdded: false,
    recruitingBoardAdded: false,
    transferPortalAdded: false,
    coachingStaffAdded: false,
    history
  };
}

export function cloneSelectedTeam(team: School): School {
  return JSON.parse(JSON.stringify(team)) as School;
}

export function ensureProgramOperationsProfile(
  profile: ProgramOperationsProfile | LegacyProgramProfile
): ProgramOperationsProfile {
  if (
    "profileId" in profile &&
    typeof profile.profileId === "string" &&
    profile.activation &&
    profile.currentPhase &&
    profile.seasonBudget &&
    profile.budgetForecast
  ) {
    return profile as ProgramOperationsProfile;
  }

  const createdDate = profile.createdAt ?? new Date().toISOString();
  const baseProfile = createProgramOperationsProfile({
    coachName: profile.coachName,
    coachRole: profile.coachRole,
    dynastyType: profile.dynastyType,
    selectedTeam: profile.school,
    now: createdDate
  });
  const profileId = profile.id ?? baseProfile.profileId;
  const rosterActivated = profile.rosterAdded === true;
  const recruitingActivated = profile.recruitingBoardAdded === true;
  const transferPortalActivated = profile.transferPortalAdded === true;
  const staffActivated = profile.coachingStaffAdded === true;
  const existingOperationsProfile = profile as Partial<ProgramOperationsProfile>;
  const seasonBudget =
    existingOperationsProfile.seasonBudget ??
    createInitialSeasonBudget(
      existingOperationsProfile.dynastyPoints ?? baseProfile.dynastyPoints,
      existingOperationsProfile.currentPhase ?? baseProfile.currentPhase,
      existingOperationsProfile.week ?? baseProfile.week
    );

  return {
    ...baseProfile,
    profileId,
    id: profileId,
    updatedDate: profile.updatedAt ?? createdDate,
    updatedAt: profile.updatedAt,
    activation: {
      ...baseProfile.activation,
      rosterActivated,
      recruitingActivated,
      transferPortalActivated,
      staffActivated
    },
    seasonBudget,
    budgetLocked: existingOperationsProfile.budgetLocked ?? seasonBudget.locked,
    budgetForecast:
      existingOperationsProfile.budgetForecast ?? createInitialBudgetForecast(seasonBudget),
    annualBudgetHistory: existingOperationsProfile.annualBudgetHistory ?? [],
    roster: {
      ...baseProfile.roster,
      activated: rosterActivated
    },
    recruiting: {
      ...baseProfile.recruiting,
      activated: recruitingActivated
    },
    transferPortal: {
      ...baseProfile.transferPortal,
      activated: transferPortalActivated
    },
    staff: {
      ...baseProfile.staff,
      activated: staffActivated
    },
    rosterAdded: rosterActivated,
    recruitingBoardAdded: recruitingActivated,
    transferPortalAdded: transferPortalActivated,
    coachingStaffAdded: staffActivated
  };
}
