// ==============================================================================
// 3LINE GADGETS — PRODUCT PRICE COMPONENT
// components/storefront/product/ProductPrice.tsx
// ==============================================================================

import React from 'react';
import { formatNaira } from '@/lib/utils';

interface ProductPriceProps {
  price: number;
  compareAtPrice?: number | null;
}

export function ProductPrice({ price }: ProductPriceProps) {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      <div className="flex items-baseline flex-wrap gap-3">
        {/* Main Current Price */}
        <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {formatNaira(price)}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 font-normal">
        Inclusive of all standard duties and VAT. Nationwide tracked courier available.
      </p>
    </div>
  );
}
