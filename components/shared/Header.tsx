// ==============================================================================
// 3LINE GADGETS — GLOBAL APPLICATION HEADER
// components/shared/Header.tsx
// ==============================================================================

import Link from 'next/link';
import { Layers, ShieldCheck, User, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { getCurrentProfile } from '@/lib/auth/session';

export async function Header() {
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white font-bold text-lg tracking-tight group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-black tracking-wider text-base uppercase">
              3Line<span className="text-cyan-400">Gadgets</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 -mt-0.5">
              Import & Retail
            </span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>{profile ? profile.full_name || 'My Account' : 'Account'}</span>
          </button>

          {!profile && (
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
