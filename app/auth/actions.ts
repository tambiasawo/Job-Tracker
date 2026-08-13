"use server";

import { auth } from "@/lib/auth/server";
import type { AuthActionState } from "@/lib/auth/action-state";
import { newUserDashboardUrl } from "@/lib/auth/onboarding";
import { redirect } from "next/navigation";

export async function signInWithEmail(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || !email.trim()) {
    return { error: "Email is required." };
  }

  if (typeof password !== "string" || !password) {
    return { error: "Password is required." };
  }

  const { error } = await auth.signIn.email({
    email: email.trim(),
    password,
  });

  if (error) {
    return { error: error.message || "Failed to sign in. Try again." };
  }

  redirect("/");
}

export async function signUpWithEmail(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return { error: "Please enter appropriate values for all fields." };
  }

  if (!name.trim() || !email.trim() || !password) {
    return { error: "Please fill out all required fields." };
  }

  const trimmedEmail = email.trim();
  const trimmedName = name.trim();

  const { error: signUpError } = await auth.signUp.email({
    email: trimmedEmail,
    password,
    name: trimmedName,
  });

  if (signUpError) {
    return {
      error: signUpError.message || "Failed to sign up. Try again.",
    };
  }

  const { error: signInError } = await auth.signIn.email({
    email: trimmedEmail,
    password,
  });

  if (signInError) {
    return {
      error:
        signInError.message ||
        "Account created but sign-in failed. Try signing in.",
    };
  }

  redirect(newUserDashboardUrl());
}

export async function deleteAccount(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = formData.get("password");

  if (typeof password !== "string" || !password) {
    return { error: "Enter your password to confirm account deletion." };
  }

  const { error } = await auth.deleteUser({ password });

  if (error) {
    return {
      error:
        error.message ||
        "Could not delete your account. Account deletion may need to be enabled in Neon Auth.",
    };
  }

  redirect("/auth/sign-in");
}
