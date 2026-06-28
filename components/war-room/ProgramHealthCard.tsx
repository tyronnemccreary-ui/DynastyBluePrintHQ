import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ProgramHealth } from "@/types/recommendation";

type ProgramHealthCardProps = {
  health: ProgramHealth;
};

const healthRows: Array<{
  key: keyof ProgramHealth;
  label: string;
}> = [
  { key: "roster", label: "Roster" },
  { key: "recruiting", label: "Recruiting" },
  { key: "blueprint", label: "Blueprint" },
  { key: "staff", label: "Staff" }
];

export function ProgramHealthCard({ health }: ProgramHealthCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Program Health</StatusBadge>
          <p className="mt-4 text-5xl font-semibold text-white">{health.overall}</p>
          <p className="mt-2 text-sm text-blueprint-200">Overall Program Health</p>
        </div>
        <StatusBadge tone="ready">Stable</StatusBadge>
      </div>

      <div className="mt-6 space-y-4">
        {healthRows.map((row) => (
          <HealthBar key={row.key} label={row.label} value={health[row.key]} />
        ))}
      </div>
    </Card>
  );
}

function HealthBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-blueprint-100">{label}</span>
        <span className="text-blueprint-300">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-turf-400" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
