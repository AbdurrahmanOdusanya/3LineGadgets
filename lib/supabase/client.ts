// ==============================================================================
// 3LINE GADGETS — BROWSER SUPABASE CLIENT
// lib/supabase/client.ts
// ==============================================================================

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { getSupabaseUrl, getSupabaseAnonKey } from '@/lib/supabase/config';

/**
 * Creates and returns a Supabase client configured for Client Components / browser.
 * Uses public anonymous credentials only.
 */
export function createClient() {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
