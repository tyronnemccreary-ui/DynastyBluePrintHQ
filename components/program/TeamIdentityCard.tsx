import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { School } from "@/types/school";

type TeamIdentityCardProps = {
  school: School;
};

export function TeamIdentityCard({ school }: TeamIdentityCardProps) {
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
        <MetricCard label="Team Prestige" value={`${school.prestige} Star`} />
        <MetricCard label="Overall Rating" value={`${school.identity.overallRating}`} />
        <MetricCard label="Offensive Rating" value={`${school.identity.offensiveRating}`} />
        <MetricCard label="Defensive Rating" value={`${school.identity.defensiveRating}`} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <IdentityRow label="Program Tradition" value={school.identity.tradition} />
        <IdentityRow label="Brand Exposure" value={school.identity.brandExposure} />
        <IdentityRow label="Stadium Atmosphere" value={school.identity.stadiumAtmosphere} />
      </div>
    </Card>
  );
}

function IdentityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-blueprint-300">
        {label}
      </p>
      <p className="mt-3 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
