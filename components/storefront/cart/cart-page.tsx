// ==============================================================================
// 3LINE GADGETS — CART PAGE CLIENT CONTAINER
// components/storefront/cart/cart-page.tsx
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, AlertCircle } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { CartItemList } from './cart-item-list';
import { CartSummary } from './cart-summary';
import { EmptyCart } from './empty-cart';

export function CartPageContent() {
  const {
    items,
    itemCount,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    isMutating,
    error,
  } = useCart();

  return (
    <div className="min-h-[70vh] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-violet-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href="/shop" className="hover:text-violet-600 transition-colors">
            Storefront
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-900">Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review your selected gadgets before checking out with Lagos warranty coverage.
            </p>
          </div>
          {itemCount > 0 && (
            <span className="text-xs font-bold text-violet-700 bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your bag
            </span>
          )}
        </div>

        {/* Top-level error banner if an action failed */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <p>{error}</p>
          </div>
        )}

        {/* Main Content: 2-Column Grid on Desktop */}
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Cart Items (8 Cols) */}
            <div className="lg:col-span-8">
              <CartItemList
                items={items}
                isMutating={isMutating}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onClearCart={clearCart}
              />
            </div>

            {/* Right Column: Order Summary (4 Cols) */}
            <div className="lg:col-span-4">
              <CartSummary
                subtotal={subtotal}
                itemCount={itemCount}
                isMutating={isMutating}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
