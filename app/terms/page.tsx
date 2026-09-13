// ==============================================================================
// 3LINE GADGETS — TERMS OF SERVICE PAGE
// app/terms/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/auth/session';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { ChevronRight, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Terms of Service — 3Line Gadgets',
  description: 'Terms and conditions governing purchases, deliveries, warranties, and orders on 3Line Gadgets.',
};

export default async function TermsPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <StorefrontNavbar
        userProfile={
          profile
            ? {
                id: profile.id,
                full_name: profile.full_name,
                role: profile.role,
              }
            : null
        }
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-violet-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">Terms of Service</span>
        </nav>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-2 border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>Legal &amp; Store Terms</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400">Last updated: September 2026</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">1. Product Authenticity &amp; Warranty</h2>
            <p className="text-slate-600">
              All electronics, laptops, smartphones, and accessories sold by 3Line Gadgets are 100% genuine and factory sealed. Every brand-new flagship device is accompanied by our standard 1-year limited warranty honoring manufacturer defect coverage.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. Ordering &amp; Pricing</h2>
            <p className="text-slate-600">
              All prices listed on 3Line Gadgets are quoted in Nigerian Naira (NGN, ₦). We reserve the right to adjust prices to reflect international foreign exchange fluctuations and verified hardware supply changes without prior notice.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">3. Shipping &amp; Delivery Verification</h2>
            <p className="text-slate-600">
              Deliveries within Lagos state are executed within 24 hours via our dedicated dispatch riders. Deliveries to Abuja, Port Harcourt, and other states across Nigeria are handled via verified logistics partners. Customers are required to inspect the tamper-evident seal upon delivery.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">4. Returns &amp; Replacement</h2>
            <p className="text-slate-600">
              In accordance with our Return Policy, hardware displaying factory defects must be reported within 7 calendar days of delivery with the original packaging and invoice intact.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-slate-500 text-xs">
            For legal inquiries, reach us at support@3linegadgets.com or visit our Ikeja physical center at Otigba Street, Computer Village, Lagos.
          </div>
        </div>
      </main>

      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
