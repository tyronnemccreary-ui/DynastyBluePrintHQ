"use client";

import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  DragEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState
} from "react";
import { FileSpreadsheet, ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { screenshotCategories } from "@/data/import-mapping";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  ImportMethod,
  ScreenshotCategory,
  ScreenshotUpload
} from "@/types/import";
import { cn } from "@/utils/cn";

type ScreenshotUploaderProps = {
  uploads: ScreenshotUpload[];
  onUploadsChange: Dispatch<SetStateAction<ScreenshotUpload[]>>;
  initialCategory?: ScreenshotCategory;
  onUploadComplete?: (upload: ScreenshotUpload) => void;
};

const uploadMessages: Record<ScreenshotCategory, string> = {
  "Team Overview":
    "Team overview uploaded successfully. Data extraction will be available in a future update.",
  "AD Expectations":
    "AD expectations uploaded successfully. Goal analysis will be available in a future update.",
  "Dynasty Blueprint":
    "Dynasty Blueprint uploaded successfully. Blueprint analysis will be available in a future update.",
  Roster:
    "Roster uploaded successfully. Player analysis will be available in a future update.",
  "Recruiting Board":
    "Recruiting board uploaded successfully. Recruit analysis will be available in a future update.",
  "Transfer Portal":
    "Transfer portal file uploaded successfully. Portal analysis will be available in a future update.",
  "Staff Management":
    "Staff file uploaded successfully. Staff analysis will be available in a future update.",
  "My School Grades":
    "My School Grades uploaded successfully. Grade extraction will be available in a future update."
};

