// ==============================================================================
// 3LINE GADGETS — SUPABASE CONFIGURATION RESOLVER
// lib/supabase/config.ts
// ==============================================================================

// Project-specific defaults configured for 3Line Gadgets
export const DEFAULT_SUPABASE_PROJECT_ID = 'buozhejzftysinmdstzv';
export const DEFAULT_SUPABASE_URL = 'https://buozhejzftysinmdstzv.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1b3poZWp6ZnR5c2lubWRzdHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3MjI5ODQsImV4cCI6MjEwNDI5ODk4NH0.zhTjaImVdQpCbqR1jomQBgDiGPKj9EVQsEKdlZR9JtQ';
export const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_YLNgQLx4-kY9feE6ciBKbQ_nsVuMIsm';

/**
 * Extracts the project reference from a Supabase JWT (anon or service_role).
 */
function extractRefFromJwt(token?: string): string | null {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  try {
    const parts = token.split('.');
    if (parts.length >= 2) {
      const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payloadJson =
        typeof atob === 'function'
          ? atob(payloadBase64)
          : Buffer.from(payloadBase64, 'base64').toString('utf8');
      const payload = JSON.parse(payloadJson);
      return typeof payload.ref === 'string' ? payload.ref : null;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Validates whether a string is a well-formed HTTP/HTTPS URL.
 */
function isValidUrl(candidate?: string): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Intelligently resolves and sanitizes the Supabase Project URL.
 * Protects against accidental key swaps (e.g. setting an API key into SUPABASE_URL).
 */
export function getSupabaseUrl(): string {
  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  const publishableKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').trim();

  // 1. If rawUrl is a valid HTTP(S) URL and NOT an API key
  if (
    isValidUrl(rawUrl) &&
    !rawUrl.includes('sb_publishable_') &&
    !rawUrl.includes('eyJ')
  ) {
    // Strip trailing /rest/v1 or trailing slash if user provided full REST endpoint
    return rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  }

  // 2. If rawUrl was provided without protocol (e.g., "xxxx.supabase.co")
  if (rawUrl && rawUrl.includes('.supabase.co') && !rawUrl.startsWith('http')) {
    const candidate = `https://${rawUrl.replace(/^\/+/, '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')}`;
    if (isValidUrl(candidate)) return candidate;
  }

  // 3. If rawUrl was provided as a 20-char project reference (e.g. "buozhejzftysinmdstzv")
  if (rawUrl && /^[a-z0-9]{20}$/i.test(rawUrl)) {
    return `https://${rawUrl.toLowerCase()}.supabase.co`;
  }

  // 4. If NEXT_PUBLIC_APP_URL was set to the Supabase project reference
  if (appUrl && /^[a-z0-9]{20}$/i.test(appUrl)) {
    return `https://${appUrl.toLowerCase()}.supabase.co`;
  }

  // 5. Infer project reference from available JWTs (service_role or anon JWT)
  const ref =
    extractRefFromJwt(serviceKey) ||
    extractRefFromJwt(anonKey) ||
    extractRefFromJwt(rawUrl.startsWith('eyJ') ? rawUrl : undefined);

  if (ref && /^[a-z0-9]{20}$/i.test(ref)) {
    return `https://${ref.toLowerCase()}.supabase.co`;
  }

  // 6. Default to the configured 3Line Gadgets Supabase project URL
  return DEFAULT_SUPABASE_URL;
}

/**
 * Intelligently resolves the Supabase Anon / Publishable API key.
 * Handles cases where the publishable key was placed into NEXT_PUBLIC_SUPABASE_URL.
 */
export function getSupabaseAnonKey(): string {
  const rawAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  const rawPublishableKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim();
  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  // 1. Standard anon key if it's a valid JWT
  if (rawAnonKey && rawAnonKey.startsWith('eyJ') && !rawAnonKey.includes('placeholder')) {
    return rawAnonKey;
  }

  // 2. Standard publishable key
  if (rawPublishableKey && rawPublishableKey.startsWith('sb_publishable_')) {
    return rawPublishableKey;
  }

  // 3. Check if rawUrl was accidentally filled with a publishable or anon key
  if (rawUrl.startsWith('eyJ')) {
    return rawUrl;
  }
  if (rawUrl.startsWith('sb_publishable_')) {
    return rawUrl;
  }

  // 4. Check if serviceKey was actually an anon JWT
  if (serviceKey && serviceKey.startsWith('eyJ') && serviceKey.includes('"role":"anon"')) {
    return serviceKey;
  }

  // 5. Fallback to default legacy anon key for 3Line Gadgets project
  return DEFAULT_SUPABASE_ANON_KEY;
}

/**
 * Check whether Supabase has real credentials configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return (
    isValidUrl(url) &&
    !url.includes('placeholder.supabase.co') &&
    key.length > 20
  );
}
