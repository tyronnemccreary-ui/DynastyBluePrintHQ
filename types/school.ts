export type SchoolDemeanor = "Championship Contender" | "Proud Program" | "Builder";

export type School = {
  id: string;
  name: string;
  abbreviation: string;
  mascot: string;
  conference: string;
  location: string;
  prestige: number;
  demeanor: SchoolDemeanor;
};
