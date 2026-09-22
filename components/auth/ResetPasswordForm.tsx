// ==============================================================================
// 3LINE GADGETS — RESET PASSWORD FORM (CLIENT COMPONENT)
// components/auth/ResetPasswordForm.tsx
// ==============================================================================

'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { requestPasswordResetAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, Mail } from 'lucide-react';

export function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await requestPasswordResetAction({ email });
      if (!res.success) {
        setErrorMessage(res.error || 'Unable to process password reset request.');
        return;
      }
      setSuccessMessage(res.data?.message || 'Password reset link sent.');
    });
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Check Your Inbox</h4>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            {successMessage}
          </p>
          <div className="pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 font-bold hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="reset-email"
              className="text-xs font-bold text-slate-800 block"
            >
              Registered Email Address
            </label>
            <div className="relative group">
              <Input
                id="reset-email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 pl-10 focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10 text-xs sm:text-sm h-11 transition-all shadow-2xs"
              />
              <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/20 transition-all cursor-pointer"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Instructions...</span>
              </div>
            ) : (
              <span>Send Reset Instructions</span>
            )}
          </Button>

          <div className="text-center pt-2 border-t border-slate-100">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-violet-600 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
