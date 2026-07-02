"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, ClipboardList, Search, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cfb27Teams } from "@/database/teams/team-index";
import { createProgramOperationsProfile } from "@/program/services/program-engine";
import { useProgramStore } from "@/store/program-store";
import {
  coachRoleLabels,
  dynastyTypeLabels,
  type CoachRole,
  type DynastyType,
  type ProgramProfile
} from "@/types/program";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/utils/cn";
import { formatConference, formatText } from "@/utils/display-formatters";

const welcomeSchema = z.object({
  dynastyType: z.enum(["new", "existing"]),
  schoolId: z.string().min(1, "Choose a school."),
  coachName: z
    .string()
    .trim()
    .min(2, "Enter the coach name.")
    .max(60, "Keep the coach name under 60 characters."),
  coachRole: z.enum(["head_coach", "offensive_coordinator", "defensive_coordinator"])
});

type WelcomeFormValues = z.infer<typeof welcomeSchema>;

const dynastyOptions: Array<{
  value: DynastyType;
  title: string;
  description: string;
}> = [
  {
    value: "new",
    title: dynastyTypeLabels.new,
    description: "Begin a fresh program profile for a new Dynasty."
  },
  {
    value: "existing",
    title: dynastyTypeLabels.existing,
    description: "Create a profile for a Dynasty already in progress."
  }
];

const coachRoleOptions: CoachRole[] = [
  "head_coach",
  "offensive_coordinator",
  "defensive_coordinator"
];

