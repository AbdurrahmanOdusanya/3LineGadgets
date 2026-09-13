// ==============================================================================
// 3LINE GADGETS — EMPTY CART COMPONENT
// components/storefront/cart/empty-cart.tsx
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Smartphone, Laptop, Headphones, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyCartProps {
  onBrowseClick?: () => void;
  compact?: boolean;
}

export function EmptyCart({ onBrowseClick, compact = false }: EmptyCartProps) {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-xs border border-violet-100">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">Your bag is empty</h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Discover flagship smartphones, creator laptops, audio gear, and authentic gadgets.
          </p>
        </div>
        <Button
          asChild
          onClick={onBrowseClick}
          className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-5 py-2.5 h-auto rounded-xl shadow-xs"
        >
          <Link href="/shop" className="inline-flex items-center gap-2">
            <span>Browse Storefront</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      id="empty-cart-view"
      className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-3xl border border-slate-100 shadow-xs max-w-2xl mx-auto my-8"
    >
      <div className="w-20 h-20 rounded-3xl bg-violet-50/80 text-violet-600 flex items-center justify-center shadow-inner border border-violet-100/60 mb-6">
        <ShoppingBag className="w-10 h-10" />
      </div>

      <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">
        Your Cart is Currently Empty
      </h2>
      <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-8">
        You haven&apos;t added any gadgets to your bag yet. Explore our curated catalog of authentic, warranty-backed electronics ready for fast delivery across Nigeria.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <Button
          asChild
          onClick={onBrowseClick}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-7 py-3 h-12 rounded-2xl shadow-md shadow-violet-500/20"
        >
          <Link href="/shop" className="inline-flex items-center gap-2">
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="w-full border-t border-slate-100 pt-8 mt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Popular Departments
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Link
            href="/categories/smartphones-tablets"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-violet-50 hover:border-violet-200 text-xs font-semibold text-slate-700 hover:text-violet-700 transition-all"
          >
            <Smartphone className="w-3.5 h-3.5 text-violet-600" />
            <span>Smartphones</span>
          </Link>
          <Link
            href="/categories/laptops-computers"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-violet-50 hover:border-violet-200 text-xs font-semibold text-slate-700 hover:text-violet-700 transition-all"
          >
            <Laptop className="w-3.5 h-3.5 text-violet-600" />
            <span>Mac &amp; PC</span>
          </Link>
          <Link
            href="/categories/audio-sound"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-violet-50 hover:border-violet-200 text-xs font-semibold text-slate-700 hover:text-violet-700 transition-all"
          >
            <Headphones className="w-3.5 h-3.5 text-violet-600" />
            <span>Audio &amp; ANC</span>
          </Link>
          <Link
            href="/categories/power-accessories"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-violet-50 hover:border-violet-200 text-xs font-semibold text-slate-700 hover:text-violet-700 transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-violet-600" />
            <span>Power Gear</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
