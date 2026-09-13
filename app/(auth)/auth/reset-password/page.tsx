// ==============================================================================
// 3LINE GADGETS — PASSWORD RESET REQUEST PAGE
// app/(auth)/auth/reset-password/page.tsx
// ==============================================================================

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <Card className="border-slate-800 bg-slate-900/90 shadow-2xl">
      <CardHeader className="text-center pb-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-2">
          <KeyRound className="w-5 h-5" />
        </div>
        <CardTitle className="text-xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your registered email address and we will send you secure recovery instructions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
