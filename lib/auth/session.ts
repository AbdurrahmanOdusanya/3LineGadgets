// ==============================================================================
// 3LINE GADGETS — SERVER SESSION & ROLE HELPERS
// lib/auth/session.ts
// ==============================================================================

import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';
import type { AuthUser } from '@/types/auth';
import { AuthenticationError, ForbiddenError } from '@/lib/utils/errors';

/**
 * Retrieves the currently authenticated Supabase Auth user.
 * Wrapped in React cache to memoize across Server Component render trees.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch {
    return null;
  }
});

/**
 * Retrieves the current user's profile from the public.profiles table.
 */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return (profile as unknown as Profile) || null;
  } catch {
    return null;
  }
});

/**
 * Server-side guard: Ensures the user is authenticated.
 * If not authenticated, redirects to /auth/login or throws AuthenticationError.
 */
export async function requireAuth(redirectTo?: string): Promise<{ user: AuthUser; profile: Profile }> {
  const user = await getCurrentUser();
  if (!user) {
    const target = redirectTo
      ? `/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`
      : '/auth/login';
    redirect(target);
  }

  const profile = await getCurrentProfile();
  if (!profile || !profile.is_active) {
    redirect('/auth/login?error=account_inactive');
  }

  return { user, profile };
}

/**
 * Server-side guard: Ensures the user is authenticated AND holds 'admin' or 'super_admin' role.
 */
export async function requireAdmin(redirectTo?: string): Promise<{ user: AuthUser; profile: Profile }> {
  const { user, profile } = await requireAuth(redirectTo);

  if (profile.role !== 'admin' && profile.role !== 'super_admin') {
    redirect('/unauthorized');
  }

  return { user, profile };
}

/**
 * Server-side guard: Ensures the user is authenticated AND holds 'super_admin' role.
 */
export async function requireSuperAdmin(redirectTo?: string): Promise<{ user: AuthUser; profile: Profile }> {
  const { user, profile } = await requireAuth(redirectTo);

  if (profile.role !== 'super_admin') {
    redirect('/unauthorized');
  }

  return { user, profile };
}
