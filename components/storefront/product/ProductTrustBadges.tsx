// ==============================================================================
// 3LINE GADGETS — PRODUCT TRUST & SERVICE BADGES
// components/storefront/product/ProductTrustBadges.tsx
// ==============================================================================

import React from 'react';
import { ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';

export function ProductTrustBadges() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: 'Genuine Tech Guaranteed',
      description: '100% authentic brand-direct hardware with factory serials.',
    },
    {
      icon: Truck,
      title: 'Tracked Delivery',
      description: 'Reliable dispatch across Lagos and all 36 Nigerian states.',
    },
    {
      icon: RotateCcw,
      title: 'Inspection Guarantee',
      description: 'Eligible for return if defective upon initial unboxing inspection.',
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      description: 'Direct WhatsApp and email assistance for setup and troubleshooting.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
      {benefits.map((b, i) => {
        const Icon = b.icon;
        return (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100"
          >
            <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                {b.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
