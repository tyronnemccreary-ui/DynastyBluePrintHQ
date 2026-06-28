import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";

type ModulePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  focusQuestion: string;
};

export function ModulePlaceholder({
  eyebrow,
  title,
  description,
  focusQuestion
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        status="Sprint 1 Ready"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Module State" value="Foundation" detail="Placeholder page" />
        <MetricCard label="Version" value="1.0 MVP" detail="Scoped for Sprint 1" />
        <MetricCard label="Build Rule" value="No Logic" detail="UI shell only" />
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <StatusBadge>Screen Question</StatusBadge>
            <h2 className="mt-4 text-xl font-semibold text-white">
              {focusQuestion}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blueprint-200">
              This workspace is intentionally reserved for future sprint work. Sprint 1 establishes the navigation, layout, visual system, and page structure only.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
