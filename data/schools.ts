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
    demeanor: "Championship Contender"
  }
];

export const primarySchool = schools[0];
