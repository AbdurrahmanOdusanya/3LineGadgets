// ==============================================================================
// 3LINE GADGETS — CART ITEM LIST COMPONENT
// components/storefront/cart/cart-item-list.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, AlertCircle, ArrowLeft } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types/cart';
import { CartItem } from './cart-item';
import { Button } from '@/components/ui/button';

interface CartItemListProps {
  items: CartItemType[];
  isMutating?: boolean;
  onUpdateQuantity: (itemId: string, quantity: number, variantId?: string) => void;
  onRemove: (itemId: string, variantId?: string) => void;
  onClearCart: () => void;
}

export function CartItemList({
  items,
  isMutating = false,
  onUpdateQuantity,
  onRemove,
  onClearCart,
}: CartItemListProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  const staleItems = items.filter((i) => i.isStale || i.outOfStock || i.priceChanged);

  return (
    <div id="cart-item-list" className="space-y-4">
      {/* Stale / Availability Banner if needed */}
      {staleItems.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Inventory Notice</p>
            <p className="text-amber-700">
              Some items in your cart have experienced stock or price updates. Please review before proceeding.
            </p>
          </div>
        </div>
      )}

      {/* Cart Items Header & Bulk Actions */}
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Items in Bag ({items.reduce((acc, curr) => acc + curr.quantity, 0)})
        </h2>

        {items.length > 0 && (
          <div>
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Clear all items?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClearCart();
                    setConfirmClear(false);
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                >
                  Yes, clear
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="clear-cart-button"
                onClick={() => setConfirmClear(true)}
                disabled={isMutating}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Cart</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* List of Cart Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            isMutating={isMutating}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>

      {/* Continue Shopping Link */}
      <div className="pt-4">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}
