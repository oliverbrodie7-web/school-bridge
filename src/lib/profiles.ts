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
  year_level: number | string;
  avatar_colour: string;
  created_at?: string;
}

const fromDb = (r: DbProfile): Profile => ({
  id: r.id,
  name: r.name,
  yearLevel: typeof r.year_level === "string" ? Number(r.year_level) : r.year_level,
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
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      name: p.name,
      year_level: String(p.yearLevel),
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
  if (patch.yearLevel !== undefined) dbPatch.year_level = String(patch.yearLevel);
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
 */
export const migrateLocalProfilesIfNeeded = async (): Promise<void> => {
  try {
    const raw = localStorage.getItem("profiles");
    if (!raw) return;
    const local = JSON.parse(raw) as Array<{ name: string; yearLevel: number; colour: string }>;
    if (!Array.isArray(local) || local.length === 0) {
      localStorage.removeItem("profiles");
      return;
    }
    for (const p of local) {
      await insertProfile({ name: p.name, yearLevel: p.yearLevel, colour: p.colour });
    }
    localStorage.removeItem("profiles");
  } catch {
    // silent — keep localStorage intact, retry next load
  }
};
