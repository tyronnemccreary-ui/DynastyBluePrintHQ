import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { WarRoomPriority } from "@/types/recommendation";

type PriorityCardProps = {
  priority: WarRoomPriority;
  index: number;
};

const priorityTone = {
  High: "attention",
  Medium: "ready",
  Low: "neutral"
} as const;

export function PriorityCard({ priority, index }: PriorityCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blueprint-300">
            Priority {index + 1}
          </p>
          <h3 className="mt-3 text-lg font-semibold text-white">{priority.title}</h3>
        </div>
        <StatusBadge tone={priorityTone[priority.priorityLevel]}>
          {priority.priorityLevel}
        </StatusBadge>
      </div>

      <p className="mt-3 text-sm font-medium text-turf-400">{priority.department}</p>
      <div className="mt-5 space-y-4">
        <PrioritySection label="Recommendation" value={priority.recommendation} />
        <PrioritySection label="Reason" value={priority.reason} />
      </div>
    </Card>
  );
}

function PrioritySection({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-blueprint-300">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-blueprint-100">{value}</p>
    </div>
  );
}
