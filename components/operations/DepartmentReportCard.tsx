import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { DepartmentReport } from "@/types/weekly-briefing";

type DepartmentReportCardProps = {
  report: DepartmentReport;
};

export function DepartmentReportCard({ report }: DepartmentReportCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-white">{report.departmentName}</p>
          <p className="mt-2 text-sm text-turf-400">{report.status}</p>
        </div>
        <StatusBadge>{report.status}</StatusBadge>
      </div>

      <div className="mt-5 space-y-4">
        <ReportSection label="Key Observation" value={report.keyObservation} />
        <ReportSection label="Recommended Focus" value={report.recommendedFocus} />
      </div>
    </Card>
  );
}

function ReportSection({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-blueprint-300">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-blueprint-100">{value}</p>
    </div>
  );
}
