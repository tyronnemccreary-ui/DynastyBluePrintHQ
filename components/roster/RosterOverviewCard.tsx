import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { RosterOverview } from "@/types/roster";

type RosterOverviewCardProps = {
  overview: RosterOverview;
};

export function RosterOverviewCard({ overview }: RosterOverviewCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <StatusBadge>Roster Overview</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Current Team Shape</h2>
        </div>
        <StatusBadge tone="ready">{overview.developmentOutlook}</StatusBadge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Overall Roster" value={overview.overallGrade} />
        <MetricCard label="Offense" value={overview.offensiveGrade} />
        <MetricCard label="Defense" value={overview.defensiveGrade} />
        <MetricCard label="Depth" value={overview.depthGrade} />
      </div>
    </Card>
  );
}
