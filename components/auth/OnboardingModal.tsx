"use client";

import { FormEvent, useState } from "react";
import { AuthField } from "@/components/auth/AuthField";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

type OnboardingModalProps = {
  open: boolean;
  onClose: () => void;
  onSave?: (data: { title: string; location: string }) => void;
};

export function OnboardingModal({
  open,
  onClose,
  onSave,
}: OnboardingModalProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    // Profile save will be wired to the backend later
    onSave?.({ title: title.trim(), location: location.trim() });

    setTimeout(() => {
      setIsSubmitting(false);
      setTitle("");
      setLocation("");
      onClose();
    }, 400);
  }

  function handleSkip() {
    setTitle("");
    setLocation("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close onboarding backdrop"
        className="absolute inset-0 cursor-default bg-primary/25 backdrop-blur-md"
        onClick={handleSkip}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl sm:gap-5 sm:p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <MaterialIcon name="person_add" className="text-2xl" />
          </div>
          <h2 className="text-headline-md font-semibold text-on-surface">
            Complete your profile
          </h2>
          <p className="mt-2 text-body-sm text-on-surface-variant">
            Optional details to personalize your dashboard. You can skip and
            fill these in later.
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <AuthField
            label="Current or target role"
            id="onboarding-title"
            name="title"
            type="text"
            placeholder="e.g. Senior UX Designer"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <AuthField
            label="Location"
            id="onboarding-location"
            name="location"
            type="text"
            placeholder="e.g. San Francisco, CA"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-profile-bio"
              className="text-body-sm font-semibold text-on-surface"
            >
              Professional bio
            </label>
            <textarea
              id="edit-profile-bio"
              name="bio"
              rows={3}
              placeholder="Tell employers a bit about your background..."
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/10"
            />
          </div>
          <div className="rounded-xl border border-outline-variant/60 bg-surface-container-low/80 p-4">
            <div className="flex gap-3">
              <MaterialIcon
                name="lightbulb"
                className="shrink-0 text-secondary"
              />
              <p className="text-body-sm text-on-surface-variant">
                These fields appear on your profile page. Your application stats
                are calculated automatically once you start adding jobs.
              </p>
            </div>
          </div>

          <div className="mt-1 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="underline cursor-pointer rounded-lg px-4 py-2.5 text-body-sm text-on-surface-variant transition-colors hover:bg-surface-container-low"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
