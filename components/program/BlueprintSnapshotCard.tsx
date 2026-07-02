import { CircleDollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { School } from "@/types/school";
import { formatDynastyPointValue, getAvailableDynastyPoints } from "@/utils/display-formatters";

type BlueprintSnapshotCardProps = {
  school: School;
};

export function BlueprintSnapshotCard({ school }: BlueprintSnapshotCardProps) {
  const dynastyPoints = school.dynastyPoints;
  const availablePoints =
    getAvailableDynastyPoints(dynastyPoints) ?? school.blueprintSnapshot?.availableDynastyPoints;
  const focusAreas = school.blueprintSnapshot?.focusAreas ?? [];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Dynasty Blueprint</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Snapshot</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
          <CircleDollarSign className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Total"
          value={formatDynastyPointValue(dynastyPoints?.total)}
          detail="Dynasty Points"
        />
        <MetricCard
          label="Allocated"
          value={formatDynastyPointValue(dynastyPoints?.allocated)}
          detail="Dynasty Points"
        />
        <MetricCard
          label="Used"
          value={formatDynastyPointValue(dynastyPoints?.used)}
          detail="Dynasty Points"
        />
        <MetricCard
          label="Available"
          value={formatDynastyPointValue(availablePoints)}
          detail="Dynasty Points"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-blueprint-100">Suggested Focus Areas</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {focusAreas.length > 0 ? (
            focusAreas.map((area) => <StatusBadge key={area}>{area}</StatusBadge>)
          ) : (
            <StatusBadge>Not Available</StatusBadge>
          )}
        </div>
      </div>
    </Card>
  );
}
