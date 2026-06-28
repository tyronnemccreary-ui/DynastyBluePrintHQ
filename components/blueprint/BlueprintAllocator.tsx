"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { AllocationCard } from "@/components/blueprint/AllocationCard";
import { StrategicSummary } from "@/components/blueprint/StrategicSummary";
import { TradeoffList } from "@/components/blueprint/TradeoffList";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ProgramProfile } from "@/types/program";
import { generateBlueprintRecommendation } from "@/utils/blueprint-recommendations";

type BlueprintAllocatorProps = {
  profile: ProgramProfile;
};

export function BlueprintAllocator({ profile }: BlueprintAllocatorProps) {
  const defaultPoints = profile.school.blueprintSnapshot.availableDynastyPoints;
  const [availablePoints, setAvailablePoints] = useState(defaultPoints);

  const recommendation = useMemo(
    () => generateBlueprintRecommendation(availablePoints, profile),
    [availablePoints, profile]
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <StatusBadge>Dynasty Points</StatusBadge>
              <Calculator className="h-4 w-4 text-turf-400" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">Available Point Budget</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blueprint-200">
              Enter the points available for this planning window. The recommendation updates
              across the four core Blueprint areas.
            </p>
          </div>

          <label className="block w-full max-w-xs">
            <span className="text-sm font-medium text-blueprint-100">
              Available Dynasty Points
            </span>
            <input
              className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/[0.045] px-4 text-sm text-white outline-none transition-colors placeholder:text-blueprint-400 focus:border-turf-400/60 focus:ring-2 focus:ring-turf-400/20"
              min={0}
              onChange={(event) => setAvailablePoints(Number(event.target.value))}
              type="number"
              value={availablePoints}
            />
          </label>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Available"
          value={`${recommendation.availablePoints}`}
          detail="Dynasty Points"
        />
        <MetricCard label="Allocated" value={`${allocatedTotal(recommendation.allocations)}`} />
        <MetricCard label="Remaining" value={`${recommendation.remainingPoints}`} />
      </div>

      <section className="space-y-4">
        <div>
          <StatusBadge>Allocation Recommendation</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Recommended Split</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          {recommendation.allocations.map((allocation) => (
            <AllocationCard allocation={allocation} key={allocation.category} />
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <StrategicSummary summary={recommendation.strategicSummary} />
        <TradeoffList tradeoffs={recommendation.tradeoffs} />
      </div>
    </div>
  );
}

function allocatedTotal(allocations: Array<{ recommendedPoints: number }>) {
  return allocations.reduce((total, allocation) => total + allocation.recommendedPoints, 0);
}
