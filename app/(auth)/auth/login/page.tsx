// ==============================================================================
// 3LINE GADGETS — SIGN IN PAGE
// app/(auth)/auth/login/page.tsx
// ==============================================================================

import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  return (
    <Card className="border-slate-800 bg-slate-900/90 shadow-2xl">
      <CardHeader className="text-center pb-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-2">
          <Lock className="w-5 h-5" />
        </div>
        <CardTitle className="text-xl">Sign in to 3Line Gadgets</CardTitle>
        <CardDescription>
          Access your customer orders, tracking, and saved cart.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div className="text-xs text-slate-500 text-center py-6">Loading authentication...</div>}>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
