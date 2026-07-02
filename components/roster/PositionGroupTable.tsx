import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { NeedLevel, PositionGroup } from "@/types/roster";

type PositionGroupTableProps = {
  groups: PositionGroup[];
};

const needTone: Record<NeedLevel, "neutral" | "ready" | "attention"> = {
  High: "attention",
  Medium: "ready",
  Low: "neutral"
};

export function PositionGroupTable({ groups }: PositionGroupTableProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Position Group Analysis</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Roster Strength by Room</h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="hidden grid-cols-[0.7fr_0.8fr_0.8fr_0.9fr_0.9fr_0.9fr] gap-4 border-b border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-blueprint-300 lg:grid">
          <span>Position</span>
          <span>Current</span>
          <span>Future</span>
          <span>Depth</span>
          <span>Senior Risk</span>
          <span>Need</span>
        </div>

        <div className="divide-y divide-white/10">
          {groups.map((group) => (
            <div
              className="grid gap-3 px-4 py-4 text-sm lg:grid-cols-[0.7fr_0.8fr_0.8fr_0.9fr_0.9fr_0.9fr] lg:items-center"
              key={group.position}
            >
              <div>
                <p className="font-semibold text-white">{group.position}</p>
                <p className="mt-1 text-xs text-blueprint-300 lg:hidden">
                  {group.depthStatus} depth
                </p>
              </div>
              <RosterCell label="Current" value={group.currentGrade} />
              <RosterCell label="Future" value={group.futureGrade} />
              <RosterCell label="Depth" value={group.depthStatus} />
              <RosterCell label="Senior Risk" value={group.seniorDepartureRisk} />
              <div>
                <StatusBadge tone={needTone[group.needLevel]}>{group.needLevel}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function RosterCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-blueprint-400 lg:hidden">
        {label}
      </p>
      <p className="mt-1 text-sm text-blueprint-100 lg:mt-0">{value}</p>
    </div>
  );
}
