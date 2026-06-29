import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { EvaluatedTransfer } from "@/types/transfer";

type TransferFitCardProps = {
  transfer: EvaluatedTransfer;
};

export function TransferFitCard({ transfer }: TransferFitCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">{transfer.name}</p>
          <p className="mt-2 text-sm text-turf-400">
            {transfer.position} • {transfer.previousSchool}
          </p>
        </div>
        <StatusBadge>{transfer.recommendation}</StatusBadge>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <FitRow label="Position Need" value={transfer.positionNeed} />
        <FitRow label="Scheme Fit" value={transfer.schemeFit} />
        <FitRow label="Roster Fit" value={transfer.rosterFit} />
        <FitRow label="Development Timeline" value={transfer.developmentTimeline} />
        <FitRow label="Scholarship Value" value={transfer.scholarshipValue} />
      </dl>

      <p className="mt-5 text-sm leading-6 text-blueprint-100">{transfer.explanation}</p>
    </Card>
  );
}

function FitRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-blueprint-300">{label}</dt>
      <dd className="text-right font-medium text-white">{value}</dd>
    </div>
  );
}
