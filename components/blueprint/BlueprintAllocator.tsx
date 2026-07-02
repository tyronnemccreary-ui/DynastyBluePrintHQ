"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, Lock } from "lucide-react";
import { AllocationCard } from "@/components/blueprint/AllocationCard";
import { BudgetForecastCard } from "@/components/blueprint/BudgetForecastCard";
import { BudgetTimelineCard } from "@/components/blueprint/BudgetTimelineCard";
import { StrategicSummary } from "@/components/blueprint/StrategicSummary";
import { TradeoffList } from "@/components/blueprint/TradeoffList";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useProgramStore } from "@/store/program-store";
import type { BlueprintActualSpend, BlueprintCategory } from "@/types/blueprint";
import type { ProgramProfile } from "@/types/program";
import {
  generateBlueprintRecommendation,
  generateBudgetForecast
} from "@/utils/blueprint-recommendations";
import { formatDynastyPointValue, getAvailableDynastyPoints } from "@/utils/display-formatters";

type BlueprintAllocatorProps = {
  profile: ProgramProfile;
};

export function BlueprintAllocator({ profile }: BlueprintAllocatorProps) {
  const updateFootballOperationsBudget = useProgramStore(
    (state) => state.updateFootballOperationsBudget
  );
  const databaseTotalPoints =
    typeof profile.school.dynastyPoints?.total === "number"
      ? profile.school.dynastyPoints.total
      : undefined;
  const databaseAvailablePoints =
    getAvailableDynastyPoints(profile.school.dynastyPoints) ??
    profile.school.blueprintSnapshot?.availableDynastyPoints;
  const defaultTotalPoints =
    profile.seasonBudget.totalDynastyPoints > 0
      ? profile.seasonBudget.totalDynastyPoints
      : typeof databaseTotalPoints === "number"
      ? databaseTotalPoints
      : typeof databaseAvailablePoints === "number"
        ? databaseAvailablePoints
        : 0;
  const [totalDynastyPoints, setTotalDynastyPoints] = useState(defaultTotalPoints);
  const [actualSpend, setActualSpend] = useState<BlueprintActualSpend>(
    profile.seasonBudget.allocations
  );

  const recommendation = useMemo(
    () => generateBlueprintRecommendation(totalDynastyPoints, profile, actualSpend),
    [actualSpend, profile, totalDynastyPoints]
  );
  const forecast = useMemo(
    () =>
      generateBudgetForecast(
        totalDynastyPoints,
        actualSpend,
        profile.seasonBudget.recommendedAllocations
      ),
    [actualSpend, profile.seasonBudget.recommendedAllocations, totalDynastyPoints]
  );
  const budgetLocked = profile.budgetLocked || profile.seasonBudget.locked;

  useEffect(() => {
    updateFootballOperationsBudget({
      totalDynastyPoints,
      allocations: actualSpend
    });
  }, [actualSpend, totalDynastyPoints, updateFootballOperationsBudget]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Team Database Total"
          value={formatDynastyPointValue(profile.school.dynastyPoints?.total)}
          detail="Dynasty Points"
        />
        <MetricCard
          label="Points Used"
          value={`${recommendation.usedPoints}`}
          detail="Dynasty Points"
        />
        <MetricCard
          label="Points Available"
          value={`${recommendation.availablePoints}`}
          detail="Dynasty Points"
        />
      </div>

      {budgetLocked ? (
        <Card className="border-gold-400/30 bg-gold-400/[0.06] p-5">
          <div className="flex gap-3">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-white">Budget Locked</p>
              <p className="mt-1 text-sm leading-6 text-blueprint-100">
                {profile.seasonBudget.lockReason ??
                  "Changes available during Offseason Planning."}
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      <Card className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
            <StatusBadge>Annual Budget</StatusBadge>
            <Calculator className="h-4 w-4 text-turf-400" aria-hidden="true" />
          </div>
            <h2 className="mt-4 text-xl font-semibold text-white">
              Football Operations Budget
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blueprint-200">
              Enter the total points available at the start of the season. Points used come from
              category spending, and points available calculate automatically.
            </p>
          </div>

          <label className="block w-full max-w-xs">
            <span className="text-sm font-medium text-blueprint-100">
              Total Dynasty Points
            </span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/[0.045] px-4 text-sm text-white outline-none transition-colors placeholder:text-blueprint-400 focus:border-turf-400/60 focus:ring-2 focus:ring-turf-400/20"
              disabled={budgetLocked}
              min={0}
              onChange={(event) => setTotalDynastyPoints(Number(event.target.value))}
              type="number"
              value={totalDynastyPoints}
            />
          </label>
        </div>
      </Card>

      <Card className="p-6">
        <div>
          <StatusBadge>Current Allocation</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Points Used by Category</h2>
          <p className="mt-2 text-sm leading-6 text-blueprint-200">
            Use the current values from your Dynasty Blueprint screen. Leave a category at zero if
            no points have been spent there yet.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {actualInputFields.map((field) => (
            <label className="block" key={field.category}>
              <span className="text-sm font-medium text-blueprint-100">{field.label}</span>
              <input
                className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/[0.045] px-4 text-sm text-white outline-none transition-colors placeholder:text-blueprint-400 focus:border-turf-400/60 focus:ring-2 focus:ring-turf-400/20"
                disabled={budgetLocked}
                min={0}
                onChange={(event) =>
                  setActualSpend((current) => ({
                    ...current,
                    [field.category]: Number(event.target.value)
                  }))
                }
                type="number"
                value={actualSpend[field.category]}
              />
            </label>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Total Dynasty Points" value={`${recommendation.totalPoints}`} />
        <MetricCard
          label="Points Used"
          value={`${recommendation.usedPoints}`}
          detail="Actual entered"
        />
        <MetricCard
          label="Points Available"
          value={`${recommendation.availablePoints}`}
          detail="Dynasty Points"
        />
      </div>

      <section className="space-y-4">
        <div>
          <StatusBadge>Allocation Comparison</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">
            Current Allocation vs Recommended Allocation
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {recommendation.allocations.map((allocation) => (
            <AllocationCard allocation={allocation} key={allocation.category} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <BudgetTimelineCard
          allocations={recommendation.allocations}
          budgetLocked={budgetLocked}
        />
        <BudgetForecastCard forecast={forecast} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <StrategicSummary summary={recommendation.strategicSummary} />
        <TradeoffList tradeoffs={recommendation.tradeoffs} />
      </div>
    </div>
  );
}

const actualInputFields: Array<{ category: BlueprintCategory; label: string }> = [
  { category: "staff", label: "Staff" },
  { category: "facilities", label: "Facilities" },
  { category: "recruitingNil", label: "Recruiting NIL" },
  { category: "rosterNil", label: "Roster NIL" }
];
