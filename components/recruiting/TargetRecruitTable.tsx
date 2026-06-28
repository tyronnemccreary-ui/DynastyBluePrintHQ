import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { EvaluatedRecruit, RecruitRecommendation } from "@/types/recruiting";

type TargetRecruitTableProps = {
  recruits: EvaluatedRecruit[];
};

const recommendationTone: Record<RecruitRecommendation, "neutral" | "ready" | "attention"> = {
  Pursue: "attention",
  Monitor: "ready",
  Pass: "neutral"
};

export function TargetRecruitTable({ recruits }: TargetRecruitTableProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Target Recruit Analysis</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Decision Board</h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="hidden grid-cols-[1.2fr_0.6fr_0.7fr_1fr_0.9fr_0.9fr_0.9fr_0.9fr_0.9fr] gap-4 border-b border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-blueprint-300 xl:grid">
          <span>Name</span>
          <span>Pos</span>
          <span>Stars</span>
          <span>Archetype</span>
          <span>State</span>
          <span>Pipeline</span>
          <span>NIL</span>
          <span>Need</span>
          <span>Call</span>
        </div>

        <div className="divide-y divide-white/10">
          {recruits.map((recruit) => (
            <div
              className="grid gap-3 px-4 py-4 text-sm xl:grid-cols-[1.2fr_0.6fr_0.7fr_1fr_0.9fr_0.9fr_0.9fr_0.9fr_0.9fr] xl:items-center"
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
              <RecruitCell label="Pipeline" value={recruit.pipelineFit} />
              <RecruitCell label="NIL" value={recruit.nilExpectation} />
              <RecruitCell label="Need" value={recruit.teamNeedFit} />
              <div>
                <StatusBadge tone={recommendationTone[recruit.recommendation]}>
                  {recruit.recommendation}
                </StatusBadge>
              </div>
            </div>
          ))}
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
