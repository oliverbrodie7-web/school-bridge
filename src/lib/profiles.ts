import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  name: string;
  yearLevel: number;
  colour: string;
}

interface DbProfile {
  id: string;
  name: string;
  year_level: number;
  avatar_colour: string;
  created_at?: string;
  parent_id?: string | null;
}

const fromDb = (r: DbProfile): Profile => ({
  id: r.id,
  name: r.name,
  yearLevel: r.year_level,
  colour: r.avatar_colour,
});

export const fetchProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as DbProfile[]).map(fromDb);
};

export const insertProfile = async (p: Omit<Profile, "id">): Promise<Profile> => {
  // Existence check — avoid duplicate inserts for same name + year_level
  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("name", p.name)
    .eq("year_level", p.yearLevel)
    .limit(1)
    .maybeSingle();
  if (existing) {
    console.warn(
      `insertProfile: profile ${p.name} Year ${p.yearLevel} already exists — skipping insert`
    );
    return fromDb(existing as DbProfile);
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      name: p.name,
      year_level: p.yearLevel,
      avatar_colour: p.colour,
    })
    .select()
    .single();
  if (error) throw error;
  return fromDb(data as DbProfile);
};

export const updateProfile = async (
  id: string,
  patch: Partial<Omit<Profile, "id">>
): Promise<void> => {
  const dbPatch: Record<string, unknown> = {};
  if (patch.name !== undefined) dbPatch.name = patch.name;
  if (patch.yearLevel !== undefined) dbPatch.year_level = patch.yearLevel;
  if (patch.colour !== undefined) dbPatch.avatar_colour = patch.colour;
  const { error } = await supabase.from("profiles").update(dbPatch).eq("id", id);
  if (error) throw error;
};

export const deleteProfile = async (id: string): Promise<void> => {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
};

/**
 * One-time migration: if localStorage has "profiles", push them to Supabase
 * then clear localStorage. Silent on failure (keeps localStorage intact).
 *
 * Idempotency:
 *  - sessionStorage "profileMigrationComplete" prevents re-runs in this tab.
 *  - sessionStorage "profileMigrationRunning" prevents concurrent runs.
 *  - insertProfile() itself checks existence before inserting.
 */
export const migrateLocalProfilesIfNeeded = async (): Promise<void> => {
  try {
    if (sessionStorage.getItem("profileMigrationComplete") === "true") return;
    if (sessionStorage.getItem("profileMigrationRunning") === "true") return;
    sessionStorage.setItem("profileMigrationRunning", "true");
  } catch {
    // sessionStorage unavailable — proceed without guards
  }

  try {
    const raw = localStorage.getItem("profiles");
    if (!raw) {
      try { sessionStorage.setItem("profileMigrationComplete", "true"); } catch { /* noop */ }
      return;
    }
    const local = JSON.parse(raw) as Array<{ name: string; yearLevel: number; colour: string }>;
    if (!Array.isArray(local) || local.length === 0) {
      localStorage.removeItem("profiles");
      try { sessionStorage.setItem("profileMigrationComplete", "true"); } catch { /* noop */ }
      return;
    }
    for (const p of local) {
      // insertProfile already checks for an existing matching row
      await insertProfile({ name: p.name, yearLevel: p.yearLevel, colour: p.colour });
    }
    try { sessionStorage.setItem("profileMigrationComplete", "true"); } catch { /* noop */ }
    localStorage.removeItem("profiles");
  } catch {
    // silent — keep localStorage intact, retry next load
  } finally {
    try { sessionStorage.removeItem("profileMigrationRunning"); } catch { /* noop */ }
  }
};
