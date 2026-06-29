import { StatusBadge } from "@/components/ui/status-badge";
import type { RecommendationPriority } from "@/types/recommendation";

type PriorityBadgeProps = {
  priority: RecommendationPriority;
};

const priorityTone: Record<RecommendationPriority, "neutral" | "ready" | "attention"> = {
  Critical: "attention",
  High: "attention",
  Medium: "ready",
  Low: "neutral"
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return <StatusBadge tone={priorityTone[priority]}>{priority}</StatusBadge>;
}
