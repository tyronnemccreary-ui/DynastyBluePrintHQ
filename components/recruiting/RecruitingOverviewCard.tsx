import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { RecruitingOverview } from "@/types/recruiting";

type RecruitingOverviewCardProps = {
  overview: RecruitingOverview;
  topPositionNeeds: string;
};

export function RecruitingOverviewCard({
  overview,
  topPositionNeeds
}: RecruitingOverviewCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Recruiting Overview</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Class Command View</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Class Grade" value={overview.classGrade} />
        <MetricCard label="Commits" value={`${overview.currentCommits}`} />
        <MetricCard label="Open Scholarships" value={`${overview.openScholarships}`} />
        <MetricCard label="Top Needs" value={topPositionNeeds} />
        <MetricCard label="Pipeline Model" value="Tier 1-5" detail={overview.pipelineStrength} />
      </div>
    </Card>
  );
}
