import type { ApplicationStatus } from "@/lib/applications";

type StatusStyle = {
  badge: string;
  border: string;
};

export function getStatusStyle(status: ApplicationStatus): StatusStyle {
  switch (status) {
    case "Interviewing":
      return {
        badge: "bg-[#f59e0b]/10 text-[#d97706]",
        border: "border-secondary-container",
      };
    case "Applied":
      return {
        badge: "bg-secondary/10 text-secondary",
        border: "border-outline-variant",
      };
    case "Offer":
      return {
        badge: "bg-[#10b981]/10 text-[#047857]",
        border: "border-[#10b981]",
      };
    case "Rejected":
      return {
        badge: "bg-error/10 text-error",
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
