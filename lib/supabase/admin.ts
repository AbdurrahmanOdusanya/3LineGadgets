// ==============================================================================
// 3LINE GADGETS — ELEVATED ADMIN SUPABASE CLIENT (SERVER-ONLY)
// lib/supabase/admin.ts
// ==============================================================================

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getSupabaseUrl } from '@/lib/supabase/config';

/**
 * Creates an administrative Supabase client using the Service Role Key.
 *
 * CRITICAL SECURITY RULES:
 * 1. Strictly SERVER-SIDE ONLY. Never expose to client or browser bundle.
 * 2. Bypasses Row Level Security (RLS). Use ONLY for trusted backend processes,
 *    such as system migrations, webhook verification, or background jobs.
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error(
      'CRITICAL: createAdminClient called in browser context! Service role key must never be exposed.'
    );
  }

  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('placeholder.supabase.co')) {
    throw new Error(
      'Missing valid Supabase URL or SUPABASE_SERVICE_ROLE_KEY for admin client initialization.'
    );
  }

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
