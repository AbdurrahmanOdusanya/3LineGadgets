// ==============================================================================
// 3LINE GADGETS — SIGN UP FORM (CLIENT COMPONENT)
// components/auth/SignUpForm.tsx
// ==============================================================================

'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { signUpAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export function SignUpForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    email: string;
    requiresVerification: boolean;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await signUpAction({
        fullName,
        email,
        phone,
        password,
        confirmPassword,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to create account. Please check your inputs.');
        return;
      }

      setSuccessInfo(res.data || { email, requiresVerification: true });
    });
  };

  if (successInfo) {
    return (
      <div className="text-center py-4 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Registration Submitted</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {successInfo.requiresVerification
              ? `We sent a confirmation link to ${successInfo.email}. Please verify your email address to complete registration.`
              : `Your account has been created successfully.`}
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          Proceed to Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="signup-name"
          className="text-xs font-medium text-slate-300 block"
        >
          Full Name
        </label>
        <Input
          id="signup-name"
          type="text"
          required
          placeholder="e.g. John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="signup-email"
          className="text-xs font-medium text-slate-300 block"
        >
          Email Address
        </label>
        <Input
          id="signup-email"
          type="email"
          required
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="signup-phone"
          className="text-xs font-medium text-slate-300 block"
        >
          Phone Number <span className="text-slate-500">(Optional)</span>
        </label>
        <Input
          id="signup-phone"
          type="tel"
          placeholder="+234 800 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="signup-password"
          className="text-xs font-medium text-slate-300 block"
        >
          Password
        </label>
        <Input
          id="signup-password"
          type="password"
          required
          placeholder="Min 8 characters (1 uppercase, 1 number)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="signup-confirm-password"
          className="text-xs font-medium text-slate-300 block"
        >
          Confirm Password
        </label>
        <Input
          id="signup-confirm-password"
          type="password"
          required
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        className="w-full mt-2"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating Account...</span>
          </>
        ) : (
          <span>Register Customer Account</span>
        )}
      </Button>

      <div className="text-center text-xs text-slate-400 pt-1">
        Already registered?{' '}
        <Link href="/auth/login" className="text-cyan-400 hover:underline font-medium">
          Sign In
        </Link>
      </div>
    </form>
  );
}
