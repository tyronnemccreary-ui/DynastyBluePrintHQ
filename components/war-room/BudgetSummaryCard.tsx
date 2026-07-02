import { WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { FootballOperationsBudgetSummary } from "@/types/blueprint";

type BudgetSummaryCardProps = {
  summary: FootballOperationsBudgetSummary;
};

const healthTone: Record<FootballOperationsBudgetSummary["budgetHealth"], "ready" | "attention" | "neutral"> = {
  Healthy: "ready",
  Watch: "attention",
  "At Risk": "attention"
};

export function BudgetSummaryCard({ summary }: BudgetSummaryCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Budget Summary</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Football Operations Budget</h2>
          <p className="mt-2 text-sm leading-6 text-blueprint-200">
            Annual Dynasty Point health and projected reserve for the current program.
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
          <WalletCards className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Budget Health"
          value={summary.budgetHealth}
          detail="Current forecast"
        />
        <MetricCard
          label="Dynasty Points Remaining"
          value={`${summary.dynastyPointsRemaining}`}
        />
        <MetricCard
          label="Projected Reserve"
          value={`${summary.projectedEndOfYearReserve}`}
        />
      </div>

      <div className="mt-5 rounded-md border border-white/10 bg-white/[0.025] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone={healthTone[summary.budgetHealth]}>
            Highest Budget Risk
          </StatusBadge>
          <p className="text-sm leading-6 text-blueprint-100">
            {summary.highestBudgetRisk}
          </p>
        </div>
      </div>
    </Card>
  );
}
