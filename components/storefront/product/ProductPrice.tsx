// ==============================================================================
// 3LINE GADGETS — PRODUCT PRICE COMPONENT
// components/storefront/product/ProductPrice.tsx
// ==============================================================================

import React from 'react';
import { formatNaira } from '@/lib/utils';
import { Tag } from 'lucide-react';

interface ProductPriceProps {
  price: number;
  compareAtPrice?: number | null;
}

export function ProductPrice({ price, compareAtPrice }: ProductPriceProps) {
  const hasDiscount = Boolean(
    compareAtPrice && compareAtPrice > price
  );

  const discountPercent = hasDiscount
    ? Math.round((((compareAtPrice ?? 0) - price) / (compareAtPrice ?? 1)) * 100)
    : 0;

  const savingsAmount = hasDiscount ? (compareAtPrice ?? 0) - price : 0;

  return (
    <div className="flex flex-col gap-1.5 py-1">
      <div className="flex items-baseline flex-wrap gap-3">
        {/* Main Current Price */}
        <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {formatNaira(price)}
        </span>

        {/* Compare At Price (Strikethrough) */}
        {hasDiscount && compareAtPrice && (
          <span className="text-lg sm:text-xl font-medium text-slate-400 line-through">
            {formatNaira(compareAtPrice)}
          </span>
        )}

        {/* Discount Badge */}
        {hasDiscount && discountPercent > 0 && (
          <span className="inline-flex items-center gap-1 bg-rose-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
            <Tag className="w-3 h-3" />
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Savings Callout */}
      {hasDiscount && savingsAmount > 0 && (
        <p className="text-xs font-medium text-emerald-600">
          You save <span className="font-bold">{formatNaira(savingsAmount)}</span> on this item
        </p>
      )}

      <p className="text-[11px] text-slate-400 font-normal">
        Inclusive of all standard duties and VAT. Nationwide tracked courier available.
      </p>
    </div>
  );
}