export function ScreenshotUploader({
  uploads,
  onUploadsChange,
  initialCategory = "Team Overview",
  onUploadComplete
}: ScreenshotUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<number[]>([]);
  const [category, setCategory] = useState<ScreenshotCategory>(initialCategory);
  const [method, setMethod] = useState<ImportMethod>("Screenshot Upload");
  const [isDragging, setIsDragging] = useState(false);
  const [lastUploadCount, setLastUploadCount] = useState(0);

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function addFiles(files: FileList | File[]) {
    const fileList = Array.from(files);
    const acceptedFiles = fileList.filter((file) =>
      method === "Screenshot Upload" ? file.type.startsWith("image/") : isCsvFile(file)
    );
    const rejectedFiles = fileList.filter((file) => !acceptedFiles.includes(file));

    const nextUploads = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      fileName: file.name,
      category,
      method,
      status: "Uploading" as const,
      progress: 35,
      message: "Uploading file locally...",
      previewUrl: method === "Screenshot Upload" ? URL.createObjectURL(file) : undefined
    }));
    const failedUploads = rejectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      fileName: file.name,
      category,
      method,
      status: "Failed" as const,
      progress: 100,
      message:
        method === "Screenshot Upload"
          ? "This file was not uploaded because it is not an image."
          : "This file was not uploaded because it is not a CSV file."
    }));

    if (nextUploads.length === 0 && failedUploads.length === 0) {
      setLastUploadCount(0);
      return;
    }

    setLastUploadCount(nextUploads.length + failedUploads.length);
    onUploadsChange((currentUploads) => [...currentUploads, ...nextUploads, ...failedUploads]);
    nextUploads.forEach((upload) => completeLocalUpload(upload.id, upload.category, upload.method));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      addFiles(event.target.files);
      event.target.value = "";
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  function removeUpload(id: string) {
    const target = uploads.find((upload) => upload.id === id);

    if (target?.previewUrl) {
      URL.revokeObjectURL(target.previewUrl);
    }

    onUploadsChange((currentUploads) =>
      currentUploads.filter((upload) => upload.id !== id)
    );
  }

  function completeLocalUpload(
    id: string,
    uploadCategory: ScreenshotCategory,
    uploadMethod: ImportMethod
  ) {
    const processingTimer = window.setTimeout(() => {
      onUploadsChange((currentUploads) =>
        currentUploads.map((upload) =>
          upload.id === id
            ? {
                ...upload,
                status: "Processing",
                progress: 72,
                message:
                  uploadMethod === "CSV Upload"
                    ? "Preparing CSV for future field mapping..."
                    : "Preparing upload for future analysis..."
              }
            : upload
        )
      );
    }, 350);

    const completionTimer = window.setTimeout(() => {
      let completedUpload: ScreenshotUpload | null = null;

      onUploadsChange((currentUploads) =>
        currentUploads.map((upload) =>
          upload.id === id
            ? ((completedUpload = {
                ...upload,
                status: "Complete",
                progress: 100,
                message:
                  uploadMethod === "CSV Upload"
                    ? `${uploadCategory} CSV uploaded successfully. CSV mapping will be available in a future update.`
                    : uploadMessages[uploadCategory]
              }),
              completedUpload)
            : upload
        )
      );

      if (completedUpload) {
        onUploadComplete?.(completedUpload);
      }
    }, 900);

    timersRef.current.push(processingTimer, completionTimer);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card className="p-6">
        <div>
          <StatusBadge>Upload</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">File Intake</h2>
          <p className="mt-2 text-sm leading-6 text-blueprint-200">
            Select screenshot images or CSV files. The selected category applies to every file in
            that upload.
          </p>
          <div className="mt-4 rounded-md border border-gold-400/25 bg-gold-400/10 p-4">
            <StatusBadge tone="attention">Local Only</StatusBadge>
            <p className="mt-3 text-sm leading-6 text-blueprint-100">
              Uploaded files are stored only in this browser session for now. Refreshing or
              closing the page may clear the import queue until upload persistence is added.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(["Screenshot Upload", "CSV Upload"] as ImportMethod[]).map((item) => (
            <button
              className={cn(
                "rounded-lg border p-4 text-left transition-colors",
                method === item
                  ? "border-turf-400/60 bg-turf-400/10"
                  : "border-white/10 bg-white/[0.035] hover:bg-white/[0.06]"
              )}
              key={item}
              onClick={() => setMethod(item)}
              type="button"
            >
              <p className="text-sm font-semibold text-white">{item}</p>
              <p className="mt-2 text-xs leading-5 text-blueprint-300">
                {item === "Screenshot Upload"
                  ? "Images for future OCR/Vision review."
                  : "CSV files for future structured imports."}
              </p>
            </button>
          ))}
        </div>

        <label className="mt-6 block">
          <span className="text-sm font-medium text-blueprint-100">Import Category</span>
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

        <div
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
          onClick={openFilePicker}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openFilePicker();
            }
          }}
        >
          <input
            accept={method === "Screenshot Upload" ? "image/*" : ".csv,text/csv"}
            className="sr-only"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />
          {method === "Screenshot Upload" ? (
            <UploadCloud className="h-10 w-10 text-turf-400" aria-hidden="true" />
          ) : (
            <FileSpreadsheet className="h-10 w-10 text-turf-400" aria-hidden="true" />
          )}
          <p className="mt-4 text-base font-semibold text-white">
            Drop {method === "Screenshot Upload" ? "screenshots" : "CSV files"} here
          </p>
          <p className="mt-2 text-sm text-blueprint-200">
            {method === "Screenshot Upload"
              ? "Upload multiple roster screenshots at once."
              : "CSV upload is queued for future mapping. Parsing is not active yet."}
          </p>
          <Button
            className="mt-5 gap-2"
            onClick={(event) => {
              event.stopPropagation();
              openFilePicker();
            }}
            type="button"
          >
            {method === "Screenshot Upload" ? (
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
            )}
            {method === "Screenshot Upload" ? "Select Images" : "Select CSV Files"}
          </Button>
          {lastUploadCount > 0 ? (
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-turf-400">
              Added {lastUploadCount} file{lastUploadCount === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-5">
          <StatusBadge>Import Queue</StatusBadge>
          <h2 className="mt-4 text-xl font-semibold text-white">
            Import Queue
            {uploads.length > 0 ? (
              <span className="text-blueprint-300"> ({uploads.length})</span>
            ) : null}
          </h2>
        </div>

        {uploads.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-6 text-sm leading-6 text-blueprint-200">
            <StatusBadge>Idle</StatusBadge>
            <p className="mt-3">No files uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {uploads.map((upload) => (
              <div
                className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[96px_1fr_auto]"
                key={upload.id}
              >
                <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-md border border-white/10 bg-blueprint-950">
                  {upload.previewUrl ? (
                    <Image
                      alt={`${upload.category} preview`}
                      className="object-cover"
                      fill
                      src={upload.previewUrl}
                      unoptimized
                    />
                  ) : (
                    <FileSpreadsheet className="h-8 w-8 text-turf-400" aria-hidden="true" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{upload.fileName}</p>
                  <p className="mt-2 text-sm text-blueprint-200">
                    {upload.category} • {upload.method}
                  </p>
                  <div className="mt-3">
                    <StatusBadge tone={getStatusTone(upload.status)}>
                      {upload.status}
                    </StatusBadge>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-turf-400 transition-all"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-blueprint-200">{upload.message}</p>
                </div>
                <div className="flex items-start gap-2 sm:flex-col">
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

function isCsvFile(file: File) {
  return file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");
}

function getStatusTone(status: ScreenshotUpload["status"]) {
  if (status === "Complete") {
    return "ready";
  }

  if (status === "Failed") {
    return "attention";
  }

  return "neutral";
}
