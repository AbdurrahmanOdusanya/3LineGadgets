// ==============================================================================
// 3LINE GADGETS — CART ICON BADGE COMPONENT
// components/storefront/cart/cart-badge.tsx
// ==============================================================================

'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

interface CartBadgeProps {
  id?: string;
  className?: string;
  onClick?: () => void;
  showText?: boolean;
}

export function CartBadge({
  id = 'storefront-cart-button',
  className = '',
  onClick,
  showText = false,
}: CartBadgeProps) {
  const { itemCount, openCart } = useCart();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      openCart();
    }
  };

  return (
    <button
      type="button"
      id={id}
      onClick={handleClick}
      aria-label={`Shopping Cart with ${itemCount} items`}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl text-slate-700 hover:text-violet-600 hover:bg-violet-50/80 transition-colors focus:outline-hidden focus:ring-2 focus:ring-violet-500/20 ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-105" />
        {itemCount > 0 && (
          <span
            id="cart-badge-count"
            className="absolute -top-1.5 -right-2 min-w-5 h-5 px-1 rounded-full bg-violet-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs border-2 border-white animate-in zoom-in-75 duration-150"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-slate-700 hover:text-violet-600 hidden sm:inline">
          Cart
        </span>
      )}
    </button>
  );
}
