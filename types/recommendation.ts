export type PriorityLevel = "High" | "Medium" | "Low";

export type WarRoomPriority = {
  id: string;
  title: string;
  department: string;
  recommendation: string;
  reason: string;
  priorityLevel: PriorityLevel;
};

export type ProgramHealth = {
  overall: number;
  roster: number;
  recruiting: number;
  blueprint: number;
  staff: number;
};

export type ExecutiveBriefing = {
  title: string;
  body: string;
};
