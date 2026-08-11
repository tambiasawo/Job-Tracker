"use client";

import { FormEvent, useEffect, useState } from "react";
import { AuthField } from "@/components/auth/AuthField";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { UserProfileData } from "@/lib/profile/types";

type EditProfileModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: UserProfileData) => void;
  initialProfile: UserProfileData;
  userName: string;
  userEmail: string;
};

export function EditProfileModal({
  open,
  onClose,
  onSave,
  initialProfile,
  userName,
  userEmail,
}: EditProfileModalProps) {
  const [title, setTitle] = useState(initialProfile.title);
  const [location, setLocation] = useState(initialProfile.location);
  const [bio, setBio] = useState(initialProfile.bio);

  useEffect(() => {
    if (!open) return;
    setTitle(initialProfile.title);
    setLocation(initialProfile.location);
    setBio(initialProfile.bio);
  }, [open, initialProfile]);

  if (!open) return null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({
      title: title.trim(),
      location: location.trim(),
      bio: bio.trim(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 cursor-pointer bg-primary/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-2xl">
        <div className="flex items-center justify-between border-b border-outline-variant/50 px-5 py-4 sm:px-6">
          <h2 className="text-headline-md font-semibold text-primary">
            Edit Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
            aria-label="Close"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <form
          className="flex flex-col gap-4 overflow-y-auto px-5 py-5 sm:px-6"
          onSubmit={handleSubmit}
        >
          <AuthField
            label="Name"
            id="edit-profile-name"
            name="name"
            type="text"
            value={userName}
            readOnly
            className="cursor-not-allowed opacity-70"
          />

          <AuthField
            label="Email"
            id="edit-profile-email"
            name="email"
            type="email"
            value={userEmail}
            readOnly
            className="cursor-not-allowed opacity-70"
          />

          <AuthField
            label="Current or target role"
            id="edit-profile-title"
            name="title"
            type="text"
            placeholder="e.g. Senior UX Designer"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <AuthField
            label="Location"
            id="edit-profile-location"
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
              rows={5}
              placeholder="Tell employers a bit about your background..."
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-sm text-black outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/10"
            />
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-outline-variant/30 pt-4 sm:flex-row sm:justify-end sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-outline-variant px-4 py-2.5 text-body-sm text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2.5 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary/90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
