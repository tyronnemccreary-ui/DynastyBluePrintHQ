import type { ImportMapping, ScreenshotCategory } from "@/types/import";

export const screenshotCategories: ScreenshotCategory[] = [
  "Team Overview",
  "AD Expectations",
  "Dynasty Blueprint",
  "Roster",
  "Recruiting Board",
  "Transfer Portal",
  "Staff Management",
  "My School Grades"
];

export const importMappings: ImportMapping[] = [
  {
    category: "Team Overview",
    description: "Program identity and team rating data.",
    futureFields: [
      "School",
      "Team Prestige",
      "Overall Rating",
      "Offense Rating",
      "Defense Rating",
      "Dynasty Points"
    ]
  },
  {
    category: "AD Expectations",
    description: "Athletic Director goals and program expectations.",
    futureFields: ["School Demeanor", "Expectation Level", "Active Goals", "Job Security"]
  },
  {
    category: "Dynasty Blueprint",
    description: "Dynasty Point budget and allocation state.",
    futureFields: ["Available Points", "Staff Allocation", "Facilities Allocation", "NIL Allocation"]
  },
  {
    category: "Roster",
    description: "Roster strength, depth, and position needs.",
    futureFields: ["Position", "Overall Rating", "Depth", "Class Year", "Development Outlook"]
  },
  {
    category: "Recruiting Board",
    description: "Recruit board status and prospect fit.",
    futureFields: ["Recruit Name", "Position", "Stars", "Pipeline", "Interest", "Expected NIL"]
  },
  {
    category: "Transfer Portal",
    description: "Portal targets and roster fit data.",
    futureFields: ["Player Name", "Position", "Overall", "Previous School", "Year", "Portal Status"]
  },
  {
    category: "Staff Management",
    description: "Coordinator and support staff information.",
    futureFields: ["Coach Name", "Role", "Level", "Archetype", "Abilities", "Cost"]
  },
  {
    category: "My School Grades",
    description: "School grade categories used for recruiting and program identity.",
    futureFields: ["Academic Prestige", "Campus Lifestyle", "Championship Contender", "Brand Exposure"]
  }
];
