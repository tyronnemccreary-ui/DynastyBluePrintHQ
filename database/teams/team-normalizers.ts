import type { School } from "@/types/school";
import type { CFB27Team, DynastyPoints, NumericValue } from "@/types/team";

const defaultFocusAreas = ["Staff", "Facilities", "Recruiting NIL", "Roster NIL"] as const;

export function calculateAvailableDynastyPoints(points: DynastyPoints): NumericValue {
  if (typeof points.available === "number") {
    return Math.max(0, points.available);
  }

  if (
    typeof points.total === "number" &&
    typeof points.used === "number" &&
    typeof points.allocated === "number"
  ) {
    return Math.max(0, points.total - points.used - points.allocated);
  }

  return "Not Available";
}

export function normalizeTeamRecord(team: CFB27Team): School {
  const availableDynastyPoints = calculateAvailableDynastyPoints(team.dynastyPoints);

  return {
    ...team,
    name: team.school,
    abbreviation: team.shortName,
    prestige: team.teamPrestige,
    overallRating: team.overall,
    offenseRating: team.offense,
    defenseRating: team.defense,
    location: undefined,
    demeanor: team.schoolDemeanor,
    identity: {
      overallRating: team.overall,
      offensiveRating: team.offense,
      defensiveRating: team.defense,
      tradition: team.mySchoolGrades.programTradition,
      brandExposure: team.mySchoolGrades.brandExposure,
      stadiumAtmosphere: team.mySchoolGrades.stadiumAtmosphere
    },
    facilities: {
      tier: team.facilityTier,
      grade: team.mySchoolGrades.athleticFacilities
    },
    blueprintSnapshot:
      typeof availableDynastyPoints === "number"
        ? {
            availableDynastyPoints,
            focusAreas: [...defaultFocusAreas]
          }
        : {
            focusAreas: [...defaultFocusAreas]
          },
    dynastyPoints: {
      ...team.dynastyPoints,
      available: availableDynastyPoints
    }
  };
}

export function normalizeTeamRecords(teams: CFB27Team[]): School[] {
  return teams.map(normalizeTeamRecord);
}
