"use client";

import { useEffect, useRef, useState } from "react";
import { importMappings } from "@/data/import-mapping";
import { ScreenshotUploader } from "@/components/import/ScreenshotUploader";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ScreenshotUpload } from "@/types/import";

export default function ScreenshotImportPage() {
  const [uploads, setUploads] = useState<ScreenshotUpload[]>([]);
  const uploadsRef = useRef<ScreenshotUpload[]>(uploads);

  useEffect(() => {
    uploadsRef.current = uploads;
  }, [uploads]);

  useEffect(() => {
    return () => {
      uploadsRef.current.forEach((upload) => URL.revokeObjectURL(upload.previewUrl));
    };
  }, []);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Import Foundation"
        title="Screenshot Import"
        description="Upload Dynasty screenshots so Dynasty Blueprint HQ can prepare your Football Operations data."
        status="Future Ready"
      />

      <ScreenshotUploader uploads={uploads} onUploadsChange={setUploads} />

      <Card className="p-6">
        <div className="mb-5">
          <StatusBadge>Data Mapping Placeholder</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Future Extraction Plan</h2>
          <p className="mt-2 text-sm leading-6 text-blueprint-200">
            These mappings define what each screenshot type will eventually extract when OCR is
            added.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {importMappings.map((mapping) => (
            <div
              className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
              key={mapping.category}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-white">{mapping.category}</p>
                  <p className="mt-2 text-sm leading-6 text-blueprint-200">
                    {mapping.description}
                  </p>
                </div>
                <StatusBadge>Future OCR</StatusBadge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {mapping.futureFields.map((field) => (
                  <StatusBadge key={field}>{field}</StatusBadge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
