// ==============================================================================
// 3LINE GADGETS — STOREFRONT HERO BANNER
// components/storefront/HeroBanner.tsx
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  onExploreClick?: () => void;
}

export function HeroBanner({ onExploreClick }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-100/70 via-purple-50/50 to-pink-50/40 border border-violet-200/60 p-6 sm:p-10 lg:p-14 shadow-xs">
      {/* Soft background aura circles */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Text Column */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          {/* Large Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15] font-montserrat">
            Next-Gen Flagship Gadgets,{' '}
            <span className="text-violet-600">Built for Peak</span> Performance
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-manrope">
            Discover authentic Apple iPhones, M-series MacBooks, Samsung Galaxy flagships, and studio-grade noise canceling audio. Factory sealed with official Lagos hardware warranty.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2 font-manrope">
            <Button
              asChild
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 h-11 rounded-xl shadow-md shadow-violet-500/25 flex items-center gap-2 font-manrope"
            >
              <Link href="/shop">
                <span>Shop Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="bg-white hover:bg-slate-50 text-slate-800 border-slate-200 font-semibold px-5 py-3 h-11 rounded-xl font-manrope"
            >
              <Link href="/categories">
                <span>Browse Categories</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Hero Gadget Visual */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
            {/* Violet Circle Backdrop */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-violet-200/50 to-purple-100/60 blur-md" />

            {/* Featured Product Image */}
            <div className="relative z-10 w-4/5 h-4/5">
              <Image
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
                alt="Sony WH-1000XM5 Studio Headphones"
                fill
                sizes="(max-width: 1024px) 70vw, 40vw"
                referrerPolicy="no-referrer"
                className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
