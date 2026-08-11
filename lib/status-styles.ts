import type { ApplicationStatus } from "@/lib/applications";

type StatusStyle = {
  badge: string;
  border: string;
};

export function getStatusStyle(status: ApplicationStatus): StatusStyle {
  switch (status) {
    case "Interviewing":
      return {
        badge: "bg-secondary/15 text-secondary",
        border: "border-secondary",
      };
    case "Applied":
      return {
        badge: "bg-primary/15 text-primary",
        border: "border-primary",
      };
    case "Offer":
      return {
        badge: "bg-primary/20 text-primary",
        border: "border-primary",
      };
    case "Rejected":
      return {
        badge: "bg-error/15 text-error",
        border: "border-error",
      };
    case "Ghosted":
      return {
        badge: "bg-surface-container-high text-on-surface-variant",
        border: "border-outline-variant",
      };
    default:
      return {
        badge: "bg-surface-container-high text-on-surface-variant",
        border: "border-outline-variant",
      };
  }
}

export function getFilterLabel(status: ApplicationStatus | "All"): string {
  if (status === "Offer") return "Offered";
  return status;
}
