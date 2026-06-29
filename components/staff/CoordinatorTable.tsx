import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { EvaluatedCoordinator, StaffRecommendation } from "@/types/staff";

type CoordinatorTableProps = {
  coordinators: EvaluatedCoordinator[];
};

const recommendationTone: Record<StaffRecommendation, "neutral" | "ready" | "attention"> = {
  Hire: "attention",
  Retain: "ready",
  Monitor: "neutral",
  Pass: "neutral"
};

export function CoordinatorTable({ coordinators }: CoordinatorTableProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Coordinator Evaluation</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Coordinator Board</h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="hidden grid-cols-[1.2fr_1fr_0.55fr_1fr_0.9fr_0.9fr_0.9fr_0.8fr_0.9fr] gap-4 border-b border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-blueprint-300 xl:grid">
          <span>Name</span>
          <span>Role</span>
          <span>Level</span>
          <span>Archetype</span>
          <span>Scheme</span>
          <span>Recruiting</span>
          <span>Development</span>
          <span>Cost</span>
          <span>Call</span>
        </div>

        <div className="divide-y divide-white/10">
          {coordinators.map((coordinator) => (
            <div
              className="grid gap-3 px-4 py-4 text-sm xl:grid-cols-[1.2fr_1fr_0.55fr_1fr_0.9fr_0.9fr_0.9fr_0.8fr_0.9fr] xl:items-center"
              key={coordinator.id}
            >
              <div>
                <p className="font-semibold text-white">{coordinator.name}</p>
                <p className="mt-1 text-xs text-blueprint-300 xl:hidden">
                  {coordinator.role} • Level {coordinator.level}
                </p>
              </div>
              <StaffCell label="Role" value={coordinator.role} />
              <StaffCell label="Level" value={`${coordinator.level}`} />
              <StaffCell label="Archetype" value={coordinator.archetype} />
              <StaffCell label="Scheme Fit" value={coordinator.schemeFit} />
              <StaffCell label="Recruiting" value={coordinator.recruitingImpact} />
              <StaffCell label="Development" value={coordinator.developmentImpact} />
              <StaffCell label="Cost" value={`${coordinator.dynastyPointCost}`} />
              <div>
                <StatusBadge tone={recommendationTone[coordinator.recommendation]}>
                  {coordinator.recommendation}
                </StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function StaffCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-blueprint-400 xl:hidden">
        {label}
      </p>
      <p className="mt-1 text-sm text-blueprint-100 xl:mt-0">{value}</p>
    </div>
  );
}
