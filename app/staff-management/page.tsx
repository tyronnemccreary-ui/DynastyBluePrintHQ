"use client";

import Link from "next/link";
import { ArrowRight, UsersRound } from "lucide-react";
import {
  oklahomaCoordinators,
  oklahomaStaffOverview,
  oklahomaStaffSummary,
  oklahomaSupportStaff
} from "@/data/mock-staff";
import { DepartmentActivationCard } from "@/components/departments/DepartmentActivationCard";
import { CoordinatorTable } from "@/components/staff/CoordinatorTable";
import { HiringRecommendationCard } from "@/components/staff/HiringRecommendationCard";
import { StaffFitSummary } from "@/components/staff/StaffFitSummary";
import { StaffOverviewCard } from "@/components/staff/StaffOverviewCard";
import { SupportStaffCard } from "@/components/staff/SupportStaffCard";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useProgramStore } from "@/store/program-store";
import { getDepartmentActivation } from "@/utils/department-activation";
import { evaluateCoordinators } from "@/utils/staff-analysis";

export default function StaffManagementPage() {
  const programProfile = useProgramStore((state) => state.programProfile);
  const evaluatedCoordinators = evaluateCoordinators(oklahomaCoordinators);

  if (!programProfile) {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Staff Office"
          title="Staff Management"
          description="Create a Program Profile before evaluating coordinators and support staff."
          status="Setup Needed"
        />

        <Card className="p-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-turf-400/10 text-turf-400">
              <UsersRound className="h-6 w-6" aria-hidden="true" />
            </div>
            <StatusBadge className="mt-6">No Program Profile</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Start with Welcome to the Program
            </h2>
            <p className="mt-3 text-sm leading-6 text-blueprint-200">
              Staff Management needs the selected school and coach profile before evaluating staff
              fit, support roles, and hiring priorities.
            </p>
            <Link
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-turf-400 px-4 text-sm font-medium text-blueprint-950 transition-colors hover:bg-[#ffc83d] focus:outline-none focus:ring-2 focus:ring-turf-400/60"
              href="/welcome"
            >
              Go to Welcome
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const activation = getDepartmentActivation("staff-management", programProfile);

  if (activation?.status !== "Ready") {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Staff Office"
          title="Staff Management"
          description={`Staff Management is prepared for ${programProfile.school.name}, but it needs coaching staff data before live coordinator evaluation begins.`}
          status={activation?.status ?? "Needs Activation"}
        />

        {activation ? <DepartmentActivationCard department={activation} /> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Staff Office"
        title="Staff Management"
        description={`A focused staff evaluation view for ${programProfile.school.name}'s coordinator quality, support staff, and development priorities.`}
        status="Staff Active"
      />

      <StaffOverviewCard overview={oklahomaStaffOverview} />

      <CoordinatorTable coordinators={evaluatedCoordinators} />

      <SupportStaffCard options={oklahomaSupportStaff} />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <StaffFitSummary summary={oklahomaStaffSummary.fit} />
        <HiringRecommendationCard recommendation={oklahomaStaffSummary.hiringRecommendation} />
      </div>
    </div>
  );
}
