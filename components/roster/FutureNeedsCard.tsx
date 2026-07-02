import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { FutureRosterNeeds, RecruitingPriority } from "@/types/roster";

type FutureNeedsCardProps = {
  needs: FutureRosterNeeds;
};

export function FutureNeedsCard({ needs }: FutureNeedsCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Future Needs</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Roster Need Tiers</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <NeedColumn title="Critical Needs" needs={needs.criticalNeeds} />
        <NeedColumn title="Important Needs" needs={needs.importantNeeds} />
        <NeedColumn title="Depth Needs" needs={needs.depthNeeds} />
      </div>
    </Card>
  );
}

function NeedColumn({ title, needs }: { title: string; needs: RecruitingPriority[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <div className="mt-4 space-y-3">
        {needs.length > 0 ? (
          needs.map((need) => (
            <div key={need.position}>
              <StatusBadge>{need.position}</StatusBadge>
              <p className="mt-2 text-sm leading-6 text-blueprint-200">{need.reason}</p>
            </div>
          ))
        ) : (
          <p className="text-sm leading-6 text-blueprint-300">No active needs in this tier.</p>
        )}
      </div>
    </div>
  );
}
