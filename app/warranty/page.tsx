// ==============================================================================
// 3LINE GADGETS — WARRANTY & RETURNS POLICY PAGE
// app/warranty/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/auth/session';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import {
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  PackageCheck,
  AlertCircle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Warranty & Returns — 3Line Gadgets',
  description: '1-Year comprehensive warranty, 7-day hassle-free returns, and authentic hardware guarantees on all flagship devices.',
};

export default async function WarrantyPage() {
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

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-violet-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">Warranty &amp; Returns</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Guaranteed Authenticity</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            1-Year Warranty &amp; Return Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            At 3Line Gadgets, every flagship phone, developer MacBook, and audio accessory is directly imported, 100% factory sealed, and protected under our comprehensive warranty and dedicated Ikeja repair center.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">12 Months Full Warranty</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              All factory-sealed brand new electronics include 1 year of hardware manufacturer &amp; local warranty covering internal component defects.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">7-Day Replacement</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              If your item arrives with an out-of-the-box defect or incorrect specifications, return it within 7 days for an instant swap or full refund.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">100% Authentic Seals</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We never sell refurbished or tampered devices as new. Serial numbers can be validated directly on Apple, Samsung, and Sony official checkers.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-slate-700 text-xs sm:text-sm">
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              How to Initiate a Warranty Claim
            </h2>
            <p className="text-slate-500 leading-relaxed">
              If your gadget experiences an issue during normal usage:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 pl-2 pt-1">
              <li>Keep your original digital order receipt or order number generated at checkout.</li>
              <li>Reach out to our customer care team via WhatsApp at <strong>+234 812 345 6789</strong> with a short video of the issue.</li>
              <li>Bring or courier the device to our diagnostic center at Otigba Street, Computer Village, Ikeja, Lagos.</li>
              <li>Our certified technicians will assess the hardware and provide a repair, replacement, or manufacturer escalation within 48 to 72 business hours.</li>
            </ol>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              What Is Covered vs. Not Covered
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs space-y-2">
                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Covered Under Warranty</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-emerald-900/80">
                  <li>Motherboard and logic board failures</li>
                  <li>Factory battery defects failing retention criteria</li>
                  <li>Display anomalies without physical impact</li>
                  <li>Camera and audio module manufacturer malfunctions</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100 text-xs space-y-2">
                <div className="font-bold text-rose-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Not Covered (Accidental Damage)</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-rose-900/80">
                  <li>Liquid spills or immersion damage</li>
                  <li>Cracked screens from drops or external pressure</li>
                  <li>Third-party unapproved repair attempts</li>
                  <li>Electrical surge damage from non-certified chargers</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Support Hub */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-bold text-slate-900">Have questions about your warranty?</p>
              <p className="text-xs text-slate-500">Our Lagos support technicians are active Monday through Saturday, 9am - 6pm.</p>
            </div>
            <a
              href="https://wa.me/2348123456789"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp +234 812 345 6789</span>
            </a>
          </div>
        </div>
      </main>

      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
