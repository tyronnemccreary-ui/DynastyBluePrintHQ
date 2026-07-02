import type { DynastyPoints, NumericValue } from "@/types/team";

export const notAvailable = "Not Available";
export const conferenceNotAvailable = "Conference Not Available";

export function formatText(value?: string | null, fallback = notAvailable) {
  if (!value || value.trim().length === 0 || value === notAvailable) {
    return fallback;
  }

  return value;
}

export function formatConference(value?: string | null) {
  return formatText(value, conferenceNotAvailable);
}

export function formatNumericValue(value?: NumericValue) {
  return typeof value === "number" ? `${value}` : notAvailable;
}

export function formatDynastyPointValue(value?: NumericValue) {
  return typeof value === "number" ? `${value}` : notAvailable;
}

export function getAvailableDynastyPoints(points?: DynastyPoints) {
  if (!points) {
    return undefined;
  }

  if (typeof points.available === "number") {
    return points.available;
  }

  if (
    typeof points.total === "number" &&
    typeof points.allocated === "number" &&
    typeof points.used === "number"
  ) {
    return Math.max(0, points.total - points.allocated - points.used);
  }

  return undefined;
}
