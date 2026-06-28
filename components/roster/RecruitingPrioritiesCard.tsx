import { ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { NeedLevel, RecruitingPriority } from "@/types/roster";

type RecruitingPrioritiesCardProps = {
  priorities: RecruitingPriority[];
};

const needTone: Record<NeedLevel, "neutral" | "ready" | "attention"> = {
  High: "attention",
  Medium: "ready",
  Low: "neutral"
};

export function RecruitingPrioritiesCard({ priorities }: RecruitingPrioritiesCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Recruiting Priorities</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Next Roster Needs</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
          <ClipboardList className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {priorities.map((priority) => (
          <div
            className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
            key={priority.position}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-base font-semibold text-white">{priority.position}</p>
              <StatusBadge tone={needTone[priority.needLevel]}>
                {priority.needLevel}
              </StatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-blueprint-100">{priority.reason}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
