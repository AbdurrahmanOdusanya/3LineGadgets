// ==============================================================================
// 3LINE GADGETS — SUPABASE MIDDLEWARE SESSION HANDLER
// lib/supabase/middleware.ts
// ==============================================================================

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database, Profile } from '@/types/database';
import { getSupabaseUrl, getSupabaseAnonKey, isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Updates the user's Supabase session and handles route-level authorization guards
 * before requests reach Server Components or Route Handlers.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!isSupabaseConfigured()) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

  // IMPORTANT: Avoid using getSession() inside middleware as it only reads the cookie
  // and does not guarantee the token has not been revoked or tampered with.
  // getUser() sends a secure verification request to Supabase Auth.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. Customer Account Routes Protection (/account/*)
  if (pathname.startsWith('/account')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }
  }

  // 2. Admin Routes Protection (/admin/*)
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(url);
    }

    // Query user profile to verify admin or super_admin status
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const profile = data as Profile | null;

    if (
      !profile ||
      !profile.is_active ||
      (profile.role !== 'admin' && profile.role !== 'super_admin')
    ) {
      // User is authenticated but does not have administrative privileges
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
  }

    // 3. Auth Routes Redirect for Already Authenticated Users (/auth/login, /auth/signup)
    if (user && (pathname === '/auth/login' || pathname === '/auth/signup')) {
      const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/account';
      const url = request.nextUrl.clone();
      url.pathname = redirectTo;
      url.search = '';
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.warn('Middleware Supabase session update warning:', error);
  }

  return supabaseResponse;
}
