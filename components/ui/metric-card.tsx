import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";

type MetricCardProps = {
  label: string;
  value: string;
  detail?: string;
  className?: string;
};

export function MetricCard({ label, value, detail, className }: MetricCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-blueprint-300">
        {label}
      </p>
      <p className="mt-4 text-2xl font-semibold text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm text-blueprint-200">{detail}</p> : null}
    </Card>
  );
}
