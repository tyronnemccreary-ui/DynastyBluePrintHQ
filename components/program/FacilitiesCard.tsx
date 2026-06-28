import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { School } from "@/types/school";

type FacilitiesCardProps = {
  school: School;
};

export function FacilitiesCard({ school }: FacilitiesCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <StatusBadge>Facilities</StatusBadge>
        <h2 className="mt-4 text-xl font-semibold text-white">Development Environment</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Facility Tier" value={school.facilities.tier} />
        <MetricCard label="Facility Grade" value={school.facilities.grade} />
        <MetricCard label="Equipment Slots" value={`${school.facilities.equipmentSlots}`} />
      </div>
    </Card>
  );
}
