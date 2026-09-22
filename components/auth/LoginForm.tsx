// ==============================================================================
// 3LINE GADGETS — LOGIN FORM (CLIENT COMPONENT)
// components/auth/LoginForm.tsx
// ==============================================================================

'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signInAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2, Eye, EyeOff, Lock, Mail } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(urlError);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    startTransition(async () => {
      const res = await signInAction({ email, password });
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify your email and password.');
        return;
      }

      router.push(redirectTo);
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5 leading-relaxed">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="text-xs font-bold text-slate-800 block"
        >
          Email Address
        </label>
        <div className="relative group">
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 pl-10 focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10 text-xs sm:text-sm h-11 transition-all shadow-2xs"
          />
          <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="text-xs font-bold text-slate-800 block"
          >
            Password
          </label>
          <Link
            href="/auth/reset-password"
            className="text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative group">
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="rounded-xl border border-slate-200 bg-white hover:border-slate-300 focus:bg-white text-slate-900 font-medium placeholder:text-slate-400 pl-10 pr-10 focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10 text-xs sm:text-sm h-11 transition-all shadow-2xs"
          />
          <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-violet-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-md focus:outline-none transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-slate-600" />
            ) : (
              <Eye className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full mt-2 h-11 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/20 transition-all cursor-pointer"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in to 3Line Gadgets...</span>
          </div>
        ) : (
          <span>Sign In</span>
        )}
      </Button>

      {/* Bottom Switcher */}
      <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
        Don&apos;t have a 3Line account yet?{' '}
        <Link
          href="/auth/signup"
          className="text-violet-600 hover:text-violet-700 font-bold hover:underline ml-1"
        >
          Create Customer Account
        </Link>
      </div>
    </form>
  );
}
