// ==============================================================================
// 3LINE GADGETS — CART SUMMARY COMPONENT
// components/storefront/cart/cart-summary.tsx
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatNaira } from '@/lib/utils';

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  isMutating?: boolean;
  onCheckoutClick?: () => void;
  compact?: boolean;
}

export function CartSummary({
  subtotal,
  itemCount,
  isMutating = false,
  onCheckoutClick,
  compact = false,
}: CartSummaryProps) {
  const total = subtotal; // No fake taxes or invented shipping charges

  if (compact) {
    return (
      <div id="drawer-cart-summary" className="space-y-3 pt-3">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span className="font-semibold text-slate-900">{formatNaira(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Shipping</span>
            <span className="text-slate-400 font-medium">Calculated at checkout</span>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900">Total</span>
            <span className="text-base font-black text-violet-700">{formatNaira(total)}</span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <Button
            asChild
            id="drawer-proceed-checkout-btn"
            disabled={isMutating || itemCount === 0}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 h-11 rounded-xl shadow-md shadow-violet-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Link href="/checkout" onClick={onCheckoutClick}>
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            id="drawer-view-cart-btn"
            className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 h-10 rounded-xl text-xs"
          >
            <Link href="/cart" onClick={onCheckoutClick}>
              View Full Cart
            </Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Authentic Gadgets
          </span>
          <span className="flex items-center gap-1">
            <Truck className="w-3 h-3 text-violet-600" /> Nationwide Delivery
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="cart-order-summary-card"
      className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-100 shadow-xs space-y-6 sticky top-24"
    >
      <h3 className="text-lg font-black tracking-tight text-slate-900 border-b border-slate-100 pb-4">
        Order Summary
      </h3>

      <div className="space-y-3.5 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-bold text-slate-900">{formatNaira(subtotal)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Estimated Shipping</span>
          <span className="text-slate-400 font-medium text-xs sm:text-sm">
            Calculated at checkout
          </span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Estimated Tax</span>
          <span className="text-slate-400 font-medium text-xs sm:text-sm">
            Calculated at checkout
          </span>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-between items-baseline">
          <div>
            <span className="text-base font-black text-slate-900">Total</span>
            <p className="text-[11px] text-slate-400">Excludes shipping &amp; delivery</p>
          </div>
          <span className="text-2xl font-black text-violet-700 tracking-tight">
            {formatNaira(total)}
          </span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Button
          asChild
          id="cart-proceed-checkout-btn"
          disabled={isMutating || itemCount === 0}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 h-13 rounded-2xl shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 text-base transition-all hover:shadow-violet-500/30 cursor-pointer"
        >
          <Link href="/checkout" onClick={onCheckoutClick}>
            <Lock className="w-4 h-4" />
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>

        <p className="text-center text-[11px] text-slate-400 leading-relaxed">
          Taxes and delivery fees calculated during checkout based on your delivery address in Nigeria.
        </p>
      </div>

      {/* Trust Badges */}
      <div className="pt-4 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>100% Guaranteed Authentic Hardware with Official Lagos Warranty</span>
        </div>
        <div className="flex items-center gap-2.5 text-xs text-slate-600">
          <Truck className="w-4 h-4 text-violet-600 shrink-0" />
          <span>Express Delivery in Lagos • Secure Nationwide Shipping</span>
        </div>
      </div>
    </div>
  );
}
