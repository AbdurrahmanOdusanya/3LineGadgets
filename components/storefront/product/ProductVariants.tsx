// ==============================================================================
// 3LINE GADGETS — PRODUCT VARIANT SELECTOR
// components/storefront/product/ProductVariants.tsx
// ==============================================================================

import React from 'react';
import type { StorefrontProductVariant } from '@/types/storefront';
import { Check } from 'lucide-react';
import { formatNaira } from '@/lib/utils';

interface ProductVariantsProps {
  variants: StorefrontProductVariant[];
  selectedVariantId: string;
  onSelectVariant: (variant: StorefrontProductVariant) => void;
}

export function ProductVariants({
  variants,
  selectedVariantId,
  onSelectVariant,
}: ProductVariantsProps) {
  const activeVariants = variants.filter((v) => v.is_active);

  // If 0 or 1 active variant, no need for selector
  if (activeVariants.length <= 1) {
    return null;
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-900 uppercase tracking-wider">
          Select Option / Configuration
        </span>
        <span className="text-slate-400">
          {activeVariants.length} options available
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {activeVariants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isOutOfStock = variant.stock_quantity <= 0;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelectVariant(variant)}
              aria-pressed={isSelected}
              className={`relative px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border text-left cursor-pointer ${
                isSelected
                  ? 'bg-violet-50/80 border-violet-600 text-violet-950 ring-1 ring-violet-600 shadow-xs'
                  : isOutOfStock
                  ? 'bg-slate-50/60 border-slate-200 text-slate-400 hover:border-slate-300'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              {isSelected && (
                <div className="w-4 h-4 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}

              <div className="flex flex-col">
                <span className={isSelected ? 'font-bold' : 'font-medium'}>
                  {variant.name}
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {formatNaira(variant.price)}
                  {isOutOfStock ? ' • Out of Stock' : ''}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
