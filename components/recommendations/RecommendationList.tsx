import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { StatusBadge } from "@/components/ui/status-badge";
import type { FootballRecommendation } from "@/types/recommendation";

type RecommendationListProps = {
  recommendations: FootballRecommendation[];
};

export function RecommendationList({ recommendations }: RecommendationListProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <StatusBadge>Top Three Recommendations</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">What Needs Attention</h2>
        </div>
        <p className="text-sm text-blueprint-300">
          Deterministic football operations rules.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {recommendations.map((recommendation, index) => (
          <RecommendationCard
            index={index}
            key={recommendation.id}
            recommendation={recommendation}
          />
        ))}
      </div>
    </section>
  );
}
