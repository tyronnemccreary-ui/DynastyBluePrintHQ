import { Map } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PipelineStrategy } from "@/types/recruiting";

type PipelineStrategyCardProps = {
  strategy: PipelineStrategy;
};

export function PipelineStrategyCard({ strategy }: PipelineStrategyCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Pipeline Strategy</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Recommended Focus</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
          <Map className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {strategy.focusAreas.map((area) => (
          <StatusBadge key={area}>{area}</StatusBadge>
        ))}
      </div>
      <p className="mt-5 text-sm leading-7 text-blueprint-100">{strategy.summary}</p>
    </Card>
  );
}
