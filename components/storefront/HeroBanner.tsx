// ==============================================================================
// 3LINE GADGETS — STOREFRONT HERO BANNER
// components/storefront/HeroBanner.tsx
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface HeroBannerProps {
  onExploreClick?: () => void;
}

export function HeroBanner({ onExploreClick }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-100/70 via-purple-50/50 to-pink-50/40 border border-violet-200/60 p-6 sm:p-8 md:p-8 lg:p-12 shadow-xs h-auto md:min-h-[420px] lg:min-h-[500px] flex flex-col md:flex-row md:items-center">
      {/* Soft background aura circles */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Layout (Mobile: vertical flex-col | Tablet & Desktop: horizontal row) */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 lg:gap-12 w-full">
        {/* Text Column */}
        <div className="w-full md:w-[58%] lg:w-[54%] xl:w-[50%] space-y-4 sm:space-y-5 lg:space-y-6 relative z-10 text-left">
          {/* Large Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.15] font-montserrat">
            Next-Gen Flagship Gadgets,{' '}
            <span className="text-violet-600">Built for Peak</span> Performance
          </h1>

          {/* Subheading */}
          <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed max-w-xl font-manrope">
            Discover authentic Apple iPhones, M-series MacBooks, Samsung Galaxy flagships, and studio-grade noise canceling audio. Factory sealed with official Lagos hardware warranty.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1 sm:pt-2 font-manrope">
            <Button
              asChild
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 sm:px-6 sm:py-3 h-10 sm:h-11 rounded-xl shadow-md shadow-violet-500/25 flex items-center justify-center font-manrope"
            >
              <Link href="/shop">
                <span>Shop Now</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* TABLET STATE (768px – 1023px, md:flex lg:hidden)                   */}
        {/* Text on LEFT, Right-aligned iPhone extending below bottom & cropped */}
        {/* ------------------------------------------------------------------ */}
        <div className="hidden md:flex lg:hidden items-end justify-end md:w-[42%] relative z-10 self-end -mb-12 md:-mb-16">
          <div className="relative w-[clamp(190px,27vw,250px)] aspect-[474/775] drop-shadow-2xl mr-2">
            <Image
              src="/assets/images/hero-orange-iphone.png"
              alt="Flagship Smartphone in Cosmic Orange"
              fill
              sizes="(min-width: 768px) and (max-width: 1023px) 250px"
              priority
              referrerPolicy="no-referrer"
              className="object-contain object-top"
            />
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* MOBILE STATE (< 768px, block md:hidden)                           */}
        {/* Vertically below CTA, Centered, extending below bottom & cropped   */}
        {/* ------------------------------------------------------------------ */}
        <div className="w-full flex justify-center items-end mt-6 sm:mt-8 md:hidden relative z-10 -mb-12 sm:-mb-16">
          <div className="relative w-[min(70vw,240px)] sm:w-[min(60vw,260px)] aspect-[474/775] drop-shadow-xl">
            <Image
              src="/assets/images/hero-orange-iphone.png"
              alt="Flagship Smartphone in Cosmic Orange"
              fill
              sizes="(max-width: 767px) 260px"
              priority
              referrerPolicy="no-referrer"
              className="object-contain object-top"
            />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* DESKTOP STATE (≥ 1024px, hidden lg:block)                           */}
      {/* Exact current desktop version preserved, large right-aligned phone */}
      {/* ------------------------------------------------------------------ */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <Image
          src="/assets/images/hero-section.png"
          alt="Flagship Smartphone in Cosmic Orange"
          fill
          sizes="(min-width: 1024px) 100vw"
          priority
          referrerPolicy="no-referrer"
          className="object-contain object-right-bottom drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
