"use client";

import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { DepartmentActivationGrid } from "@/components/departments/DepartmentActivationGrid";
import { WeeklyOperationsBriefing } from "@/components/operations/WeeklyOperationsBriefing";
import { BudgetSummaryCard } from "@/components/war-room/BudgetSummaryCard";
import { ProgramIntelligenceCard } from "@/components/war-room/ProgramIntelligenceCard";
import { ProgramHealthCard } from "@/components/war-room/ProgramHealthCard";
import { ProgramStatusCard } from "@/components/war-room/ProgramStatusCard";
import { QuickActions } from "@/components/war-room/QuickActions";
import { RosterAlertCard } from "@/components/war-room/RosterAlertCard";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { getWeeklyOperationsBriefing } from "@/services/weekly-briefing";
import { getFootballOperationsIntelligence } from "@/intelligence/services/department-intelligence-service";
import { useProgramStore } from "@/store/program-store";
import { getDepartmentActivations } from "@/utils/department-activation";
import { summarizeBudgetForecast } from "@/utils/blueprint-recommendations";
import { generateRosterAlert } from "@/utils/roster-recommendations";

export default function WarRoomPage() {
  const programProfile = useProgramStore((state) => state.programProfile);

  if (!programProfile) {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Home Screen"
          title="War Room"
          description="Create a Program Profile before opening the executive dashboard."
          status="Setup Needed"
        />

        <Card className="p-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-turf-400/10 text-turf-400">
              <LayoutDashboard className="h-6 w-6" aria-hidden="true" />
            </div>
            <StatusBadge className="mt-6">No Program Profile</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Start with Welcome to the Program
            </h2>
            <p className="mt-3 text-sm leading-6 text-blueprint-200">
              The War Room becomes your home screen after the coach, dynasty type, and school are
              set.
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

  const briefing = getWeeklyOperationsBriefing({
    programProfile
  });
  const intelligence = getFootballOperationsIntelligence(programProfile);
  const departments = getDepartmentActivations(programProfile);
  const rosterAlert = programProfile.roster.data
    ? generateRosterAlert(programProfile.roster.data.positionGroups)
    : null;
  const budgetSummary = summarizeBudgetForecast(programProfile.budgetForecast);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Home Screen"
        title="War Room"
        description="A simple executive briefing for the current state of the program."
        status="Active Briefing"
      />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ProgramStatusCard profile={programProfile} />
        <ProgramHealthCard
          health={{
            overall: intelligence.program.overallProgramHealth,
            roster: intelligence.roster.rosterScore,
            recruiting: intelligence.recruiting.recruitingScore,
            blueprint: intelligence.budget.budgetScore,
            staff: intelligence.staff.staffScore
          }}
        />
      </div>

      <WeeklyOperationsBriefing briefing={briefing} />

      <ProgramIntelligenceCard intelligence={intelligence.program} />

      <BudgetSummaryCard summary={budgetSummary} />

      {rosterAlert ? <RosterAlertCard alert={rosterAlert} /> : null}

      <DepartmentActivationGrid departments={departments} />

      <QuickActions />
    </div>
  );
}
