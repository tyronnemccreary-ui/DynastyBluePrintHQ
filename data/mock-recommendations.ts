import type {
  ExecutiveBriefing,
  ProgramHealth,
  WarRoomPriority
} from "@/types/recommendation";

export const mockProgramHealth: ProgramHealth = {
  overall: 87,
  roster: 86,
  recruiting: 89,
  blueprint: 82,
  staff: 84
};

export const mockExecutiveBriefing: ExecutiveBriefing = {
  title: "Weekly Executive Briefing",
  body: "Oklahoma is positioned like a national contender, but the operation should stay disciplined. Protect the roster foundation, keep recruiting momentum high, and make Blueprint spending support long-term program standards."
};

export const mockWarRoomPriorities: WarRoomPriority[] = [
  {
    id: "protect-roster-core",
    title: "Protect the Roster Core",
    department: "Roster Intelligence",
    recommendation: "Review key returning starters before allocating future resources.",
    reason: "Oklahoma has contender-level expectations, so avoid creating avoidable roster gaps while building toward the next class.",
    priorityLevel: "High"
  },
  {
    id: "prioritize-recruiting-nil",
    title: "Keep Recruiting Pressure High",
    department: "Recruiting Command Center",
    recommendation: "Reserve early attention for priority prospects in high-value position groups.",
    reason: "A national brand can win major recruiting battles, but attention still needs to be focused where it matters most.",
    priorityLevel: "High"
  },
  {
    id: "align-blueprint-spend",
    title: "Align Blueprint Spending",
    department: "Blueprint Planner",
    recommendation: "Balance available Dynasty Points across staff, facilities, and NIL support.",
    reason: "The program has enough points to improve multiple departments, but scattered spending can weaken the overall plan.",
    priorityLevel: "Medium"
  }
];
