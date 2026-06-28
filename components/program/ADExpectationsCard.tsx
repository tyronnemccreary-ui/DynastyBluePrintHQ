import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { School } from "@/types/school";

type ADExpectationsCardProps = {
  school: School;
};

export function ADExpectationsCard({ school }: ADExpectationsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Athletic Director</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Expectations</h2>
        </div>
        <StatusBadge tone="ready">{school.adExpectations.expectationLevel}</StatusBadge>
      </div>

      <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.035] p-4">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-blueprint-300">
          School Demeanor
        </p>
        <p className="mt-3 text-base font-semibold text-white">
          {school.adExpectations.demeanor}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {school.adExpectations.activeGoals.map((goal) => (
          <div
            className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4"
            key={goal}
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-turf-400" aria-hidden="true" />
            <p className="text-sm leading-6 text-blueprint-100">{goal}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
