import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  EvaluatedTransfer,
  ProjectedImpact,
  TransferRecommendation
} from "@/types/transfer";

type TransferTargetTableProps = {
  transfers: EvaluatedTransfer[];
};

const impactTone: Record<ProjectedImpact, "neutral" | "ready" | "attention"> = {
  "Immediate Starter": "attention",
  "Strong Rotation": "ready",
  "Development Prospect": "neutral",
  "Not Recommended": "neutral"
};

const recommendationTone: Record<TransferRecommendation, "neutral" | "ready" | "attention"> = {
  "Should Pursue": "attention",
  "Maybe Pursue": "ready",
  Pass: "neutral"
};

export function TransferTargetTable({ transfers }: TransferTargetTableProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Recommended Transfer Targets</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Portal Evaluation Board</h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <div className="hidden grid-cols-[1.2fr_0.55fr_0.7fr_0.75fr_1fr_1fr_1.1fr_1fr] gap-4 border-b border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-blueprint-300 xl:grid">
          <span>Name</span>
          <span>Pos</span>
          <span>OVR</span>
          <span>Year</span>
          <span>Archetype</span>
          <span>Previous</span>
          <span>Impact</span>
          <span>Eval</span>
        </div>

        <div className="divide-y divide-white/10">
          {transfers.map((transfer) => (
            <div
              className="grid gap-3 px-4 py-4 text-sm xl:grid-cols-[1.2fr_0.55fr_0.7fr_0.75fr_1fr_1fr_1.1fr_1fr] xl:items-center"
              key={transfer.id}
            >
              <div>
                <p className="font-semibold text-white">{transfer.name}</p>
                <p className="mt-1 text-xs text-blueprint-300 xl:hidden">
                  {transfer.position} • {transfer.overallRating} OVR • {transfer.previousSchool}
                </p>
              </div>
              <TransferCell label="Position" value={transfer.position} />
              <TransferCell label="Overall" value={`${transfer.overallRating}`} />
              <TransferCell label="Year" value={transfer.year} />
              <TransferCell label="Archetype" value={transfer.archetype} />
              <TransferCell label="Previous School" value={transfer.previousSchool} />
              <div>
                <StatusBadge tone={impactTone[transfer.projectedImpact]}>
                  {transfer.projectedImpact}
                </StatusBadge>
              </div>
              <div>
                <StatusBadge tone={recommendationTone[transfer.recommendation]}>
                  {transfer.recommendation}
                </StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function TransferCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-blueprint-400 xl:hidden">
        {label}
      </p>
      <p className="mt-1 text-sm text-blueprint-100 xl:mt-0">{value}</p>
    </div>
  );
}
