import type {
  ProgramHistoryEvent,
  ProgramLifecyclePhase
} from "@/program/types/program";

type CreateHistoryEventInput = {
  season: number;
  week: number;
  phase: ProgramLifecyclePhase;
  title: string;
  description: string;
  createdDate: string;
};

export function createProgramHistoryEvent({
  season,
  week,
  phase,
  title,
  description,
  createdDate
}: CreateHistoryEventInput): ProgramHistoryEvent {
  return {
    id: `event-${createdDate}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    season,
    week,
    phase,
    title,
    description,
    createdDate
  };
}

export function createInitialProgramHistory(input: {
  coachName: string;
  schoolName: string;
  season: number;
  week: number;
  phase: ProgramLifecyclePhase;
  createdDate: string;
}) {
  return [
    createProgramHistoryEvent({
      season: input.season,
      week: input.week,
      phase: input.phase,
      title: "Program Profile Created",
      description: `${input.coachName} created the Program Operations Profile for ${input.schoolName}.`,
      createdDate: input.createdDate
    })
  ];
}
