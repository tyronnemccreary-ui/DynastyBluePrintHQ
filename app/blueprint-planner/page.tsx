"use client";

import Link from "next/link";
import { ArrowRight, FileStack } from "lucide-react";
import { BlueprintAllocator } from "@/components/blueprint/BlueprintAllocator";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useProgramStore } from "@/store/program-store";

export default function BlueprintPlannerPage() {
  const programProfile = useProgramStore((state) => state.programProfile);

  if (!programProfile) {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Resource Planning"
          title="Blueprint Planner"
          description="Create a Program Profile before planning Dynasty Point allocations."
          status="Setup Needed"
        />

        <Card className="p-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-turf-400/10 text-turf-400">
              <FileStack className="h-6 w-6" aria-hidden="true" />
            </div>
            <StatusBadge className="mt-6">No Program Profile</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Start with Welcome to the Program
            </h2>
            <p className="mt-3 text-sm leading-6 text-blueprint-200">
              The Blueprint Planner needs a school and coach profile before recommending how to
              distribute Dynasty Points.
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

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Resource Planning"
        title="Blueprint Planner"
        description="A simple planning view for allocating Dynasty Points across the core Blueprint areas."
        status="Planning Active"
      />

      <BlueprintAllocator profile={programProfile} />
    </div>
  );
}
