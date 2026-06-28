import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  coachRoleLabels,
  dynastyTypeLabels,
  type ProgramProfile
} from "@/types/program";

type ProgramStatusCardProps = {
  profile: ProgramProfile;
};

export function ProgramStatusCard({ profile }: ProgramStatusCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <StatusBadge>Program Status</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">
            {profile.school.name} {profile.school.mascot}
          </h2>
          <p className="mt-2 text-sm text-blueprint-200">{profile.school.conference}</p>
        </div>
        <StatusBadge tone="ready">{dynastyTypeLabels[profile.dynastyType]}</StatusBadge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Coach" value={profile.coachName} />
        <MetricCard label="Role" value={coachRoleLabels[profile.coachRole]} />
        <MetricCard
          label="Dynasty Points"
          value={`${profile.school.blueprintSnapshot.availableDynastyPoints}`}
        />
        <MetricCard label="Team Prestige" value={`${profile.school.prestige} Star`} />
        <MetricCard label="Conference" value={profile.school.conference} />
        <MetricCard label="School" value={profile.school.abbreviation} />
      </div>
    </Card>
  );
}
