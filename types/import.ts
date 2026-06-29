export type ScreenshotCategory =
  | "Team Overview"
  | "AD Expectations"
  | "Dynasty Blueprint"
  | "Roster"
  | "Recruiting Board"
  | "Transfer Portal"
  | "Staff Management"
  | "My School Grades";

export type ImportStatus = "Uploaded" | "Pending Analysis" | "Ready for Future OCR";

export type ScreenshotUpload = {
  id: string;
  fileName: string;
  category: ScreenshotCategory;
  status: ImportStatus;
  previewUrl: string;
};

export type ImportMapping = {
  category: ScreenshotCategory;
  description: string;
  futureFields: string[];
};
