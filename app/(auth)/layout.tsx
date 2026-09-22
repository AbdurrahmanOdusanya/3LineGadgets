// ==============================================================================
// 3LINE GADGETS — AUTHENTICATION ROUTE LAYOUT
// app/(auth)/layout.tsx
// ==============================================================================

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-manrope selection:bg-violet-100 selection:text-violet-900">
      {/* Soft Ambient Background Elements */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-200/30 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-200/25 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Brand Bar */}
      <header className="max-w-md w-full mx-auto pt-2 sm:pt-4 flex items-center justify-between relative z-10">
        <Link
          href="/"
          className="flex items-center text-slate-900 group"
          title="Return to 3Line Gadgets Storefront"
        >
          <span className="leading-tight font-black tracking-tight text-xl uppercase text-slate-900 font-montserrat">
            3Line<span className="text-violet-600">Gadgets</span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-violet-600 transition-colors py-1.5 px-3 rounded-xl hover:bg-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Storefront</span>
        </Link>
      </header>

      {/* Main Auth Container */}
      <main className="max-w-md w-full mx-auto my-6 sm:my-10 relative z-10">
        {children}

        {/* Security & Authenticity Trust Badge */}
        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>100% Genuine Tech</span>
          </div>
        </div>
      </main>

      {/* Footer copyright & ancillary links */}
      <footer className="max-w-md w-full mx-auto pb-4 text-center text-xs text-slate-400 relative z-10 space-y-2">
        <div className="flex items-center justify-center gap-4 text-slate-500">
          <Link href="/terms" className="hover:text-violet-600 transition-colors">
            Terms of Service
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-violet-600 transition-colors">
            Privacy Policy
          </Link>
          <span>·</span>
          <Link href="/contact" className="hover:text-violet-600 transition-colors">
            Support
          </Link>
        </div>
        <p>© {new Date().getFullYear()} 3Line Gadgets. All rights reserved.</p>
      </footer>
    </div>
  );
}
