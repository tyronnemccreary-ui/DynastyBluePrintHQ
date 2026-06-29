"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useState } from "react";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { screenshotCategories } from "@/data/import-mapping";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  ImportStatus,
  ScreenshotCategory,
  ScreenshotUpload
} from "@/types/import";
import { cn } from "@/utils/cn";

type ScreenshotUploaderProps = {
  uploads: ScreenshotUpload[];
  onUploadsChange: (uploads: ScreenshotUpload[]) => void;
};

export function ScreenshotUploader({
  uploads,
  onUploadsChange
}: ScreenshotUploaderProps) {
  const [category, setCategory] = useState<ScreenshotCategory>("Team Overview");
  const [isDragging, setIsDragging] = useState(false);

  function addFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    const nextUploads = imageFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      fileName: file.name,
      category,
      status: "Uploaded" as ImportStatus,
      previewUrl: URL.createObjectURL(file)
    }));

    onUploadsChange([...uploads, ...nextUploads]);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      addFiles(event.target.files);
      event.target.value = "";
    }
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function removeUpload(id: string) {
    const target = uploads.find((upload) => upload.id === id);

    if (target) {
      URL.revokeObjectURL(target.previewUrl);
    }

    onUploadsChange(uploads.filter((upload) => upload.id !== id));
  }

  function advanceStatus(id: string) {
    onUploadsChange(
      uploads.map((upload) =>
        upload.id === id
          ? {
              ...upload,
              status: nextStatus(upload.status)
            }
          : upload
      )
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card className="p-6">
        <div>
          <StatusBadge>Upload</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Screenshot Intake</h2>
          <p className="mt-2 text-sm leading-6 text-blueprint-200">
            Store screenshots in local UI state for now. OCR and data extraction will be added in a
            future sprint.
          </p>
        </div>

        <label className="mt-6 block">
          <span className="text-sm font-medium text-blueprint-100">Screenshot Category</span>
          <select
            className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/[0.045] px-4 text-sm text-white outline-none transition-colors focus:border-turf-400/60 focus:ring-2 focus:ring-turf-400/20"
            onChange={(event) => setCategory(event.target.value as ScreenshotCategory)}
            value={category}
          >
            {screenshotCategories.map((item) => (
              <option className="bg-blueprint-950 text-white" key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label
          className={cn(
            "mt-5 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors",
            isDragging
              ? "border-turf-400 bg-turf-400/10"
              : "border-white/15 bg-white/[0.03] hover:bg-white/[0.055]"
          )}
          onDragLeave={() => setIsDragging(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDrop={handleDrop}
        >
          <input
            accept="image/*"
            className="sr-only"
            multiple
            onChange={handleFileChange}
            type="file"
          />
          <UploadCloud className="h-10 w-10 text-turf-400" aria-hidden="true" />
          <p className="mt-4 text-base font-semibold text-white">Drop screenshots here</p>
          <p className="mt-2 text-sm text-blueprint-200">or select files from your computer</p>
          <Button className="mt-5 gap-2">
            <ImagePlus className="h-4 w-4" aria-hidden="true" />
            Select Images
          </Button>
        </label>
      </Card>

      <Card className="p-6">
        <div className="mb-5">
          <StatusBadge>Import Queue</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">Uploaded Screenshots</h2>
        </div>

        {uploads.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6 text-sm leading-6 text-blueprint-200">
            No screenshots uploaded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {uploads.map((upload) => (
              <div
                className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[96px_1fr_auto]"
                key={upload.id}
              >
                <div className="relative h-24 overflow-hidden rounded-md border border-white/10 bg-blueprint-950">
                  <Image
                    alt={`${upload.category} preview`}
                    className="object-cover"
                    fill
                    src={upload.previewUrl}
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{upload.fileName}</p>
                  <p className="mt-2 text-sm text-blueprint-200">{upload.category}</p>
                  <div className="mt-3">
                    <StatusBadge>{upload.status}</StatusBadge>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:flex-col">
                  <Button
                    className="h-9"
                    onClick={() => advanceStatus(upload.id)}
                    type="button"
                    variant="secondary"
                  >
                    Update
                  </Button>
                  <Button
                    aria-label={`Remove ${upload.fileName}`}
                    className="h-9 px-3"
                    onClick={() => removeUpload(upload.id)}
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function nextStatus(status: ImportStatus): ImportStatus {
  if (status === "Uploaded") {
    return "Pending Analysis";
  }

  if (status === "Pending Analysis") {
    return "Ready for Future OCR";
  }

  return "Ready for Future OCR";
}
