// ==============================================================================
// 3LINE GADGETS — CART DRAWER (MINI-CART) COMPONENT
// components/storefront/cart/cart-drawer.tsx
// ==============================================================================

'use client';

import React, { useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { CartItem } from './cart-item';
import { CartSummary } from './cart-summary';
import { EmptyCart } from './empty-cart';

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    isMutating,
  } = useCart();

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };

    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div id="storefront-cart-drawer-portal" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        id="cart-drawer-backdrop"
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Your Shopping Bag</h3>
                <p className="text-[11px] text-slate-400">
                  {itemCount} {itemCount === 1 ? 'gadget' : 'gadgets'} selected
                </p>
              </div>
            </div>

            <button
              type="button"
              id="close-cart-drawer-btn"
              onClick={closeCart}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <EmptyCart onBrowseClick={closeCart} compact={true} />
            ) : (
              items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  compact={true}
                  isMutating={isMutating}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))
            )}
          </div>

          {/* Bottom Summary & Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
              <CartSummary
                subtotal={subtotal}
                itemCount={itemCount}
                isMutating={isMutating}
                onCheckoutClick={closeCart}
                compact={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
