// ==============================================================================
// 3LINE GADGETS — ABOUT US PAGE
// app/about/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentProfile } from '@/lib/auth/session';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { ChevronRight, ShieldCheck, Truck, Headphones, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us — 3Line Gadgets',
  description: 'Learn about 3Line Gadgets, Nigeria’s premier hub for 100% authentic flagship tech, Apple devices, laptops, and audio gear.',
};

export default async function AboutPage() {
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

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-violet-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">About Us</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 text-white p-8 sm:p-14 shadow-xl shadow-violet-500/10">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-violet-200" /> Authentic Flagship Electronics
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-montserrat">
              Redefining How Nigeria Shops for Premium Tech.
            </h1>
            <p className="text-sm sm:text-base text-violet-100 leading-relaxed font-manrope">
              At 3Line Gadgets, we bridge the gap between world-class technology and gadget enthusiasts across Nigeria. 
              From genuine Apple iPhones to pro workstations and studio audio, every item is rigorously inspected, factory-sealed, and backed by comprehensive warranties.
            </p>
          </div>
        </div>

        {/* Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">100% Genuine Tech</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Zero compromises on authenticity. We partner directly with authorized distributors to provide original products with authentic serial numbers and manufacturer warranties.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Rapid Dispatch & Tracking</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Same-day fulfillment in Lagos and reliable nationwide courier delivery with live real-time milestone tracking for complete peace of mind.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Dedicated Tech Support</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our gadget advisors are always on hand via WhatsApp and phone to assist you with device selection, setup advice, warranty support, and delivery updates.
            </p>
          </div>
        </div>

        {/* Our Story & Commitments */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Our Promise to You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Transparent Pricing in Naira</h4>
                <p className="text-xs text-slate-600">All prices displayed include VAT with zero unexpected customs charges.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Comprehensive Warranty</h4>
                <p className="text-xs text-slate-600">Up to 12 months official warranty on smartphones, laptops, and smart wearables.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Secure Checkout</h4>
                <p className="text-xs text-slate-600">Encrypted Paystack payments supporting debit cards, bank transfers, and USSD.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-violet-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Customer First Support</h4>
                <p className="text-xs text-slate-600">Swift dispute resolution and hassle-free returns on any defective items.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4 items-center">
            <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-2.5">
              <Link href="/shop">Browse the Catalog</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl px-6 py-2.5">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </main>

      <StorefrontFooter />
      <CartDrawer />
    </div>
  );
}
