// ==============================================================================
// 3LINE GADGETS — UNAUTHORIZED ACCESS PAGE
// app/unauthorized/page.tsx
// ==============================================================================

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-900 flex items-center justify-center p-6 font-manrope">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl shadow-slate-200/60">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-600 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-2 font-montserrat">
          Access Restricted
        </h1>
        
        <p className="text-slate-600 text-sm mb-8 leading-relaxed font-medium">
          You do not have administrative permissions to view this section.
          If you believe this is in error, please contact your store administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            href="/shop"
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors shadow-sm shadow-violet-500/20"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
