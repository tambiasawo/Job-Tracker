import { EMPTY_PROFILE, type UserProfileData } from "./types";

const STORAGE_PREFIX = "careerpath-profile";

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`;
}

export function loadProfile(userId: string): UserProfileData {
  if (typeof window === "undefined") return EMPTY_PROFILE;

  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return EMPTY_PROFILE;

    const parsed = JSON.parse(raw) as Partial<UserProfileData>;
    return {
      title: parsed.title ?? "",
      location: parsed.location ?? "",
      bio: parsed.bio ?? "",
    };
  } catch {
    return EMPTY_PROFILE;
  }
}

export function saveProfile(userId: string, profile: UserProfileData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(userId), JSON.stringify(profile));
}

export function clearProfile(userId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(userId));
}
