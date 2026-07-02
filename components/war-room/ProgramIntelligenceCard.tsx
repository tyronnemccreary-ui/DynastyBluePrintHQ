import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ProgramIntelligenceReport } from "@/intelligence/types/reports";

type ProgramIntelligenceCardProps = {
  intelligence: ProgramIntelligenceReport;
};

export function ProgramIntelligenceCard({
  intelligence
}: ProgramIntelligenceCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Connected Intelligence</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">
          Program Intelligence
        </h2>
        <p className="mt-2 text-sm leading-6 text-blueprint-200">
          Department reports now roll into one football operations view.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <IntelligenceList title="Top Strengths" items={intelligence.strengths} tone="ready" />
        <IntelligenceList title="Top Risks" items={intelligence.weaknesses} tone="attention" />
        <IntelligenceList
          title="Top Opportunities"
          items={intelligence.opportunities}
          tone="neutral"
        />
      </div>
    </Card>
  );
}

function IntelligenceList({
  title,
  items,
  tone
}: {
  title: string;
  items: string[];
  tone: "ready" | "attention" | "neutral";
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.025] p-4">
      <StatusBadge tone={tone}>{title}</StatusBadge>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-blueprint-100">
        {items.slice(0, 3).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
