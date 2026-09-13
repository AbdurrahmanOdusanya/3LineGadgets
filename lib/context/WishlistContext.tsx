// ==============================================================================
// 3LINE GADGETS — WISHLIST CONTEXT
// lib/context/WishlistContext.tsx
// ==============================================================================

'use client';

import React, { createContext, useContext, useSyncExternalStore, useCallback } from 'react';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string, productName?: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = '3line_gadgets_wishlist_v1';
const WISHLIST_EVENT = '3line_gadgets_wishlist_change';

let cachedRawWishlist: string | null = null;
let cachedWishlistIds: string[] = [];

function subscribeWishlist(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(WISHLIST_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(WISHLIST_EVENT, callback);
  };
}

function getWishlistSnapshot(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (raw !== cachedRawWishlist) {
      cachedRawWishlist = raw;
      cachedWishlistIds = raw ? JSON.parse(raw) : [];
    }
    return cachedWishlistIds;
  } catch {
    return cachedWishlistIds;
  }
}

const SERVER_WISHLIST_SNAPSHOT: string[] = [];
function getServerWishlistSnapshot(): string[] {
  return SERVER_WISHLIST_SNAPSHOT;
}

function saveWishlistToStorage(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(ids);
    localStorage.setItem(WISHLIST_STORAGE_KEY, serialized);
    cachedRawWishlist = serialized;
    cachedWishlistIds = ids;
    window.dispatchEvent(new Event(WISHLIST_EVENT));
  } catch (e) {
    console.error('Failed to save wishlist:', e);
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const wishlistIds = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getServerWishlistSnapshot
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistIds.includes(productId);
    },
    [wishlistIds]
  );

  const toggleWishlist = useCallback((productId: string) => {
    const current = getWishlistSnapshot();
    let added = false;
    let next: string[];
    if (current.includes(productId)) {
      added = false;
      next = current.filter((id) => id !== productId);
    } else {
      added = true;
      next = [...current, productId];
    }
    saveWishlistToStorage(next);
    return added;
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    return {
      wishlistIds: [],
      isInWishlist: () => false,
      toggleWishlist: () => false,
      wishlistCount: 0,
    };
  }
  return context;
}

