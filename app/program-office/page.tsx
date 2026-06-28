"use client";

import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { ADExpectationsCard } from "@/components/program/ADExpectationsCard";
import { BlueprintSnapshotCard } from "@/components/program/BlueprintSnapshotCard";
import { FacilitiesCard } from "@/components/program/FacilitiesCard";
import { ProgramHeader } from "@/components/program/ProgramHeader";
import { TeamIdentityCard } from "@/components/program/TeamIdentityCard";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useProgramStore } from "@/store/program-store";

export default function ProgramOfficePage() {
  const programProfile = useProgramStore((state) => state.programProfile);

  if (!programProfile) {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Program Identity"
          title="Program Office"
          description="Create a Program Profile before reviewing the identity of your football program."
          status="Setup Needed"
        />

        <Card className="p-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-turf-400/10 text-turf-400">
              <Building2 className="h-6 w-6" aria-hidden="true" />
            </div>
            <StatusBadge className="mt-6">No Program Profile</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Start with Welcome to the Program
            </h2>
            <p className="mt-3 text-sm leading-6 text-blueprint-200">
              The Program Office displays school identity, expectations, facilities, and the
              Blueprint snapshot after a basic profile has been created.
            </p>
            <Link
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blueprint-100 px-4 text-sm font-medium text-blueprint-950 transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-turf-400/60"
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
        eyebrow="Program Identity"
        title="Program Office"
        description="A focused view of the football program's identity, expectations, facilities, and Blueprint resources."
        status="Profile Active"
      />

      <ProgramHeader profile={programProfile} />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <TeamIdentityCard school={programProfile.school} />
          <FacilitiesCard school={programProfile.school} />
        </div>

        <div className="space-y-6">
          <ADExpectationsCard school={programProfile.school} />
          <BlueprintSnapshotCard school={programProfile.school} />
        </div>
      </div>
    </div>
  );
}
