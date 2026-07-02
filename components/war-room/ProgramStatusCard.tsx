import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  coachRoleLabels,
  dynastyTypeLabels,
  type ProgramProfile
} from "@/types/program";
import {
  formatConference,
  formatDynastyPointValue,
  formatText,
  getAvailableDynastyPoints
} from "@/utils/display-formatters";

type ProgramStatusCardProps = {
  profile: ProgramProfile;
};

export function ProgramStatusCard({ profile }: ProgramStatusCardProps) {
  const dynastyPoints = profile.dynastyPoints ?? profile.school.dynastyPoints;
  const availableDynastyPoints =
    getAvailableDynastyPoints(dynastyPoints) ??
    profile.school.blueprintSnapshot?.availableDynastyPoints;
  const teamPrestige = profile.teamPrestige ?? profile.school.teamPrestige ?? profile.school.prestige;

  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <StatusBadge>Program Status</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">
            {profile.school.name} {formatText(profile.school.mascot)}
          </h2>
          <p className="mt-2 text-sm text-blueprint-200">
            {formatConference(profile.school.conference)}
          </p>
        </div>
        <StatusBadge tone="ready">{dynastyTypeLabels[profile.dynastyType]}</StatusBadge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Coach" value={profile.coachName} />
        <MetricCard label="Role" value={coachRoleLabels[profile.coachRole]} />
        <MetricCard label="Season" value={`Season ${profile.season}`} />
        <MetricCard label="Week" value={profile.week === 0 ? "Setup" : `Week ${profile.week}`} />
        <MetricCard label="Phase" value={profile.currentPhase} />
        <MetricCard
          label="Available Points"
          value={formatDynastyPointValue(availableDynastyPoints)}
        />
        <MetricCard
          label="Total Points"
          value={formatDynastyPointValue(dynastyPoints?.total)}
        />
        <MetricCard
          label="Allocated Points"
          value={formatDynastyPointValue(dynastyPoints?.allocated)}
        />
        <MetricCard
          label="Used Points"
          value={formatDynastyPointValue(dynastyPoints?.used)}
        />
        <MetricCard
          label="Team Prestige"
          value={typeof teamPrestige === "number" ? `${teamPrestige} Star` : "Not Available"}
        />
        <MetricCard label="Conference" value={formatConference(profile.school.conference)} />
        <MetricCard label="School" value={formatText(profile.school.abbreviation)} />
      </div>
    </Card>
  );
}
