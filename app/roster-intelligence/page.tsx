"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { oklahomaMockRoster } from "@/data/mock-roster";
import { PlayerProgressionSnapshot } from "@/components/roster/PlayerProgressionSnapshot";
import { PositionGroupTable } from "@/components/roster/PositionGroupTable";
import { RecruitingPrioritiesCard } from "@/components/roster/RecruitingPrioritiesCard";
import { RosterOverviewCard } from "@/components/roster/RosterOverviewCard";
import { RosterRecommendationSummary } from "@/components/roster/RosterRecommendationSummary";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useProgramStore } from "@/store/program-store";
import { generateRecruitingPriorities } from "@/utils/roster-recommendations";

export default function RosterIntelligencePage() {
  const programProfile = useProgramStore((state) => state.programProfile);
  const recruitingPriorities = generateRecruitingPriorities(
    oklahomaMockRoster.positionGroups
  );

  if (!programProfile) {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Roster View"
          title="Roster Intelligence"
          description="Create a Program Profile before reviewing roster strengths and future needs."
          status="Setup Needed"
        />

        <Card className="p-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-turf-400/10 text-turf-400">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <StatusBadge className="mt-6">No Program Profile</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Start with Welcome to the Program
            </h2>
            <p className="mt-3 text-sm leading-6 text-blueprint-200">
              Roster Intelligence needs the selected school and coach profile before presenting
              position strengths and recruiting needs.
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
        eyebrow="Roster View"
        title="Roster Intelligence"
        description={`A decision-oriented view of ${programProfile.school.name}'s roster strength, development outlook, and recruiting needs.`}
        status="Roster Active"
      />

      <RosterOverviewCard overview={oklahomaMockRoster.overview} />

      <PositionGroupTable groups={oklahomaMockRoster.positionGroups} />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <PlayerProgressionSnapshot progression={oklahomaMockRoster.progression} />
        <RecruitingPrioritiesCard priorities={recruitingPriorities} />
      </div>

      <RosterRecommendationSummary summary={oklahomaMockRoster.recommendationSummary} />
    </div>
  );
}
