import { DepartmentReportCard } from "@/components/operations/DepartmentReportCard";
import { ExecutiveSummary } from "@/components/operations/ExecutiveSummary";
import { RecommendationList } from "@/components/operations/RecommendationList";
import { StatusBadge } from "@/components/ui/status-badge";
import type { WeeklyOperationsBriefing as WeeklyOperationsBriefingType } from "@/types/weekly-briefing";

type WeeklyOperationsBriefingProps = {
  briefing: WeeklyOperationsBriefingType;
};

export function WeeklyOperationsBriefing({ briefing }: WeeklyOperationsBriefingProps) {
  return (
    <div className="space-y-6">
      <ExecutiveSummary summary={briefing.executiveSummary} />

      <section className="space-y-4">
        <div>
          <StatusBadge>Department Reports</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Staff Meeting Notes</h2>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          {briefing.departmentReports.map((report) => (
            <DepartmentReportCard key={report.departmentName} report={report} />
          ))}
        </div>
      </section>

      <RecommendationList recommendations={briefing.topDecisions} />
    </div>
  );
}
