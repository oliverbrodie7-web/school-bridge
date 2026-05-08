import { createClient } from "@supabase/supabase-js";

// External Supabase project — publishable values (safe in browser when RLS is enabled)
const SUPABASE_URL = "https://tnyspcyptwjsvajwyunp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueXNwY3lwdHdqc3Zhand5dW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxNTA2NDMsImV4cCI6MjA5MzcyNjY0M30.g2pqC-k9_bFLhGWNMq4X35j4rh71rkrXKN1ftKrPOtQ";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
