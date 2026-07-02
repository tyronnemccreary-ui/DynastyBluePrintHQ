import type { CFB27Team, MySchoolGrades, NumericValue } from "@/types/team";

export type SchoolDemeanor = "Championship Contender" | "Proud Program" | "Builder";

export type ExpectationLevel = "Elite" | "High" | "Moderate" | "Developmental";

export type FocusArea = "Staff" | "Facilities" | "Recruiting NIL" | "Roster NIL";

export type TeamIdentity = {
  overallRating: NumericValue;
  offensiveRating: NumericValue;
  defensiveRating: NumericValue;
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
  school: string;
  name: string;
  shortName: string;
  abbreviation: string;
  mascot: string;
  conference: string;
  teamPrestige: number;
  prestige: number;
  overall: NumericValue;
  offense: NumericValue;
  defense: NumericValue;
  overallRating: NumericValue;
  offenseRating: NumericValue;
  defenseRating: NumericValue;
  dynastyPoints: CFB27Team["dynastyPoints"];
  mySchoolGrades: MySchoolGrades;
  location?: string;
  schoolDemeanor?: string;
  demeanor?: string;
  identity?: Partial<TeamIdentity>;
  adExpectations?: CFB27Team["adExpectations"];
  facilities?: Partial<Facilities>;
  blueprintSnapshot?: Partial<BlueprintSnapshot>;
  facilityTier?: string;
  pipelineStates?: string[];
  rivalries?: string[];
};
