// ==============================================================================
// 3LINE GADGETS — CUSTOMER REGISTRATION PAGE
// app/(auth)/auth/signup/page.tsx
// ==============================================================================

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { UserPlus } from 'lucide-react';

export default function SignUpPage() {
  return (
    <Card className="border-slate-800 bg-slate-900/90 shadow-2xl">
      <CardHeader className="text-center pb-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-2">
          <UserPlus className="w-5 h-5" />
        </div>
        <CardTitle className="text-xl">Create Customer Account</CardTitle>
        <CardDescription>
          Sign up to purchase authentic imported gadgets with nationwide tracked delivery.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  );
}
