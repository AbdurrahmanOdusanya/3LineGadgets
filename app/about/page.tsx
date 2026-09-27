// ==============================================================================
// 3LINE GADGETS — ABOUT US PAGE
// app/about/page.tsx
// ==============================================================================

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentProfile } from '@/lib/auth/session';
import { StorefrontNavbar } from '@/components/storefront/StorefrontNavbar';
import { StorefrontFooter } from '@/components/storefront/StorefrontFooter';
import { CartDrawer } from '@/components/storefront/CartDrawer';
import { ChevronRight, ShieldCheck, Truck, Headphones, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us — 3Line Gadgets',
  description:
    'Learn about 3Line Gadgets, Nigeria’s premier hub for genuine imported tech, Apple devices, laptops, and audio gear.',
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

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-violet-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">About Us</span>
        </nav>

        {/* Hero Banner with Purple Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 text-white p-8 sm:p-12 lg:p-14 shadow-lg">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15] font-montserrat">
                Powering Nigeria’s Passion for Original Technology
              </h1>
              <p className="text-violet-100 text-sm sm:text-base leading-relaxed max-w-xl font-manrope">
                At 3Line Gadgets, we bridge the gap between world-class international hardware and Nigerian tech enthusiasts. Every smartphone, laptop, and audio accessory is factory sealed and backed by dedicated local support.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3.5 font-manrope">
                <Button
                  asChild
                  className="bg-white hover:bg-slate-100 text-violet-900 font-bold px-6 py-3 h-11 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <Link href="/shop" className="inline-flex items-center gap-2">
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white px-6 py-3 h-11 rounded-xl backdrop-blur-xs font-semibold"
                >
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                <div className="absolute inset-4 rounded-full bg-white/10 blur-xl" />
                <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-violet-900/40">
                  <Image
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
                    alt="3Line Gadgets Team & Technology"
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    priority
                  />
                </div>
              </div>
            </div>
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
            <h3 className="font-bold text-slate-900 text-base">Rapid Dispatch &amp; Tracking</h3>
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
            <Button asChild variant="outline" className="rounded-xl px-6 py-2.5 border-slate-200 text-slate-700 hover:bg-slate-50">
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
