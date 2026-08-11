"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import {
  Application,
  ApplicationStatus,
  INDUSTRIES,
} from "@/lib/applications";

type EditableFields = Omit<Application, "id" | "company_logo">;

type EditApplicationModalProps = {
  open: boolean;
  application: Application | null;
  onClose: () => void;
  onSave: (id: number, updates: EditableFields) => Promise<boolean>;
};

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
  "Ghosted",
];

function normalizeDate(value: string): string {
  return value.slice(0, 10);
}

function normalizeJobUrl(value: string | null | undefined): string | null {
  const trimmed = (value ?? "").trim();
  return trimmed || null;
}

export function EditApplicationModal({
  open,
  application,
  onClose,
  onSave,
}: EditApplicationModalProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("Applied");
  const [dateApplied, setDateApplied] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (application) {
      setJobTitle(application.job_title);
      setCompanyName(application.company_name);
      setIndustry(application.industry);
      setJobUrl(application.job_url ?? "");
      setStatus(application.status);
      setDateApplied(normalizeDate(application.date_applied));
    }
  }, [application]);

  const isDirty = useMemo(() => {
    if (!application) return false;

    return (
      jobTitle.trim() !== application.job_title ||
      companyName.trim() !== application.company_name ||
      industry !== application.industry ||
      status !== application.status ||
      normalizeDate(dateApplied) !== normalizeDate(application.date_applied) ||
      normalizeJobUrl(jobUrl) !== normalizeJobUrl(application.job_url)
    );
  }, [
    application,
    jobTitle,
    companyName,
    industry,
    jobUrl,
    status,
    dateApplied,
  ]);

  if (!open || !application) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isDirty || !application) return;

    setIsSubmitting(true);
    setError(null);

    const saved = await onSave(application.id, {
      job_title: jobTitle.trim(),
      company_name: companyName.trim(),
      industry,
      status,
      date_applied: normalizeDate(dateApplied),
      job_url: normalizeJobUrl(jobUrl),
    });

    setIsSubmitting(false);

    if (saved) {
      onClose();
    } else {
      setError("Failed to save changes. Try again.");
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-headline-md font-semibold text-primary">
              Update Application
            </h3>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Edit the details for this application.
            </p>
          </div>
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
              htmlFor="edit-job-title"
              className="text-body-sm font-semibold text-on-surface"
            >
              Job Title
            </label>
            <input
              id="edit-job-title"
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-company-name"
              className="text-body-sm font-semibold text-on-surface"
            >
              Company Name
            </label>
            <input
              id="edit-company-name"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-industry"
              className="text-body-sm font-semibold text-on-surface"
            >
              Industry
            </label>
            <div className="relative">
              <select
                id="edit-industry"
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
                required
              >
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
              htmlFor="edit-job-url"
              className="text-body-sm font-semibold text-on-surface"
            >
              Job Post Link (Optional)
            </label>
            <input
              id="edit-job-url"
              type="url"
              value={jobUrl}
              onChange={(event) => setJobUrl(event.target.value)}
              placeholder="https://company.com/jobs/..."
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-status"
              className="text-body-sm font-semibold text-on-surface"
            >
              Status
            </label>
            <div className="relative">
              <select
                id="edit-status"
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

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-date"
              className="text-body-sm font-semibold text-on-surface"
            >
              Date Applied
            </label>
            <input
              id="edit-date"
              type="date"
              value={dateApplied}
              onChange={(event) => setDateApplied(event.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/10"
              required
            />
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
              disabled={!isDirty || isSubmitting}
              className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
