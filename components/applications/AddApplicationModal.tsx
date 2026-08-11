"use client";

import { FormEvent, useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import {
  Application,
  ApplicationStatus,
  INDUSTRIES,
} from "@/lib/applications";

type AddApplicationModalProps = {
  open: boolean;
  onClose: () => void;
  onAdded: (application: Application) => void;
};

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Applied",
  "Interviewing",
  "Offer",
];

export function AddApplicationModal({
  open,
  onClose,
  onAdded,
}: AddApplicationModalProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("Applied");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  function resetForm() {
    setJobTitle("");
    setCompanyName("");
    setIndustry("");
    setJobUrl("");
    setStatus("Applied");
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!jobTitle.trim() || !companyName.trim() || !industry) return;

    setIsSubmitting(true);
    setError(null);

    const payload = {
      job_title: jobTitle.trim(),
      company_name: companyName.trim(),
      industry,
      status,
      date_applied: new Date().toISOString().slice(0, 10),
      job_url: jobUrl.trim() || null,
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | (Application & { message?: string })
        | { message?: string }
        | null;

      if (!response.ok) {
        setError(
          (result && "message" in result && result.message) ||
            "Failed to save application.",
        );
        return;
      }

      if (!result || typeof result !== "object" || !("id" in result)) {
        setError("Invalid response from server.");
        return;
      }

      onAdded(result as Application);

      resetForm();
      onClose();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 cursor-pointer bg-primary/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl dark:bg-surface-container-low sm:gap-5 sm:p-8">
        <div className="flex items-center justify-between">
          <h3 className="text-headline-md font-semibold text-on-surface">
            New Application
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            aria-label="Close modal"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="job-title"
              className="text-body-sm font-semibold text-on-surface"
            >
              Job Title
            </label>
            <input
              id="job-title"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              placeholder="e.g. Senior Product Manager"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="company-name"
              className="text-body-sm font-semibold text-on-surface"
            >
              Company Name
            </label>
            <input
              id="company-name"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="industry"
              className="text-body-sm font-semibold text-on-surface"
            >
              Industry
            </label>
            <div className="relative">
              <select
                id="industry"
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                required
              >
                <option value="" disabled>
                  Select an industry...
                </option>
                {INDUSTRIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <MaterialIcon
                name="expand_more"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="job-url"
              className="text-body-sm font-semibold text-on-surface"
            >
              Job Post Link (Optional)
            </label>
            <input
              id="job-url"
              type="url"
              value={jobUrl}
              onChange={(event) => setJobUrl(event.target.value)}
              placeholder="https://company.com/jobs/..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="status"
              className="text-body-sm font-semibold text-on-surface"
            >
              Initial Status
            </label>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ApplicationStatus)
                }
                className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option === "Offer" ? "Offered" : option}
                  </option>
                ))}
              </select>
              <MaterialIcon
                name="expand_more"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant"
              />
            </div>
          </div>

          {error ? (
            <div
              className="rounded-lg border border-error/20 bg-error-container px-3 py-2 text-body-sm text-error"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-4 py-2.5 text-body-sm text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-70"
            >
              {isSubmitting ? "Saving Application..." : "Save Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
