// ==============================================================================
// 3LINE GADGETS — SIGN IN PAGE
// app/(auth)/auth/login/page.tsx
// ==============================================================================

import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { Lock, Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <Card className="border border-slate-200 bg-white text-slate-900 shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden">
      <CardHeader className="text-center pb-4 pt-8 px-6 sm:px-8 bg-white border-b border-slate-100/80">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 mx-auto flex items-center justify-center mb-3 shadow-xs">
          <Lock className="w-5 h-5" />
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-slate-900 font-montserrat">
          Sign In to 3Line Gadgets
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-slate-600 font-medium font-manrope max-w-sm mx-auto mt-1 leading-relaxed">
          Sign in to purchase authentic imported gadgets with nationwide tracked delivery.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pb-8 pt-6 bg-white">
        <Suspense fallback={<div className="text-xs text-slate-500 text-center py-6">Loading authentication...</div>}>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
