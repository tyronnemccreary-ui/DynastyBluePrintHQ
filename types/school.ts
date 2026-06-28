export type SchoolDemeanor = "Championship Contender" | "Proud Program" | "Builder";

export type ExpectationLevel = "Elite" | "High" | "Moderate" | "Developmental";

export type FocusArea = "Staff" | "Facilities" | "Recruiting NIL" | "Roster NIL";

export type TeamIdentity = {
  overallRating: number;
  offensiveRating: number;
  defensiveRating: number;
  tradition: string;
  brandExposure: string;
  stadiumAtmosphere: string;
};

export type ADExpectations = {
  demeanor: SchoolDemeanor;
  expectationLevel: ExpectationLevel;
  activeGoals: string[];
};

export type Facilities = {
  tier: string;
  grade: string;
  equipmentSlots: number;
};

export type BlueprintSnapshot = {
  availableDynastyPoints: number;
  focusAreas: FocusArea[];
};

export type School = {
  id: string;
  name: string;
  abbreviation: string;
  mascot: string;
  conference: string;
  location: string;
  prestige: number;
  demeanor: SchoolDemeanor;
  identity: TeamIdentity;
  adExpectations: ADExpectations;
  facilities: Facilities;
  blueprintSnapshot: BlueprintSnapshot;
};
