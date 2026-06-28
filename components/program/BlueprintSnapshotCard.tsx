import { CircleDollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { School } from "@/types/school";

type BlueprintSnapshotCardProps = {
  school: School;
};

export function BlueprintSnapshotCard({ school }: BlueprintSnapshotCardProps) {
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

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.035] p-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-blueprint-300">
          Available Dynasty Points
        </p>
        <p className="mt-4 text-3xl font-semibold text-white">
          {school.blueprintSnapshot.availableDynastyPoints}
        </p>
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-blueprint-100">Suggested Focus Areas</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {school.blueprintSnapshot.focusAreas.map((area) => (
            <StatusBadge key={area}>{area}</StatusBadge>
          ))}
        </div>
      </div>
    </Card>
  );
}
