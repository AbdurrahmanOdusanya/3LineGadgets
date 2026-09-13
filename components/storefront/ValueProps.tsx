// ==============================================================================
// 3LINE GADGETS — STOREFRONT VALUE PROPS (TRUST BADGES)
// components/storefront/ValueProps.tsx
// ==============================================================================

'use client';

import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export function ValueProps() {
  const perks = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over ₦150,000 across Nigeria',
    },
    {
      icon: RotateCcw,
      title: '7-Day Return Policy',
      description: 'Hassle-free money back guarantee',
    },
    {
      icon: ShieldCheck,
      title: '1-Year Warranty',
      description: '100% authentic Lagos direct import',
    },
    {
      icon: Headphones,
      title: '24/7 Dedicated Support',
      description: 'Friendly customer assistance anytime',
    },
  ];

  return (
    <section className="rounded-2xl bg-white border border-slate-100 p-6 sm:p-8 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {perks.map((perk, idx) => {
          const Icon = perk.icon;
          return (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {perk.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {perk.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
