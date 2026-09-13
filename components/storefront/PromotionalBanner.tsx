// ==============================================================================
// 3LINE GADGETS — PROMOTIONAL SPECIAL OFFER BANNER
// components/storefront/PromotionalBanner.tsx
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PromotionalBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 16,
    hours: 10,
    minutes: 56,
    seconds: 54,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-100/90 via-purple-100/60 to-violet-50/90 border border-violet-200/70 p-6 sm:p-10 lg:p-12 shadow-xs">
      {/* Background glowing shapes */}
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-violet-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Info Column */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Enhance Your Music &amp; Work Experience
          </h2>

          <p className="text-sm text-slate-600 max-w-lg leading-relaxed">
            Upgrade your daily setup with authentic Sony WH-1000XM5 studio headphones and Apple AirPods Pro 2. Featuring active noise cancellation and deep spatial audio.
          </p>

          {/* Countdown Timer */}
          <div className="pt-1 flex items-center gap-2.5 sm:gap-4">
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-white border border-violet-200/80 shadow-xs flex flex-col items-center justify-center">
              <span className="text-base sm:text-xl font-black text-slate-900 leading-none">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">Days</span>
            </div>

            <span className="text-violet-400 font-bold text-lg">:</span>

            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-white border border-violet-200/80 shadow-xs flex flex-col items-center justify-center">
              <span className="text-base sm:text-xl font-black text-slate-900 leading-none">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">Hours</span>
            </div>

            <span className="text-violet-400 font-bold text-lg">:</span>

            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-white border border-violet-200/80 shadow-xs flex flex-col items-center justify-center">
              <span className="text-base sm:text-xl font-black text-slate-900 leading-none">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">Mins</span>
            </div>

            <span className="text-violet-400 font-bold text-lg">:</span>

            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-white border border-violet-200/80 shadow-xs flex flex-col items-center justify-center">
              <span className="text-base sm:text-xl font-black text-violet-600 leading-none">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">Secs</span>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Button
              asChild
              className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 h-11 rounded-xl shadow-md shadow-violet-500/25 flex items-center gap-2 inline-flex"
            >
              <Link href="/shop?deals=true">
                <span>Check It Out</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Gadget Visual */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
            {/* Subtle radial backdrop */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-violet-300/40 to-purple-200/30 blur-lg" />

            <div className="relative z-10 w-4/5 h-4/5">
              <Image
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80"
                alt="Premium Headphones Special Deal"
                fill
                sizes="(max-width: 1024px) 60vw, 35vw"
                referrerPolicy="no-referrer"
                className="object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
