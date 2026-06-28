import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { BlueprintAllocation } from "@/types/blueprint";

type AllocationCardProps = {
  allocation: BlueprintAllocation;
};

export function AllocationCard({ allocation }: AllocationCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{allocation.label}</p>
          <p className="mt-2 text-sm text-blueprint-200">
            {allocation.recommendedPercentage}% recommended
          </p>
        </div>
        <StatusBadge tone="ready">{allocation.recommendedPoints} pts</StatusBadge>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-turf-400"
          style={{ width: `${allocation.recommendedPercentage}%` }}
        />
      </div>
    </Card>
  );
}
