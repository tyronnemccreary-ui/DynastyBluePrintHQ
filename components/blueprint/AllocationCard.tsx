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
            Current vs recommended allocation
          </p>
        </div>
        <StatusBadge tone={allocation.pointDifference === 0 ? "ready" : "attention"}>
          {formatDifference(allocation.pointDifference)}
        </StatusBadge>
      </div>

      <div className="mt-5 space-y-3">
        <AllocationRow
          label="Current"
          percentage={allocation.actualPercentage}
          points={allocation.actualPoints}
          tone="bg-gold-400"
        />
        <AllocationRow
          label="Recommended"
          percentage={allocation.recommendedPercentage}
          points={allocation.recommendedPoints}
          tone="bg-turf-400"
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-blueprint-300">
        Difference: {formatDifference(allocation.pointDifference)} /{" "}
        {formatPercentageDifference(allocation.percentageDifference)}
      </p>
    </Card>
  );
}

function AllocationRow({
  label,
  percentage,
  points,
  tone
}: {
  label: string;
  percentage: number;
  points: number;
  tone: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-blueprint-200">
        <span>{label}</span>
        <span>
          {points} pts • {percentage}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function formatDifference(value: number) {
  if (value === 0) {
    return "On Plan";
  }

  return `${value > 0 ? "+" : ""}${value} pts`;
}

function formatPercentageDifference(value: number) {
  if (value === 0) {
    return "even";
  }

  return `${value > 0 ? "+" : ""}${value}%`;
}
