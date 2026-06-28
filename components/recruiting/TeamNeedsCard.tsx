import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { NeedLevel, RecruitingPriority } from "@/types/roster";

type TeamNeedsCardProps = {
  needs: RecruitingPriority[];
};

const needTone: Record<NeedLevel, "neutral" | "ready" | "attention"> = {
  High: "attention",
  Medium: "ready",
  Low: "neutral"
};

export function TeamNeedsCard({ needs }: TeamNeedsCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Team Needs</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Priority Position Needs</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {needs.map((need) => (
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4" key={need.position}>
            <div className="flex items-start justify-between gap-4">
              <p className="text-lg font-semibold text-white">{need.position}</p>
              <StatusBadge tone={needTone[need.needLevel]}>{need.needLevel}</StatusBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-blueprint-100">{need.reason}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
