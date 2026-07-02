import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  EvaluatedRecruit,
  RecruitRecommendation,
  RecruitStatus
} from "@/types/recruiting";

type TargetRecruitTableProps = {
  recruits: EvaluatedRecruit[];
  recruitStatuses?: Record<string, RecruitStatus>;
  onStatusChange?: (recruitId: string, status: RecruitStatus) => void;
};

const recommendationTone: Record<RecruitRecommendation, "neutral" | "ready" | "attention"> = {
  Pursue: "attention",
  Monitor: "ready",
  Pass: "neutral"
};

const offerStatusTone: Record<
  EvaluatedRecruit["offerStatus"],
  "neutral" | "ready" | "attention"
> = {
  "Below Expected": "attention",
  "At Expected": "ready",
  "Above Expected": "ready"
};

const recruitStatuses: RecruitStatus[] = [
  "Open",
  "Top 5",
  "Top 3",
  "Verbal Commit",
  "Hard Commit"
];

export function TargetRecruitTable({
  recruits,
  recruitStatuses: currentStatuses = {},
  onStatusChange
}: TargetRecruitTableProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Target Recruit Analysis</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Decision Board</h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="hidden grid-cols-[1.1fr_0.45fr_0.5fr_0.8fr_0.75fr_0.85fr_0.65fr_0.8fr_0.8fr_0.95fr_0.55fr_0.75fr_0.8fr] gap-3 border-b border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-blueprint-300 xl:grid">
          <span>Name</span>
          <span>Pos</span>
          <span>Stars</span>
          <span>Archetype</span>
          <span>State</span>
          <span>Pipeline</span>
          <span>Tier</span>
          <span>Expected NIL</span>
          <span>Current Offer</span>
          <span>Offer Status</span>
          <span>Need</span>
          <span>Call</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-white/10">
          {recruits.map((recruit) => {
            const currentStatus = currentStatuses[recruit.id] ?? "Open";

            return (
              <div
                className="grid gap-3 px-4 py-4 text-sm xl:grid-cols-[1.1fr_0.45fr_0.5fr_0.8fr_0.75fr_0.85fr_0.65fr_0.8fr_0.8fr_0.95fr_0.55fr_0.75fr_0.8fr] xl:items-center"
                key={recruit.id}
              >
                <div>
                  <p className="font-semibold text-white">{recruit.name}</p>
                  <p className="mt-1 text-xs text-blueprint-300 xl:hidden">
                    {recruit.position} • {recruit.starRating} star • {recruit.homeState}
                  </p>
                </div>
                <RecruitCell label="Position" value={recruit.position} />
                <RecruitCell label="Stars" value={`${recruit.starRating}`} />
                <RecruitCell label="Archetype" value={recruit.archetype} />
                <RecruitCell label="State" value={recruit.homeState} />
                <RecruitCell label="Pipeline" value={recruit.pipeline} />
                <RecruitCell label="Pipeline Strength" value={recruit.pipelineStrength} />
                <RecruitCell label="Expected NIL" value={`${recruit.expectedNil} pts`} />
                <RecruitCell label="Current Offer" value={`${recruit.currentOffer} pts`} />
                <div>
                  <StatusBadge tone={offerStatusTone[recruit.offerStatus]}>
                    {recruit.offerStatus}
                  </StatusBadge>
                  <p className="mt-2 text-xs text-blueprint-300">
                    Interest {formatInterestModifier(recruit.interestModifier)}
                  </p>
                </div>
                <RecruitCell label="Need" value={recruit.teamNeedFit} />
                <div>
                  <StatusBadge tone={recommendationTone[recruit.recommendation]}>
                    {recruit.recommendation}
                  </StatusBadge>
                </div>
                <div>
                  <select
                    className="h-9 w-full rounded-md border border-white/10 bg-white/[0.045] px-2 text-xs font-medium text-blueprint-50 outline-none transition-colors focus:border-turf-400/60 focus:ring-2 focus:ring-turf-400/20"
                    disabled={!onStatusChange}
                    onChange={(event) =>
                      onStatusChange?.(recruit.id, event.target.value as RecruitStatus)
                    }
                    value={currentStatus}
                  >
                    {recruitStatuses.map((status) => (
                      <option className="bg-blueprint-950 text-white" key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {currentStatus === "Verbal Commit" ? (
                    <p className="mt-2 text-xs text-blueprint-300">Likely, not final.</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function RecruitCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-blueprint-400 xl:hidden">
        {label}
      </p>
      <p className="mt-1 text-sm text-blueprint-100 xl:mt-0">{value}</p>
    </div>
  );
}

function formatInterestModifier(value: number) {
  if (value === 0) {
    return "0";
  }

  return value > 0 ? `+${value}` : `${value}`;
}
