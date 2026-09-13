// ==============================================================================
// 3LINE GADGETS — GLOBAL APPLICATION FOOTER
// components/shared/Footer.tsx
// ==============================================================================

import Link from 'next/link';
import { Layers, ShieldCheck, Truck, Lock, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Value Props Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-200 text-sm">Direct Import Guarantee</div>
              <div className="text-slate-400">100% authentic gadgets sourced from verified global manufacturers.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-200 text-sm">Nationwide Dispatch</div>
              <div className="text-slate-400">Safe, tracked logistics across all 36 states and FCT Nigeria.</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-200 text-sm">Encrypted Settlements</div>
              <div className="text-slate-400">Strict bank-grade security and tamper-proof order state tracking.</div>
            </div>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-600 flex items-center justify-center text-white text-xs font-black">
              3L
            </div>
            <span className="font-medium text-slate-300">
              3Line Gadgets &copy; {new Date().getFullYear()}
            </span>
            <span className="text-slate-600">&bull;</span>
            <span className="text-slate-400">Importation &amp; Retail Infrastructure</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/" className="hover:text-slate-200 transition-colors">
              Storefront
            </Link>
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Admin Console
            </button>
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              My Account
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
