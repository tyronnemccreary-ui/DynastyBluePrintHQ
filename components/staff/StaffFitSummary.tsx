import { FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

type StaffFitSummaryProps = {
  summary: string;
};

export function StaffFitSummary({ summary }: StaffFitSummaryProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Staff Fit Summary</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Program Fit</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-blueprint-100">{summary}</p>
    </Card>
  );
}
