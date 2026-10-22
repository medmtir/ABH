// ============================================================
// ABH Company — Supabase Client Setup
// ============================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ----- Public Anon Client -----
function createPublicClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn(
      '[ABH Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — public client not configured.'
    );
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// ----- Service Role Client (Admin) -----
function createAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.warn(
      '[ABH Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — admin client not configured.'
    );
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/** Public Supabase client (anon key). May be null if env vars are missing. */
export const supabase = createPublicClient();

/** Admin Supabase client (service role key). May be null if env vars are missing. */
export const supabaseAdmin = createAdminClient();
