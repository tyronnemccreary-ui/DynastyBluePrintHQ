import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { TransferPortalOverview } from "@/types/transfer";

type TransferOverviewCardProps = {
  overview: TransferPortalOverview;
};

export function TransferOverviewCard({ overview }: TransferOverviewCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Transfer Portal Overview</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Portal Command View</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Available Transfers" value={`${overview.totalAvailableTransfers}`} />
        <MetricCard label="Team Needs" value={overview.teamPositionNeeds.join(", ")} />
        <MetricCard label="Scholarships" value={`${overview.availableScholarships}`} />
        <MetricCard label="Class Size" value={`${overview.currentRecruitingClassSize}`} />
        <MetricCard label="Transfer Budget" value={`${overview.transferBudget}`} />
      </div>
    </Card>
  );
}
