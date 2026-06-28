import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PlayerProgressionSnapshot as ProgressionSnapshot } from "@/types/roster";

type PlayerProgressionSnapshotProps = {
  progression: ProgressionSnapshot;
};

const progressionRows: Array<{
  key: keyof ProgressionSnapshot;
  label: string;
}> = [
  { key: "youngCoreStrength", label: "Young Core Strength" },
  { key: "seniorDepartureRisk", label: "Senior Departure Risk" },
  { key: "developmentUpside", label: "Development Upside" },
  { key: "facilityImpact", label: "Facility Impact" },
  { key: "staffImpact", label: "Staff Impact" }
];

export function PlayerProgressionSnapshot({
  progression
}: PlayerProgressionSnapshotProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Player Progression</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Future Roster Strength</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
          <TrendingUp className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {progressionRows.map((row) => (
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4" key={row.key}>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-blueprint-300">
              {row.label}
            </p>
            <p className="mt-2 text-sm leading-6 text-blueprint-100">{progression[row.key]}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
