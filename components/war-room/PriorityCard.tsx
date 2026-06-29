import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  FootballRecommendation,
  RecommendationPriority
} from "@/types/recommendation";

type PriorityCardProps = {
  priority: FootballRecommendation;
  index: number;
};

const priorityTone: Record<RecommendationPriority, "neutral" | "ready" | "attention"> = {
  Critical: "attention",
  High: "attention",
  Medium: "ready",
  Low: "neutral"
};

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
        <StatusBadge tone={priorityTone[priority.priority]}>
          {priority.priority}
        </StatusBadge>
      </div>

      <p className="mt-3 text-sm font-medium text-turf-400">{priority.category}</p>
      <div className="mt-5 space-y-4">
        <PrioritySection label="Recommendation" value={priority.recommendation} />
        <PrioritySection label="Reason" value={priority.reason} />
        <PrioritySection
          label="Expected Outcome"
          value={priority.expectedOutcome}
        />
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
