"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { oklahomaMockRoster } from "@/data/mock-roster";
import {
  oklahomaNILGuidance,
  oklahomaPipelineStrategy,
  oklahomaRecruitingOverview,
  oklahomaRecruitingSummary,
  oklahomaTargetRecruits
} from "@/data/mock-recruits";
import { NILRecruitingGuidance } from "@/components/recruiting/NILRecruitingGuidance";
import { PipelineStrategyCard } from "@/components/recruiting/PipelineStrategyCard";
import { RecruitingOverviewCard } from "@/components/recruiting/RecruitingOverviewCard";
import { RecruitingSummary } from "@/components/recruiting/RecruitingSummary";
import { TargetRecruitTable } from "@/components/recruiting/TargetRecruitTable";
import { TeamNeedsCard } from "@/components/recruiting/TeamNeedsCard";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useProgramStore } from "@/store/program-store";
import {
  evaluateTargetRecruits,
  getTopPositionNeeds
} from "@/utils/recruiting-recommendations";
import { generateRecruitingPriorities } from "@/utils/roster-recommendations";

export default function RecruitingCommandCenterPage() {
  const programProfile = useProgramStore((state) => state.programProfile);
  const teamNeeds = generateRecruitingPriorities(oklahomaMockRoster.positionGroups);
  const evaluatedRecruits = evaluateTargetRecruits(oklahomaTargetRecruits);
  const topPositionNeeds = getTopPositionNeeds(teamNeeds);

  if (!programProfile) {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Talent Acquisition"
          title="Recruiting Command Center"
          description="Create a Program Profile before evaluating targets, pipelines, and recruiting NIL."
          status="Setup Needed"
        />

        <Card className="p-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-turf-400/10 text-turf-400">
              <ClipboardList className="h-6 w-6" aria-hidden="true" />
            </div>
            <StatusBadge className="mt-6">No Program Profile</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Start with Welcome to the Program
            </h2>
            <p className="mt-3 text-sm leading-6 text-blueprint-200">
              Recruiting Command Center needs the selected school and coach profile before showing
              position needs, target fit, and pipeline strategy.
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
        eyebrow="Talent Acquisition"
        title="Recruiting Command Center"
        description={`A strategic recruiting view for ${programProfile.school.name}'s position needs, target fit, NIL posture, and pipeline focus.`}
        status="Recruiting Active"
      />

      <RecruitingOverviewCard
        overview={oklahomaRecruitingOverview}
        topPositionNeeds={topPositionNeeds}
      />

      <TeamNeedsCard needs={teamNeeds} />

      <TargetRecruitTable recruits={evaluatedRecruits} />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <NILRecruitingGuidance guidance={oklahomaNILGuidance} />
        <PipelineStrategyCard strategy={oklahomaPipelineStrategy} />
      </div>

      <RecruitingSummary summary={oklahomaRecruitingSummary} />
    </div>
  );
}
