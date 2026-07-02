import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

type RecruitingImpactCardProps = {
  impact: string;
};

export function RecruitingImpactCard({ impact }: RecruitingImpactCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Recruiting Impact</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">How This Changes the Board</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-blueprint-100">{impact}</p>
    </Card>
  );
}
