import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { BlueprintAllocation } from "@/types/blueprint";

type BudgetTimelineCardProps = {
  allocations: BlueprintAllocation[];
  budgetLocked: boolean;
};

export function BudgetTimelineCard({
  allocations,
  budgetLocked
}: BudgetTimelineCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Budget Timeline</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Seasonal Change Windows</h2>
          <p className="mt-2 text-sm leading-6 text-blueprint-200">
            Annual budget decisions are planned before the relevant football operations window.
          </p>
        </div>
        {budgetLocked ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-400/10 text-gold-400">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </div>
        ) : null}
      </div>

      <div className="mt-5 space-y-3">
        {allocations.map((allocation) => (
          <div
            className="flex flex-col gap-2 rounded-md border border-white/10 bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between"
            key={allocation.category}
          >
            <div>
              <p className="text-sm font-semibold text-white">{allocation.label}</p>
              <p className="mt-1 text-xs text-blueprint-300">{allocation.changeWindow}</p>
            </div>
            <StatusBadge tone={allocation.locked ? "attention" : "ready"}>
              {allocation.locked ? "Locked for current season." : "Open"}
            </StatusBadge>
          </div>
        ))}
      </div>
    </Card>
  );
}
