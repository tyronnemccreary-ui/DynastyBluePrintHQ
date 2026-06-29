import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { StaffRecommendation, SupportStaffOption } from "@/types/staff";

type SupportStaffCardProps = {
  options: SupportStaffOption[];
};

const recommendationTone: Record<StaffRecommendation, "neutral" | "ready" | "attention"> = {
  Hire: "attention",
  Retain: "ready",
  Monitor: "neutral",
  Pass: "neutral"
};

export function SupportStaffCard({ options }: SupportStaffCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Support Staff Analysis</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Department Support</h2>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {options.map((option) => (
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4" key={option.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-white">{option.type}</p>
                <p className="mt-2 text-sm text-turf-400">Cost {option.cost}</p>
              </div>
              <StatusBadge tone={recommendationTone[option.recommendation]}>
                {option.recommendation}
              </StatusBadge>
            </div>
            <p className="mt-4 text-sm leading-6 text-blueprint-100">{option.benefit}</p>
            <p className="mt-3 text-sm leading-6 text-blueprint-200">
              Best use: {option.bestUseCase}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
