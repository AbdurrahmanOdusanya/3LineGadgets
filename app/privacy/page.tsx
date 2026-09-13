// ==============================================================================
// 3LINE GADGETS — PRIVACY POLICY PAGE
// app/privacy/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/auth/session';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { ChevronRight, Shield } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Privacy Policy — 3Line Gadgets',
  description: 'How 3Line Gadgets protects your data, customer contact information, and payment security.',
};

export default async function PrivacyPage() {
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
          <span className="font-semibold text-slate-900">Privacy Policy</span>
        </nav>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <div className="space-y-2 border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>Security &amp; Data Protection</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Privacy &amp; Data Policy
            </h1>
            <p className="text-xs text-slate-400">Last updated: September 2026</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p className="text-slate-600">
              When you purchase electronics on 3Line Gadgets, we collect only necessary delivery and identification details: your name, contact phone number, delivery address, and email address for order notifications.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">2. Payment Security</h2>
            <p className="text-slate-600">
              We do not store your raw debit card or bank credentials on our servers. All digital transactions are processed through PCI-DSS Level 1 compliant financial gateways with end-to-end cryptographic tokenization.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">3. How We Use Customer Details</h2>
            <p className="text-slate-600">
              Your details are used strictly to process orders, verify serial warranties, communicate courier tracking updates via SMS or WhatsApp, and maintain your customer account history. We will never sell or rent customer data to third-party advertisers.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 text-slate-500 text-xs">
            For questions or requests regarding your data, contact our data privacy desk at privacy@3linegadgets.com.
          </div>
        </div>
      </main>

      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
