import type { School } from "@/types/school";

export const schools: School[] = [
  {
    id: "oklahoma",
    name: "Oklahoma",
    abbreviation: "OU",
    mascot: "Sooners",
    conference: "SEC",
    location: "Norman, Oklahoma",
    prestige: 5,
    demeanor: "Championship Contender",
    identity: {
      overallRating: 90,
      offensiveRating: 91,
      defensiveRating: 88,
      tradition: "Blue Blood",
      brandExposure: "National",
      stadiumAtmosphere: "Elite"
    },
    adExpectations: {
      demeanor: "Championship Contender",
      expectationLevel: "Elite",
      activeGoals: [
        "Compete for the conference championship",
        "Maintain a top-tier recruiting profile",
        "Protect national program reputation"
      ]
    },
    facilities: {
      tier: "Championship",
      grade: "A",
      equipmentSlots: 8
    },
    blueprintSnapshot: {
      availableDynastyPoints: 25,
      focusAreas: ["Staff", "Facilities", "Recruiting NIL", "Roster NIL"]
    }
  }
];

export const primarySchool = schools[0];
