// ==============================================================================
// 3LINE GADGETS — AUTH EXCHANGE CALLBACK ROUTE
// app/auth/callback/route.ts
// ==============================================================================

import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Return user to error page or login with an error message
  return NextResponse.redirect(new URL('/auth/login?error=Verification+failed', request.url));
}
