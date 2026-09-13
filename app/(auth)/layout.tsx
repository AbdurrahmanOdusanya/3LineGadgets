// ==============================================================================
// 3LINE GADGETS — AUTHENTICATION ROUTE LAYOUT
// app/(auth)/layout.tsx
// ==============================================================================

import Link from 'next/link';
import { Layers } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Brand Bar */}
      <div className="max-w-md w-full mx-auto pt-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-bold text-base tracking-tight"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-cyan-950/50">
            <Layers className="w-4 h-4" />
          </div>
          <span className="tracking-wider uppercase font-black">
            3Line<span className="text-cyan-400">Gadgets</span>
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          &larr; Storefront
        </Link>
      </div>

      {/* Main Auth Container */}
      <div className="max-w-md w-full mx-auto my-8">
        {children}
      </div>

      {/* Footer copyright */}
      <div className="max-w-md w-full mx-auto pb-4 text-center text-xs text-slate-500">
        3Line Gadgets Platform Foundation &bull; Supabase Auth
      </div>
    </div>
  );
}
