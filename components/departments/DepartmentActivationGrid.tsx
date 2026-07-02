import type { DepartmentActivation } from "@/types/department";
import { DepartmentActivationCard } from "@/components/departments/DepartmentActivationCard";
import { SectionHeader } from "@/components/ui/section-header";

type DepartmentActivationGridProps = {
  departments: DepartmentActivation[];
};

export function DepartmentActivationGrid({
  departments
}: DepartmentActivationGridProps) {
  return (
    <section className="space-y-4">
      <SectionHeader
        eyebrow="Operations Readiness"
        title="Department Activation"
        description="A quick view of which departments are ready now and which need dynasty-specific data."
        status="Activation Check"
      />
      <div className="grid gap-4 xl:grid-cols-2">
        {departments.map((department) => (
          <DepartmentActivationCard
            compact
            department={department}
            key={department.id}
          />
        ))}
      </div>
    </section>
  );
}
