"use client";

import { useCallback, useEffect, useState } from "react";
import { loadProfile, saveProfile } from "./storage";
import { EMPTY_PROFILE, type UserProfileData } from "./types";

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfileData>(EMPTY_PROFILE);

  useEffect(() => {
    if (!userId) {
      setProfile(EMPTY_PROFILE);
      return;
    }

    setProfile(loadProfile(userId));
  }, [userId]);

  const updateProfile = useCallback(
    (updates: Partial<UserProfileData>) => {
      if (!userId) return;

      setProfile((current) => {
        const next = { ...current, ...updates };
        saveProfile(userId, next);
        return next;
      });
    },
    [userId],
  );

  return { profile, updateProfile };
}
