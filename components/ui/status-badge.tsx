import { cn } from "@/utils/cn";

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "ready" | "attention";
  className?: string;
};

const tones = {
  neutral: "border-white/10 bg-white/[0.055] text-blueprint-200",
  ready: "border-turf-400/35 bg-turf-400/10 text-turf-400",
  attention: "border-turf-400/45 bg-turf-400/15 text-blueprint-50"
};

export function StatusBadge({
  children,
  tone = "neutral",
  className
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
