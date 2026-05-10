import { supabase } from "@/integrations/supabase/client";
import { fetchProfiles } from "./profiles";

export type StrategyKey = "splitStrategy" | "plusTen" | "halvesQuartersEighths";

/** Resolve the currently selected profile id from Supabase + localStorage index. */
export const getActiveProfileId = async (): Promise<string | null> => {
  try {
    const profiles = await fetchProfiles();
    if (profiles.length === 0) return null;
    const idx = Number(localStorage.getItem("selectedProfileIndex") || "0");
    return profiles[idx]?.id ?? profiles[0].id;
  } catch {
    return null;
  }
};

interface ProgressRow {
  learn_complete: boolean;
  level3_unlocked: boolean;
}

const fetchRow = async (
  profileId: string,
  strategyKey: StrategyKey
): Promise<ProgressRow | null> => {
  const { data, error } = await supabase
    .from("progress")
    .select("learn_complete, level3_unlocked")
    .eq("profile_id", profileId)
    .eq("strategy_key", strategyKey)
    .maybeSingle();
  if (error) throw error;
  return (data as ProgressRow) ?? null;
};

export const getLearnComplete = async (
  strategyKey: StrategyKey
): Promise<boolean> => {
  const profileId = await getActiveProfileId();
  if (!profileId) return false;
  try {
    const row = await fetchRow(profileId, strategyKey);
    return !!row?.learn_complete;
  } catch {
    return false;
  }
};

export const setLearnComplete = async (
  strategyKey: StrategyKey
): Promise<void> => {
  const profileId = await getActiveProfileId();
  if (!profileId) return;
  await supabase
    .from("progress")
    .upsert(
      {
        profile_id: profileId,
        strategy_key: strategyKey,
        learn_complete: true,
      },
      { onConflict: "profile_id,strategy_key" }
    );
};

export const getLevel3Unlocked = async (
  strategyKey: StrategyKey
): Promise<boolean> => {
  const profileId = await getActiveProfileId();
  if (!profileId) return false;
  try {
    const row = await fetchRow(profileId, strategyKey);
    return !!row?.level3_unlocked;
  } catch {
    return false;
  }
};

export const setLevel3Unlocked = async (
  strategyKey: StrategyKey
): Promise<void> => {
  const profileId = await getActiveProfileId();
  if (!profileId) return;
  await supabase
    .from("progress")
    .upsert(
      {
        profile_id: profileId,
        strategy_key: strategyKey,
        level3_unlocked: true,
      },
      { onConflict: "profile_id,strategy_key" }
    );
};

/**
 * One-time migration: move legacy localStorage learn-complete flags into Supabase
 * for the active profile. Silent on failure (keeps localStorage intact, retries next load).
 */
export const migrateLocalProgressIfNeeded = async (): Promise<void> => {
  try {
    const splitFlag = localStorage.getItem("splitStrategy_learnComplete") === "true";
    const plusFlag = localStorage.getItem("plus10Strategy_learnComplete") === "true";
    if (!splitFlag && !plusFlag) return;

    const profileId = await getActiveProfileId();
    if (!profileId) return; // no profile yet — try next load

    if (splitFlag) {
      const { error } = await supabase.from("progress").upsert(
        {
          profile_id: profileId,
          strategy_key: "splitStrategy",
          learn_complete: true,
        },
        { onConflict: "profile_id,strategy_key" }
      );
      if (!error) localStorage.removeItem("splitStrategy_learnComplete");
    }

    if (plusFlag) {
      const { error } = await supabase.from("progress").upsert(
        {
          profile_id: profileId,
          strategy_key: "plusTen",
          learn_complete: true,
        },
        { onConflict: "profile_id,strategy_key" }
      );
      if (!error) localStorage.removeItem("plus10Strategy_learnComplete");
    }
  } catch {
    // silent
  }
};
