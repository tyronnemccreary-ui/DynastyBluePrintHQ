import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

type RosterUploadSuccessCardProps = {
  fileName: string;
  onViewRoster: () => void;
};

export function RosterUploadSuccessCard({
  fileName,
  onViewRoster
}: RosterUploadSuccessCardProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-turf-400/10 text-turf-400">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <StatusBadge tone="ready">Roster Uploaded</StatusBadge>
            <h2 className="mt-4 text-xl font-semibold text-white">
              Roster uploaded successfully
            </h2>
            <p className="mt-2 text-sm leading-6 text-blueprint-200">
              {fileName} has been saved locally. Placeholder roster intelligence is ready until
              full parsing is added.
            </p>
          </div>
        </div>

        <Button className="gap-2" onClick={onViewRoster} type="button">
          View Roster Intelligence
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </Card>
  );
}
