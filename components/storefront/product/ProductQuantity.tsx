// ==============================================================================
// 3LINE GADGETS — PRODUCT QUANTITY SELECTOR
// components/storefront/product/ProductQuantity.tsx
// ==============================================================================

import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface ProductQuantityProps {
  quantity: number;
  maxStock: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}

export function ProductQuantity({
  quantity,
  maxStock,
  onChange,
  disabled = false,
}: ProductQuantityProps) {
  const effectiveMax = Math.max(1, maxStock);
  const canDecrement = quantity > 1 && !disabled;
  const canIncrement = quantity < effectiveMax && !disabled;

  const handleDecrement = () => {
    if (canDecrement) {
      onChange(Math.max(1, quantity - 1));
    }
  };

  const handleIncrement = () => {
    if (canIncrement) {
      onChange(Math.min(effectiveMax, quantity + 1));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      onChange(1);
    } else {
      const clamped = Math.max(1, Math.min(effectiveMax, val));
      onChange(clamped);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
        Quantity:
      </span>

      <div className="flex items-center rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden h-11">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={!canDecrement}
          aria-label="Decrease quantity"
          className="w-11 h-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>

        <input
          type="number"
          min="1"
          max={effectiveMax}
          value={quantity}
          onChange={handleInputChange}
          disabled={disabled}
          aria-label="Product quantity"
          className="w-12 h-full text-center font-bold text-slate-900 text-sm focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />

        <button
          type="button"
          onClick={handleIncrement}
          disabled={!canIncrement}
          aria-label="Increase quantity"
          className="w-11 h-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {maxStock <= 5 && maxStock > 0 && (
        <span className="text-xs text-amber-600 font-medium">
          Only {maxStock} available
        </span>
      )}
    </div>
  );
}
