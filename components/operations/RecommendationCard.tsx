import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/operations/PriorityBadge";
import type { FootballRecommendation } from "@/types/recommendation";

type RecommendationCardProps = {
  recommendation: FootballRecommendation;
  index: number;
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
            Intelligence {index + 1}
          </p>
          <h3 className="mt-3 text-lg font-semibold text-white">
            {recommendation.title}
          </h3>
        </div>
        <PriorityBadge priority={recommendation.priority} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge>{recommendation.category}</StatusBadge>
        <StatusBadge>{recommendation.impactedDepartment}</StatusBadge>
      </div>

      <div className="mt-5 space-y-4">
        <RecommendationSection
          label="Recommendation"
          value={recommendation.recommendation}
        />
        <RecommendationSection label="Why" value={recommendation.reason} />
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-blueprint-300">
            What Happens If Ignored
          </p>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-blueprint-100">
            {recommendation.tradeoffs.map((tradeoff) => (
              <li key={tradeoff}>{tradeoff}</li>
            ))}
          </ul>
        </div>
        <RecommendationSection
          label="Expected Benefit"
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
