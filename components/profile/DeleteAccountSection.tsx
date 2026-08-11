"use client";

import { FormEvent, useActionState, useState } from "react";
import { deleteAccount } from "@/app/auth/actions";
import { AuthField } from "@/components/auth/AuthField";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { clearProfile } from "@/lib/profile/storage";

type DeleteAccountSectionProps = {
  userId: string | undefined;
};

export function DeleteAccountSection({ userId }: DeleteAccountSectionProps) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [state, formAction, isPending] = useActionState(deleteAccount, null);

  function handleOpen() {
    setPassword("");
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setPassword("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (userId) {
      clearProfile(userId);
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-error/30 bg-error-container/10 p-5 shadow-sm sm:p-6">
        <h3 className="mb-2 flex items-center gap-2 text-headline-md font-semibold text-error">
          <MaterialIcon name="warning" className="text-error" />
          Danger zone
        </h3>
        <p className="mb-4 text-body-sm text-on-surface-variant">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button
          type="button"
          onClick={handleOpen}
          className="rounded-lg border border-error/40 bg-surface-container-lowest px-4 py-2.5 text-body-sm font-medium text-error transition-colors hover:bg-error-container/20"
        >
          Delete account
        </button>
      </section>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label="Close modal backdrop"
            className="absolute inset-0 cursor-pointer bg-primary/30 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="relative z-10 flex w-full max-w-md flex-col gap-4 rounded-2xl border border-error/30 bg-surface-container-lowest p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-headline-md font-semibold text-error">
                  Delete account
                </h2>
                <p className="mt-1 text-body-sm text-on-surface-variant">
                  Enter your password to permanently delete your account.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
                aria-label="Close"
              >
                <MaterialIcon name="close" />
              </button>
            </div>

            <form
              action={formAction}
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <AuthField
                label="Password"
                id="delete-account-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              {state?.error ? (
                <div
                  className="rounded-lg border border-error/20 bg-error-container px-3 py-2 text-body-sm text-error"
                  role="alert"
                >
                  {state.error}
                </div>
              ) : null}

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border border-outline-variant px-4 py-2.5 text-body-sm text-on-surface transition-colors hover:bg-surface-container-low"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-error px-4 py-2.5 text-body-sm font-semibold text-on-error transition-colors hover:bg-error/90 disabled:opacity-70"
                >
                  {isPending ? "Deleting..." : "Delete my account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
