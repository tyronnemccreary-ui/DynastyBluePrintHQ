import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { DepartmentActivation } from "@/types/department";
import { Card } from "@/components/ui/card";
import { DepartmentStatusBadge } from "@/components/departments/DepartmentStatusBadge";
import { cn } from "@/utils/cn";

type DepartmentActivationCardProps = {
  department: DepartmentActivation;
  compact?: boolean;
  className?: string;
};

export function DepartmentActivationCard({
  department,
  compact = false,
  className
}: DepartmentActivationCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-base font-semibold text-white">{department.name}</h3>
            <DepartmentStatusBadge status={department.status} />
          </div>
          <p className="mt-3 text-sm leading-6 text-blueprint-200">
            {department.activationMessage}
          </p>
          {!compact ? (
            <div className="mt-4 grid gap-4 text-xs text-blueprint-300 sm:grid-cols-2">
              <div>
                <p className="font-medium uppercase tracking-[0.18em] text-blueprint-400">
                  Required
                </p>
                <p className="mt-2 leading-5">{formatDataList(department.requiredData)}</p>
              </div>
              <div>
                <p className="font-medium uppercase tracking-[0.18em] text-blueprint-400">
                  Optional
                </p>
                <p className="mt-2 leading-5">{formatDataList(department.optionalData)}</p>
              </div>
            </div>
          ) : null}
        </div>
        <Link
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.045] px-4 text-sm font-medium text-blueprint-50 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-turf-400/60"
          href={department.actionHref}
        >
          {department.actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}

function formatDataList(items: string[]) {
  return items.length > 0 ? items.join(", ") : "None required";
}
