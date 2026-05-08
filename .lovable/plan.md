## Goal
Bring the Supabase setup in line with the original spec: fix the `profiles` table, create the missing `progress` table, and update the app code to match.

## Step 1 — SQL you run in Supabase (SQL Editor)

```sql
-- Fix profiles: add parent_id, change year_level text → integer
alter table public.profiles
  add column if not exists parent_id uuid;

alter table public.profiles
  alter column year_level type integer using year_level::integer;

-- Create progress table
create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  strategy_key text not null,
  learn_complete boolean not null default false,
  level3_unlocked boolean not null default false,
  unique (profile_id, strategy_key)
);

alter table public.progress enable row level security;
create policy "allow all" on public.progress for all using (true) with check (true);

-- Auto-update updated_at on progress
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_progress_updated_at on public.progress;
create trigger trg_progress_updated_at
before update on public.progress
for each row execute function public.set_updated_at();
```

## Step 2 — Code changes (I make these)

Update `src/lib/profiles.ts`:
- Send `year_level` as a number (not stringified) on insert/update
- Read `year_level` directly as a number
- No other behaviour changes

No other files change. Existing localStorage migration logic stays intact.

## Step 3 — Verification

After you run the SQL, confirm in Supabase Table Editor:
- `profiles` has `parent_id` (uuid, nullable) and `year_level` is `integer`
- `progress` exists with all 7 columns and a foreign key to `profiles.id`
- Both tables show RLS enabled with one permissive policy

Then create a profile via the app and confirm the row in Supabase has `year_level` stored as an integer.

## Out of scope
- No changes to Learn / Practise / Parent Guide pages
- No use of the `progress` table from the app yet (that's the next migration prompt)
- No auth wiring for `parent_id` yet
