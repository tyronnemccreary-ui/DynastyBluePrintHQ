export type ScreenshotCategory =
  | "Team Overview"
  | "AD Expectations"
  | "Dynasty Blueprint"
  | "Roster"
  | "Recruiting Board"
  | "Transfer Portal"
  | "Staff Management"
  | "My School Grades";

export type UploadLifecycleStatus = "Idle" | "Uploading" | "Processing" | "Complete" | "Failed";

export type ImportMethod = "Screenshot Upload" | "CSV Upload";

export type ScreenshotUpload = {
  id: string;
  file?: File;
  fileName: string;
  category: ScreenshotCategory;
  method: ImportMethod;
  status: UploadLifecycleStatus;
  progress: number;
  message: string;
  previewUrl?: string;
};

export type ImportMapping = {
  category: ScreenshotCategory;
  description: string;
  futureFields: string[];
};
