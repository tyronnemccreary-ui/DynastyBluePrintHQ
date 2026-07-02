import { ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { RosterAlert } from "@/types/roster";

type RosterAlertCardProps = {
  alert: RosterAlert;
};

export function RosterAlertCard({ alert }: RosterAlertCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge tone="ready">Roster Intelligence</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Roster Alert</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <AlertItem label="Top Strength" value={alert.topStrength} />
        <AlertItem label="Top Weakness" value={alert.topWeakness} />
        <AlertItem label="Recruiting Need" value={alert.topRecruitingNeed} />
      </div>
    </Card>
  );
}

function AlertItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blueprint-300">
        {label}
      </p>
      <p className="mt-3 text-sm leading-6 text-blueprint-100">{value}</p>
    </div>
  );
}
