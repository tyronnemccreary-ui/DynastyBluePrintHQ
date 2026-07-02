import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  coachRoleLabels,
  dynastyTypeLabels,
  type ProgramProfile
} from "@/types/program";
import { formatConference, formatText } from "@/utils/display-formatters";

type ProgramHeaderProps = {
  profile: ProgramProfile;
};

export function ProgramHeader({ profile }: ProgramHeaderProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge>{formatConference(profile.school.conference)}</StatusBadge>
            <StatusBadge tone="ready">{dynastyTypeLabels[profile.dynastyType]}</StatusBadge>
            <StatusBadge>{profile.currentPhase}</StatusBadge>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
            {profile.school.name} {formatText(profile.school.mascot)}
          </h1>
          <p className="mt-3 text-sm leading-6 text-blueprint-200">
            Season {profile.season} •{" "}
            {profile.week === 0 ? "Football Operations setup" : `Week ${profile.week}`} •{" "}
            {profile.school.location ?? "Location Not Available"}
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{profile.coachName}</p>
            <p className="mt-1 text-sm text-blueprint-300">
              {coachRoleLabels[profile.coachRole]}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
