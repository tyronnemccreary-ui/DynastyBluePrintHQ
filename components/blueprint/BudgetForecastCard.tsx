import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { FootballOperationsBudgetForecast } from "@/types/blueprint";

type BudgetForecastCardProps = {
  forecast: FootballOperationsBudgetForecast;
};

export function BudgetForecastCard({ forecast }: BudgetForecastCardProps) {
  return (
    <Card className="p-6">
      <div>
        <StatusBadge>Budget Forecast</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">
          Football Operations Budget Forecast
        </h2>
        <p className="mt-2 text-sm leading-6 text-blueprint-200">
          A forward look at projected category costs and the reserve left after planned spending.
        </p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Current Budget" value={`${forecast.currentBudget}`} />
        <MetricCard
          label="Projected Remaining"
          value={`${forecast.projectedRemainingBudget}`}
        />
        <MetricCard label="Projected Staff" value={`${forecast.projectedStaffCost}`} />
        <MetricCard
          label="Projected Facilities"
          value={`${forecast.projectedFacilityCost}`}
        />
        <MetricCard
          label="Projected Recruiting NIL"
          value={`${forecast.projectedRecruitingNil}`}
        />
        <MetricCard label="Projected Roster NIL" value={`${forecast.projectedRosterNil}`} />
        <MetricCard label="Reserve" value={`${forecast.reserve}`} />
      </div>
    </Card>
  );
}
