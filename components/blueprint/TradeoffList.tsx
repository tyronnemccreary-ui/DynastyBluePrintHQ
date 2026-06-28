import { Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

type TradeoffListProps = {
  tradeoffs: string[];
};

export function TradeoffList({ tradeoffs }: TradeoffListProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Tradeoffs</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">What This Means</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
          <Scale className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {tradeoffs.map((tradeoff) => (
          <div
            className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-blueprint-100"
            key={tradeoff}
          >
            {tradeoff}
          </div>
        ))}
      </div>
    </Card>
  );
}
