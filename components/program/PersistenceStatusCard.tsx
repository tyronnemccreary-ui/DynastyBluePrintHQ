"use client";

import { useEffect, useState } from "react";
import { Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getPersistenceMode,
  loadMostRecentProgramProfile,
  saveProgramProfile
} from "@/services/program-service";
import { useProgramStore } from "@/store/program-store";
import type { PersistenceMode } from "@/types/database";
import type { ProgramProfile } from "@/types/program";

type PersistenceStatusCardProps = {
  profile: ProgramProfile | null;
};

type SaveStatus = "Ready" | "Saved" | "Local fallback" | "Load error" | "Save error";

export function PersistenceStatusCard({ profile }: PersistenceStatusCardProps) {
  const setProgramProfile = useProgramStore((state) => state.setProgramProfile);
  const [mode] = useState<PersistenceMode>(getPersistenceMode());
  const [lastSaved, setLastSaved] = useState<string | null>(profile?.updatedAt ?? null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(
    mode === "Supabase" ? "Ready" : "Local fallback"
  );

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      if (profile || mode !== "Supabase") {
        return;
      }

      const result = await loadMostRecentProgramProfile();

      if (!isMounted) {
        return;
      }

      if (result.error) {
        setSaveStatus("Load error");
        return;
      }

      if (result.profile) {
        setProgramProfile(result.profile);
        setLastSaved(result.profile.updatedAt ?? null);
        setSaveStatus("Saved");
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [mode, profile, setProgramProfile]);

  useEffect(() => {
    let isMounted = true;

    async function persistProfile() {
      if (!profile) {
        return;
      }

      const result = await saveProgramProfile(profile);

      if (!isMounted) {
        return;
      }

      if (result.status === "saved") {
        setLastSaved(result.lastSaved);
        setSaveStatus("Saved");
        return;
      }

      if (result.status === "local-only") {
        setSaveStatus("Local fallback");
        return;
      }

      setSaveStatus("Save error");
    }

    persistProfile();

    return () => {
      isMounted = false;
    };
  }, [profile]);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <StatusBadge>Persistence</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Developer Status</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
          <Database className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <StatusRow label="Persistence Mode" value={mode} />
        <StatusRow label="Last Saved" value={formatLastSaved(lastSaved)} />
        <StatusRow label="Save Status" value={saveStatus} />
      </dl>
    </Card>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-blueprint-300">{label}</dt>
      <dd className="text-right font-medium text-white">{value}</dd>
    </div>
  );
}

function formatLastSaved(value: string | null) {
  if (!value) {
    return "Not saved";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
