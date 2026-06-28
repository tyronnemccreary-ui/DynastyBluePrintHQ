import { StatusBadge } from "@/components/ui/status-badge";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  status?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  status
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-turf-400">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-normal text-white sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-blueprint-200">
            {description}
          </p>
        ) : null}
      </div>
      {status ? <StatusBadge tone="ready">{status}</StatusBadge> : null}
    </div>
  );
}
