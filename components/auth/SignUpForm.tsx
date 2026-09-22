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
import { AlertCircle, CheckCircle2, Loader2, User, Mail, Phone, Lock } from 'lucide-react';

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
      <div className="text-center py-6 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 font-montserrat">Registration Submitted</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-sm mx-auto">
            {successInfo.requiresVerification
              ? `We sent a confirmation link to ${successInfo.email}. Please verify your email address to complete registration.`
              : `Your customer account has been created successfully.`}
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-violet-500/20 transition-colors"
        >
          Proceed to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-1">
        <label
          htmlFor="signup-name"
          className="text-xs font-bold text-slate-800 block"
        >
          Full Name
        </label>
        <div className="relative group">
          <Input
            id="signup-name"
            type="text"
            required
            placeholder="e.g. Tunde Adebayo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isPending}
            className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 pl-10 focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10 text-xs sm:text-sm h-10 transition-all shadow-2xs"
          />
          <User className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="signup-email"
          className="text-xs font-bold text-slate-800 block"
        >
          Email Address
        </label>
        <div className="relative group">
          <Input
            id="signup-email"
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 pl-10 focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10 text-xs sm:text-sm h-10 transition-all shadow-2xs"
          />
          <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-1">
        <label
          htmlFor="signup-phone"
          className="text-xs font-bold text-slate-800 block"
        >
          Phone Number <span className="text-slate-400 font-normal">(Optional for delivery updates)</span>
        </label>
        <div className="relative group">
          <Input
            id="signup-phone"
            type="tel"
            placeholder="+234 800 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isPending}
            className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 pl-10 focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10 text-xs sm:text-sm h-10 transition-all shadow-2xs"
          />
          <Phone className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label
            htmlFor="signup-password"
            className="text-xs font-bold text-slate-800 block"
          >
            Password
          </label>
          <div className="relative group">
            <Input
              id="signup-password"
              type="password"
              required
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 pl-9 focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10 text-xs sm:text-sm h-10 transition-all shadow-2xs"
            />
            <Lock className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-violet-600 transition-colors absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="signup-confirm-password"
            className="text-xs font-bold text-slate-800 block"
          >
            Confirm Password
          </label>
          <div className="relative group">
            <Input
              id="signup-confirm-password"
              type="password"
              required
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPending}
              className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 pl-9 focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10 text-xs sm:text-sm h-10 transition-all shadow-2xs"
            />
            <Lock className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-violet-600 transition-colors absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full mt-3 h-11 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/20 transition-all cursor-pointer"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating Customer Account...</span>
          </div>
        ) : (
          <span>Register Customer Account</span>
        )}
      </Button>

      <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
        Already registered with 3Line?{' '}
        <Link href="/auth/login" className="text-violet-600 hover:text-violet-700 font-bold hover:underline ml-1">
          Sign In
        </Link>
      </div>
    </form>
  );
}
