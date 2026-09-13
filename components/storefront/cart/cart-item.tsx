// ==============================================================================
// 3LINE GADGETS — CART ITEM COMPONENT
// components/storefront/cart/cart-item.tsx
// ==============================================================================

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, AlertTriangle, Info } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types/cart';
import { formatNaira } from '@/lib/utils';
import { QuantityControl } from './quantity-control';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number, variantId?: string) => void;
  onRemove: (itemId: string, variantId?: string) => void;
  isMutating?: boolean;
  compact?: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isMutating = false,
  compact = false,
}: CartItemProps) {
  const itemTotal = item.price * item.quantity;
  const productHref = item.slug ? `/products/${item.slug}` : '/shop';

  if (compact) {
    return (
      <div
        id={`drawer-cart-item-${item.id}`}
        className="group relative flex gap-3.5 py-4 border-b border-slate-100 last:border-0 items-start"
      >
        {/* Thumbnail Image */}
        <Link
          href={productHref}
          className="relative w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 shrink-0 overflow-hidden hover:border-violet-200 transition-colors"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="64px"
            referrerPolicy="no-referrer"
            className="object-contain p-1"
          />
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={productHref}
              className="text-xs font-bold text-slate-900 truncate hover:text-violet-600 transition-colors leading-snug"
            >
              {item.name}
            </Link>
            <button
              type="button"
              onClick={() => onRemove(item.id, item.variantId)}
              disabled={isMutating}
              aria-label={`Remove ${item.name} from cart`}
              className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 rounded-sm focus:outline-hidden focus:ring-1 focus:ring-rose-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {item.variantName && (
            <p className="text-[11px] text-slate-500 font-medium truncate">
              {item.variantName}
            </p>
          )}

          {item.warning && (
            <div className="flex items-center gap-1 text-[10px] text-amber-600 font-medium pt-0.5">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span className="truncate">{item.warning}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1.5">
            <QuantityControl
              id={`drawer-qty-${item.id}`}
              quantity={item.quantity}
              maxStock={item.availableStock > 0 ? item.availableStock : 100}
              size="sm"
              disabled={isMutating || item.outOfStock}
              onQuantityChange={(newQty) =>
                onUpdateQuantity(item.id, newQty, item.variantId)
              }
            />

            <div className="text-right">
              <p className="text-xs font-black text-slate-900">
                {formatNaira(itemTotal)}
              </p>
              {item.quantity > 1 && (
                <p className="text-[10px] text-slate-400">
                  {formatNaira(item.price)} each
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Cart Page layout
  return (
    <div
      id={`cart-item-${item.id}`}
      className={`relative p-5 sm:p-6 rounded-2xl bg-white border transition-all ${
        item.outOfStock || item.isStale
          ? 'border-amber-200 bg-amber-50/20'
          : 'border-slate-100 hover:border-slate-200 shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between">
        {/* Left: Thumbnail & Details */}
        <div className="flex gap-4 sm:gap-5 items-start sm:items-center min-w-0 flex-1">
          {/* Product Image */}
          <Link
            href={productHref}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-center p-2 shrink-0 overflow-hidden group/img hover:border-violet-300 transition-colors"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 80px, 96px"
              referrerPolicy="no-referrer"
              className="object-contain p-1.5 transition-transform duration-300 group-hover/img:scale-105"
            />
          </Link>

          {/* Product & Variant info */}
          <div className="space-y-1.5 min-w-0 flex-1">
            <Link
              href={productHref}
              className="text-sm sm:text-base font-bold text-slate-900 hover:text-violet-600 transition-colors line-clamp-1"
            >
              {item.name}
            </Link>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {item.variantName && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                  {item.variantName}
                </span>
              )}
              {item.sku && (
                <span className="text-slate-400 font-mono text-[11px]">
                  SKU: {item.sku}
                </span>
              )}
            </div>

            {/* Price unit display */}
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-xs sm:text-sm font-semibold text-slate-900">
                {formatNaira(item.price)}
              </span>
              {item.compareAtPrice && item.compareAtPrice > item.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatNaira(item.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Warnings if stale or stock issue */}
            {item.warning && (
              <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 mt-1 max-w-fit">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{item.warning}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quantity, Item Total, Remove button */}
        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {/* Quantity Selector */}
          <div className="flex flex-col items-start sm:items-center">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 hidden sm:block">
              Quantity
            </span>
            <QuantityControl
              id={`page-qty-${item.id}`}
              quantity={item.quantity}
              maxStock={item.availableStock > 0 ? item.availableStock : 100}
              size="md"
              disabled={isMutating || item.outOfStock}
              onQuantityChange={(newQty) =>
                onUpdateQuantity(item.id, newQty, item.variantId)
              }
            />
          </div>

          {/* Item Total */}
          <div className="text-right min-w-[100px]">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 hidden sm:block">
              Total
            </span>
            <p className="text-base sm:text-lg font-black text-slate-900">
              {formatNaira(itemTotal)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            id={`remove-item-${item.id}`}
            onClick={() => onRemove(item.id, item.variantId)}
            disabled={isMutating}
            aria-label={`Remove ${item.name} from cart`}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
