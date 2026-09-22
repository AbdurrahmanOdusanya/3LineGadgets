// ==============================================================================
// 3LINE GADGETS — PASSWORD RESET REQUEST PAGE
// app/(auth)/auth/reset-password/page.tsx
// ==============================================================================

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { KeyRound } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <Card className="border-slate-200/90 bg-white text-slate-900 shadow-xl shadow-slate-200/60 rounded-3xl overflow-hidden">
      <CardHeader className="text-center pb-3 pt-8 px-6 sm:px-8">
        <div className="w-12 h-12 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 mx-auto flex items-center justify-center mb-3 shadow-xs">
          <KeyRound className="w-5 h-5" />
        </div>
        <CardTitle className="text-2xl font-black tracking-tight text-slate-900 font-montserrat">
          Reset Password
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-slate-500 font-manrope max-w-sm mx-auto">
          Enter your registered email address and we will send you secure account recovery instructions.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 sm:px-8 pb-8 pt-2">
        <ResetPasswordForm />
      </CardContent>
    </Card>
  );
}
