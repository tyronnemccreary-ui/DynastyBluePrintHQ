"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { oklahomaMockRoster } from "@/data/mock-roster";
import { DepartmentActivationCard } from "@/components/departments/DepartmentActivationCard";
import { ScreenshotUploader } from "@/components/import/ScreenshotUploader";
import { FutureNeedsCard } from "@/components/roster/FutureNeedsCard";
import { PlayerProgressionSnapshot } from "@/components/roster/PlayerProgressionSnapshot";
import { PositionGroupTable } from "@/components/roster/PositionGroupTable";
import { RecruitingImpactCard } from "@/components/roster/RecruitingImpactCard";
import { RecruitingPrioritiesCard } from "@/components/roster/RecruitingPrioritiesCard";
import { RosterOverviewCard } from "@/components/roster/RosterOverviewCard";
import { RosterRecommendationSummary } from "@/components/roster/RosterRecommendationSummary";
import { RosterUploadSuccessCard } from "@/components/roster/RosterUploadSuccessCard";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useProgramStore } from "@/store/program-store";
import type { ScreenshotUpload } from "@/types/import";
import { getDepartmentActivation } from "@/utils/department-activation";
import {
  generateFutureRosterNeeds,
  generateRecruitingImpact,
  generateRecruitingPriorities
} from "@/utils/roster-recommendations";

export default function RosterIntelligencePage() {
  const programProfile = useProgramStore((state) => state.programProfile);
  const activateRosterIntelligence = useProgramStore(
    (state) => state.activateRosterIntelligence
  );
  const [uploads, setUploads] = useState<ScreenshotUpload[]>([]);
  const [completedRosterUpload, setCompletedRosterUpload] = useState<ScreenshotUpload | null>(
    null
  );
  const uploadsRef = useRef<ScreenshotUpload[]>(uploads);
  const activeRoster = programProfile?.roster.data ?? oklahomaMockRoster;
  const recruitingPriorities = generateRecruitingPriorities(activeRoster.positionGroups);
  const futureNeeds = generateFutureRosterNeeds(activeRoster.positionGroups);
  const recruitingImpact = generateRecruitingImpact(activeRoster.positionGroups);

  useEffect(() => {
    uploadsRef.current = uploads;
  }, [uploads]);

  useEffect(() => {
    return () => {
      uploadsRef.current.forEach((upload) => {
        if (upload.previewUrl) {
          URL.revokeObjectURL(upload.previewUrl);
        }
      });
    };
  }, []);

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

  const activation = getDepartmentActivation("roster-intelligence", programProfile);

  function handleRosterUploadComplete(upload: ScreenshotUpload) {
    if (upload.category !== "Roster" || upload.status !== "Complete") {
      return;
    }

    activateRosterIntelligence({
      roster: oklahomaMockRoster,
      sourceFileName: upload.fileName
    });
    setCompletedRosterUpload(upload);
  }

  if (activation?.status !== "Ready") {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Roster View"
          title="Roster Intelligence"
          description={`Roster Intelligence is prepared for ${programProfile.school.name}, but it needs roster data before live position analysis begins.`}
          status={activation?.status ?? "Needs Activation"}
        />

        {activation ? <DepartmentActivationCard department={activation} /> : null}

        {completedRosterUpload ? (
          <RosterUploadSuccessCard
            fileName={completedRosterUpload.fileName}
            onViewRoster={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        ) : null}

        <ScreenshotUploader
          initialCategory="Roster"
          onUploadComplete={handleRosterUploadComplete}
          onUploadsChange={setUploads}
          uploads={uploads}
        />
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

      {programProfile.roster.sourceFileName ? (
        <RosterUploadSuccessCard
          fileName={programProfile.roster.sourceFileName}
          onViewRoster={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      ) : null}

      <RosterOverviewCard overview={activeRoster.overview} />

      <PositionGroupTable groups={activeRoster.positionGroups} />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <PlayerProgressionSnapshot progression={activeRoster.progression} />
        <RecruitingPrioritiesCard priorities={recruitingPriorities} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <FutureNeedsCard needs={futureNeeds} />
        <RecruitingImpactCard impact={recruitingImpact} />
      </div>

      <RosterRecommendationSummary summary={activeRoster.recommendationSummary} />
    </div>
  );
}
