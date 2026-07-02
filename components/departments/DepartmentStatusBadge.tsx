import type { DepartmentStatus } from "@/types/department";
import { cn } from "@/utils/cn";

type DepartmentStatusBadgeProps = {
  status: DepartmentStatus;
  className?: string;
};

const statusStyles: Record<DepartmentStatus, string> = {
  Ready: "border-turf-400/35 bg-turf-400/10 text-turf-400",
  "Needs Activation": "border-[#f6b51e]/35 bg-[#f6b51e]/10 text-[#f6b51e]",
  "Season Locked": "border-white/10 bg-white/[0.055] text-blueprint-200"
};

export function DepartmentStatusBadge({
  status,
  className
}: DepartmentStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
