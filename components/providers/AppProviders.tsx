// ==============================================================================
// 3LINE GADGETS — APPLICATION CLIENT PROVIDERS
// components/providers/AppProviders.tsx
// ==============================================================================

'use client';

import React from 'react';
import { CartProvider } from '@/lib/context/CartContext';
import { WishlistProvider } from '@/lib/context/WishlistContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WishlistProvider>
      <CartProvider>{children}</CartProvider>
    </WishlistProvider>
  );
}
