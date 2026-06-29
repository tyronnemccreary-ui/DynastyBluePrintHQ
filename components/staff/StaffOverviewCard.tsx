import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { StaffOverview } from "@/types/staff";

type StaffOverviewCardProps = {
  overview: StaffOverview;
};

export function StaffOverviewCard({ overview }: StaffOverviewCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Staff Overview</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Staff Command View</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Head Coach" value={overview.headCoach} />
        <MetricCard label="Offensive Coordinator" value={overview.offensiveCoordinator} />
        <MetricCard label="Defensive Coordinator" value={overview.defensiveCoordinator} />
        <MetricCard label="Support Slots" value={`${overview.supportStaffSlots}`} />
        <MetricCard label="Staff Grade" value={overview.staffGrade} />
        <MetricCard label="Staff Budget" value={`${overview.staffBudget}`} />
      </div>
    </Card>
  );
}
