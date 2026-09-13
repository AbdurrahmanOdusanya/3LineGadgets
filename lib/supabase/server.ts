// ==============================================================================
// 3LINE GADGETS — SERVER SUPABASE CLIENT
// lib/supabase/server.ts
// ==============================================================================

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import { getSupabaseUrl, getSupabaseAnonKey } from '@/lib/supabase/config';

/**
 * Creates and returns a Supabase client for Server Components, Server Actions,
 * and Route Handlers with secure cookie persistence.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` was called from a Server Component.
            // This can be safely ignored when middleware handles session refresh.
          }
        },
      },
    }
  );
}
