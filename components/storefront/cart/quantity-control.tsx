// ==============================================================================
// 3LINE GADGETS — CART QUANTITY CONTROL COMPONENT
// components/storefront/cart/quantity-control.tsx
// ==============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { Minus, Plus, Loader2 } from 'lucide-react';

interface QuantityControlProps {
  id?: string;
  quantity: number;
  maxStock: number;
  minQuantity?: number;
  isLoading?: boolean;
  disabled?: boolean;
  onQuantityChange: (newQuantity: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function QuantityControl({
  id,
  quantity,
  maxStock,
  minQuantity = 1,
  isLoading = false,
  disabled = false,
  onQuantityChange,
  size = 'md',
}: QuantityControlProps) {
  const [prevQuantity, setPrevQuantity] = useState<number>(quantity);
  const [localValue, setLocalValue] = useState<string>(String(quantity));

  if (prevQuantity !== quantity) {
    setPrevQuantity(quantity);
    setLocalValue(String(quantity));
  }

  const canDecrease = quantity > minQuantity && !disabled && !isLoading;
  const canIncrease = quantity < maxStock && !disabled && !isLoading;

  const handleDecrease = () => {
    if (canDecrease) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (canIncrease) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(localValue, 10);
    if (isNaN(parsed) || parsed < minQuantity) {
      setLocalValue(String(minQuantity));
      onQuantityChange(minQuantity);
    } else if (parsed > maxStock) {
      setLocalValue(String(maxStock));
      onQuantityChange(maxStock);
    } else if (parsed !== quantity) {
      onQuantityChange(parsed);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setLocalValue(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  const sizeStyles = {
    sm: {
      container: 'h-8 px-1',
      btn: 'w-6 h-6 text-xs',
      input: 'w-8 text-xs',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'h-9 px-1.5',
      btn: 'w-7 h-7 text-sm',
      input: 'w-10 text-sm',
      icon: 'w-3.5 h-3.5',
    },
    lg: {
      container: 'h-11 px-2',
      btn: 'w-8 h-8 text-base',
      input: 'w-12 text-base',
      icon: 'w-4 h-4',
    },
  }[size];

  return (
    <div className="flex flex-col items-start gap-1">
      <div
        id={id}
        className={`inline-flex items-center rounded-xl border border-slate-200 bg-slate-50/80 shadow-xs transition-colors focus-within:border-violet-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-500/20 ${sizeStyles.container} ${
          disabled ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <button
          type="button"
          id={id ? `${id}-decrease` : undefined}
          onClick={handleDecrease}
          disabled={!canDecrease}
          aria-label="Decrease quantity"
          className={`flex items-center justify-center rounded-lg text-slate-600 transition-all hover:bg-white hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent ${sizeStyles.btn}`}
        >
          <Minus className={sizeStyles.icon} />
        </button>

        <div className="relative flex items-center justify-center">
          {isLoading ? (
            <div className={`flex items-center justify-center ${sizeStyles.input}`}>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-600" />
            </div>
          ) : (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={localValue}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              disabled={disabled || isLoading}
              aria-label="Item quantity"
              className={`bg-transparent text-center font-bold text-slate-900 focus:outline-hidden ${sizeStyles.input}`}
            />
          )}
        </div>

        <button
          type="button"
          id={id ? `${id}-increase` : undefined}
          onClick={handleIncrease}
          disabled={!canIncrease}
          aria-label="Increase quantity"
          className={`flex items-center justify-center rounded-lg text-slate-600 transition-all hover:bg-white hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent ${sizeStyles.btn}`}
        >
          <Plus className={sizeStyles.icon} />
        </button>
      </div>

      {quantity >= maxStock && maxStock > 0 && (
        <span className="text-[10px] font-medium text-amber-600">
          Max available ({maxStock})
        </span>
      )}
    </div>
  );
}
