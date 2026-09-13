// ==============================================================================
// 3LINE GADGETS — ADMIN TOP BAR / HEADER
// components/admin/AdminHeader.tsx
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  userRole?: string;
  adminName?: string | null;
}

export function AdminHeader({
  onMenuToggle,
  userRole = 'admin',
  adminName,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Small Brand on Mobile */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-900">3Line Gadgets</span>
        </div>

        {/* Status Pill on Desktop */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Admin System Active
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">
            Signed in as <strong className="text-slate-800">{adminName || 'Admin'}</strong>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
        >
          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden sm:inline">Storefront</span>
        </Link>

        <Badge variant="violet" className="font-semibold uppercase text-[11px] py-1">
          <ShieldCheck className="w-3 h-3 mr-1 text-violet-600" />
          {userRole}
        </Badge>
      </div>
    </header>
  );
}
