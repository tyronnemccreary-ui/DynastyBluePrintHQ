import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { School } from "@/types/school";
import type { NumericValue } from "@/types/team";
import { formatConference } from "@/utils/display-formatters";

type TeamIdentityCardProps = {
  school: School;
};

export function TeamIdentityCard({ school }: TeamIdentityCardProps) {
  const grades = school.mySchoolGrades;

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Team Identity</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Program Profile</h2>
        </div>
        <p className="text-3xl font-semibold text-white">{school.abbreviation}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Team Prestige" value={formatPrestige(school.teamPrestige)} />
        <MetricCard label="Conference" value={formatConference(school.conference)} />
        <MetricCard label="Overall Rating" value={formatValue(school.overallRating)} />
        <MetricCard label="Offensive Rating" value={formatValue(school.offenseRating)} />
        <MetricCard label="Defensive Rating" value={formatValue(school.defenseRating)} />
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-blueprint-100">My School Grades</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <IdentityRow label="Championship Contender" value={grades.championshipContender} />
          <IdentityRow label="Program Tradition" value={grades.programTradition} />
          <IdentityRow label="Campus Lifestyle" value={grades.campusLifestyle} />
          <IdentityRow label="Stadium Atmosphere" value={grades.stadiumAtmosphere} />
          <IdentityRow label="Pro Potential" value={grades.proPotential} />
          <IdentityRow label="Brand Exposure" value={grades.brandExposure} />
          <IdentityRow label="Academic Prestige" value={grades.academicPrestige} />
          <IdentityRow label="Conference Prestige" value={grades.conferencePrestige} />
          <IdentityRow label="Coach Prestige" value={grades.coachPrestige} />
          <IdentityRow label="Coach Stability" value={grades.coachStability} />
          <IdentityRow label="Athletic Facilities" value={grades.athleticFacilities} />
          <IdentityRow label="Playing Style" value={grades.playingStyle} />
          <IdentityRow label="Playing Time" value={grades.playingTime} />
          <IdentityRow label="Proximity to Home" value={grades.proximityToHome} />
        </div>
      </div>
    </Card>
  );
}

function IdentityRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-blueprint-300">
        {label}
      </p>
      <p className="mt-3 text-sm font-semibold text-white">
        {value ?? "Not Available"}
      </p>
    </div>
  );
}

function formatValue(value?: NumericValue) {
  return typeof value === "number" ? `${value}` : "Not Available";
}

function formatPrestige(value?: number) {
  return typeof value === "number" ? `${value} Star` : "Not Available";
}
