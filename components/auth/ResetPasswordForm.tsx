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
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

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
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
          <p className="text-xs text-emerald-300 leading-relaxed">
            {successMessage}
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-300 hover:text-white font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="reset-email"
              className="text-xs font-medium text-slate-300 block"
            >
              Registered Email Address
            </label>
            <Input
              id="reset-email"
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending link...</span>
              </>
            ) : (
              <span>Send Reset Instructions</span>
            )}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-3 h-3" />
              Return to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
