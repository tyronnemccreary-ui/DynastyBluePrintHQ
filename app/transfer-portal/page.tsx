"use client";

import Link from "next/link";
import { ArrowRight, Handshake } from "lucide-react";
import {
  oklahomaTransferOverview,
  oklahomaTransferSummary,
  oklahomaTransferTargets
} from "@/data/mock-transfers";
import { DepartmentActivationCard } from "@/components/departments/DepartmentActivationCard";
import { TransferFitCard } from "@/components/transfer/TransferFitCard";
import { TransferOverviewCard } from "@/components/transfer/TransferOverviewCard";
import { TransferSummaryCard } from "@/components/transfer/TransferSummaryCard";
import { TransferTargetTable } from "@/components/transfer/TransferTargetTable";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useProgramStore } from "@/store/program-store";
import { getDepartmentActivation } from "@/utils/department-activation";
import { evaluateTransfers } from "@/utils/transfer-analysis";

export default function TransferPortalPage() {
  const programProfile = useProgramStore((state) => state.programProfile);
  const evaluatedTransfers = evaluateTransfers(oklahomaTransferTargets);

  if (!programProfile) {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Portal Evaluation"
          title="Transfer Portal"
          description="Create a Program Profile before evaluating transfer opportunities and roster fit."
          status="Setup Needed"
        />

        <Card className="p-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-turf-400/10 text-turf-400">
              <Handshake className="h-6 w-6" aria-hidden="true" />
            </div>
            <StatusBadge className="mt-6">No Program Profile</StatusBadge>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              Start with Welcome to the Program
            </h2>
            <p className="mt-3 text-sm leading-6 text-blueprint-200">
              Transfer Portal needs the selected school and coach profile before evaluating portal
              targets against roster needs.
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

  const activation = getDepartmentActivation("transfer-portal", programProfile);

  if (activation?.status !== "Ready") {
    return (
      <div className="space-y-6">
        <SectionHeader
          eyebrow="Portal Evaluation"
          title="Transfer Portal"
          description={
            activation?.status === "Season Locked"
              ? `The Transfer Portal is prepared for ${programProfile.school.name}, but it opens when the dynasty reaches offseason.`
              : `The Transfer Portal is open for ${programProfile.school.name}, but it needs portal data before live target evaluation begins.`
          }
          status={activation?.status ?? "Needs Activation"}
        />

        {activation ? <DepartmentActivationCard department={activation} /> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Portal Evaluation"
        title="Transfer Portal"
        description={`A targeted view of portal opportunities for ${programProfile.school.name}'s roster needs and scholarship strategy.`}
        status="Portal Active"
      />

      <TransferOverviewCard overview={oklahomaTransferOverview} />

      <TransferTargetTable transfers={evaluatedTransfers} />

      <section className="space-y-4">
        <div>
          <StatusBadge>Program Fit Analysis</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Transfer Fit Board</h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {evaluatedTransfers.map((transfer) => (
            <TransferFitCard key={transfer.id} transfer={transfer} />
          ))}
        </div>
      </section>

      <TransferSummaryCard summary={oklahomaTransferSummary} />
    </div>
  );
}
