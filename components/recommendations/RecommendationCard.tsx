import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  FootballRecommendation,
  RecommendationPriority
} from "@/types/recommendation";

type RecommendationCardProps = {
  recommendation: FootballRecommendation;
  index: number;
};

const priorityTone: Record<RecommendationPriority, "neutral" | "ready" | "attention"> = {
  Critical: "attention",
  High: "attention",
  Medium: "ready",
  Low: "neutral"
};

export function RecommendationCard({
  recommendation,
  index
}: RecommendationCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blueprint-300">
            Recommendation {index + 1}
          </p>
          <h3 className="mt-3 text-lg font-semibold text-white">
            {recommendation.title}
          </h3>
        </div>
        <StatusBadge tone={priorityTone[recommendation.priority]}>
          {recommendation.priority}
        </StatusBadge>
      </div>

      <p className="mt-3 text-sm font-medium text-turf-400">
        {recommendation.category}
      </p>

      <div className="mt-5 space-y-4">
        <RecommendationSection
          label="Recommendation"
          value={recommendation.recommendation}
        />
        <RecommendationSection label="Reason" value={recommendation.reason} />
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-blueprint-300">
            Tradeoffs
          </p>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-blueprint-100">
            {recommendation.tradeoffs.map((tradeoff) => (
              <li key={tradeoff}>{tradeoff}</li>
            ))}
          </ul>
        </div>
        <RecommendationSection
          label="Expected Outcome"
          value={recommendation.expectedOutcome}
        />
      </div>
    </Card>
  );
}

function RecommendationSection({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-blueprint-300">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-blueprint-100">{value}</p>
    </div>
  );
}