export default function WelcomePage() {
  const router = useRouter();
  const setProgramProfile = useProgramStore((state) => state.setProgramProfile);
  const [createdProfile, setCreatedProfile] = useState<ProgramProfile | null>(null);
  const [schoolSearch, setSchoolSearch] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<WelcomeFormValues>({
    resolver: zodResolver(welcomeSchema),
    mode: "onChange",
    defaultValues: {
      dynastyType: "new",
      schoolId: "oklahoma",
      coachName: "",
      coachRole: "head_coach"
    }
  });

  const selectedDynastyType = watch("dynastyType");
  const selectedSchoolId = watch("schoolId");
  const selectedCoachRole = watch("coachRole");

  const selectedSchool = useMemo(
    () => cfb27Teams.find((school) => school.id === selectedSchoolId) ?? cfb27Teams[0],
    [selectedSchoolId]
  );
  const filteredSchools = useMemo(() => {
    const query = schoolSearch.trim().toLowerCase();

    if (!query) {
      return cfb27Teams;
    }

    return cfb27Teams.filter((school) => {
      const searchableText = [
        school.name,
        school.shortName,
        school.mascot,
        school.conference
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [schoolSearch]);
  const selectableSchools = useMemo(() => {
    if (filteredSchools.some((school) => school.id === selectedSchoolId)) {
      return filteredSchools;
    }

    return [selectedSchool, ...filteredSchools];
  }, [filteredSchools, selectedSchool, selectedSchoolId]);

  function onSubmit(values: WelcomeFormValues) {
    const school = cfb27Teams.find((item) => item.id === values.schoolId) ?? cfb27Teams[0];
    const profile = createProgramOperationsProfile({
      dynastyType: values.dynastyType,
      selectedTeam: school,
      coachName: values.coachName.trim(),
      coachRole: values.coachRole
    });

    setProgramProfile(profile);
    setCreatedProfile(profile);
  }

  function proceedToWarRoom() {
    router.push("/war-room");
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Onboarding"
        title="Welcome to the Program"
        description="Take over your program and begin building your dynasty."
      />

      <form className="grid gap-6 xl:grid-cols-[1fr_380px]" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <StatusBadge>Step 1</StatusBadge>
                <h2 className="mt-4 text-xl font-semibold text-white">Dynasty Setup</h2>
              </div>
              <ClipboardList className="h-5 w-5 text-turf-400" aria-hidden="true" />
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {dynastyOptions.map((option) => (
                <button
                  className={cn(
                    "rounded-lg border p-5 text-left transition-colors",
                    selectedDynastyType === option.value
                      ? "border-turf-400/60 bg-turf-400/10"
                      : "border-white/10 bg-white/[0.035] hover:bg-white/[0.06]"
                  )}
                  key={option.value}
                  onClick={() =>
                    setValue("dynastyType", option.value, {
                      shouldDirty: true,
                      shouldValidate: true
                    })
                  }
                  type="button"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-white">{option.title}</p>
                      <p className="mt-2 text-sm leading-6 text-blueprint-200">
                        {option.description}
                      </p>
                    </div>
                    {selectedDynastyType === option.value ? (
                      <Check className="h-5 w-5 shrink-0 text-turf-400" aria-hidden="true" />
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <StatusBadge>Step 2</StatusBadge>
              <h2 className="mt-4 text-xl font-semibold text-white">School Selection</h2>
              <p className="mt-2 text-sm text-blueprint-200">
                Team records come from the CFB 27 Team Database and can be expanded from reviewed
                screenshot data later.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="text-sm font-medium text-blueprint-100">Search Schools</span>
                <div className="relative mt-2">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blueprint-400"
                    aria-hidden="true"
                  />
                  <input
                    className="h-11 w-full rounded-md border border-white/10 bg-white/[0.045] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-blueprint-400 focus:border-turf-400/60 focus:ring-2 focus:ring-turf-400/20"
                    onChange={(event) => setSchoolSearch(event.target.value)}
                    placeholder="Search by school, mascot, or conference"
                    type="search"
                    value={schoolSearch}
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-blueprint-100">Select School</span>
                <select
                  className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/[0.045] px-4 text-sm text-white outline-none transition-colors focus:border-turf-400/60 focus:ring-2 focus:ring-turf-400/20"
                  onChange={(event) =>
                    setValue("schoolId", event.target.value, {
                      shouldDirty: true,
                      shouldValidate: true
                    })
                  }
                  value={selectedSchoolId}
                >
                  {selectableSchools.map((school) => (
                    <option
                      className="bg-blueprint-950 text-white"
                      key={school.id}
                      value={school.id}
                    >
                      {school.name} - {formatConference(school.conference)}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{selectedSchool.name}</p>
                    <p className="mt-1 text-sm text-blueprint-200">
                      {formatText(selectedSchool.mascot)} •{" "}
                      {formatConference(selectedSchool.conference)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge>{formatText(selectedSchool.abbreviation)}</StatusBadge>
                    <span className="text-sm text-blueprint-200">
                      Prestige {selectedSchool.teamPrestige ?? "Not Available"}
                    </span>
                  </div>
                </div>
              </div>

              {filteredSchools.length === 0 ? (
                <p className="text-sm text-blueprint-300">
                  No schools match that search. Clear the search to show every team.
                </p>
              ) : null}
            </div>
            {errors.schoolId ? (
              <p className="mt-3 text-sm text-red-300">{errors.schoolId.message}</p>
            ) : null}
          </Card>

          <Card className="p-6">
            <div>
              <StatusBadge>Step 3</StatusBadge>
              <h2 className="mt-4 text-xl font-semibold text-white">Coach Setup</h2>
            </div>

            <div className="mt-6 grid gap-5">
              <label className="block">
                <span className="text-sm font-medium text-blueprint-100">Coach Name</span>
                <input
                  className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/[0.045] px-4 text-sm text-white outline-none transition-colors placeholder:text-blueprint-400 focus:border-turf-400/60 focus:ring-2 focus:ring-turf-400/20"
                  placeholder="Enter coach name"
                  {...register("coachName")}
                />
                {errors.coachName ? (
                  <span className="mt-2 block text-sm text-red-300">
                    {errors.coachName.message}
                  </span>
                ) : null}
              </label>

              <div>
                <p className="text-sm font-medium text-blueprint-100">Role</p>
                <div className="mt-2 grid gap-3 md:grid-cols-3">
                  {coachRoleOptions.map((role) => (
                    <button
                      className={cn(
                        "min-h-11 rounded-md border px-3 text-sm font-medium transition-colors",
                        selectedCoachRole === role
                          ? "border-turf-400/60 bg-turf-400/10 text-white"
                          : "border-white/10 bg-white/[0.035] text-blueprint-200 hover:bg-white/[0.06]"
                      )}
                      key={role}
                      onClick={() =>
                        setValue("coachRole", role, {
                          shouldDirty: true,
                          shouldValidate: true
                        })
                      }
                      type="button"
                    >
                      {coachRoleLabels[role]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="p-6 xl:sticky xl:top-28">
            <div className="flex items-start justify-between gap-4">
              <div>
                <StatusBadge>Program Profile</StatusBadge>
                <h2 className="mt-4 text-xl font-semibold text-white">
                  {selectedSchool.name} {selectedSchool.mascot}
                </h2>
              </div>
              <Shield className="h-5 w-5 text-turf-400" aria-hidden="true" />
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-blueprint-300">Dynasty Type</dt>
                <dd className="text-right font-medium text-white">
                  {dynastyTypeLabels[selectedDynastyType]}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-blueprint-300">School</dt>
                <dd className="text-right font-medium text-white">{selectedSchool.name}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-blueprint-300">Conference</dt>
                <dd className="text-right font-medium text-white">
                  {formatConference(selectedSchool.conference)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-blueprint-300">Coach Role</dt>
                <dd className="text-right font-medium text-white">
                  {coachRoleLabels[selectedCoachRole]}
                </dd>
              </div>
            </dl>

            <Button className="mt-6 w-full gap-2" disabled={!isValid} type="submit">
              Create Program Profile
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>

            {createdProfile ? (
              <div className="mt-5 rounded-lg border border-turf-400/30 bg-turf-400/10 p-4">
                <p className="text-sm font-semibold text-white">Program Profile Created</p>
                <p className="mt-2 text-sm leading-6 text-blueprint-200">
                  {createdProfile.coachName} is set as {coachRoleLabels[createdProfile.coachRole]} at{" "}
                  {createdProfile.school.name}.
                </p>
                <Button className="mt-4 w-full gap-2" onClick={proceedToWarRoom} type="button">
                  Continue to War Room
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ) : null}
          </Card>
        </aside>
      </form>
    </div>
  );
}
