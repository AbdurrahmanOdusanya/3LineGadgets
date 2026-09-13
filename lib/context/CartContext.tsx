// ==============================================================================
// 3LINE GADGETS — SHOPPING CART CONTEXT & STATE ENGINE
// lib/context/CartContext.tsx
// ==============================================================================

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from 'react';
import type { StorefrontProduct, StorefrontProductVariant } from '@/types/storefront';
import type { CartItem, CartData } from '@/types/cart';
import {
  getCartAction,
  addToCartAction,
  updateCartItemQuantityAction,
  removeCartItemAction,
  clearCartAction,
  syncGuestCartAction,
} from '@/lib/actions/cart';

export type { CartItem };

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  warnings: string[];
  hasStaleItems: boolean;
  isAuthenticated: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (
    product: StorefrontProduct,
    variant?: StorefrontProductVariant,
    quantity?: number
  ) => Promise<{ success: boolean; error?: string }>;
  removeFromCart: (itemId: string, variantId?: string) => Promise<void>;
  updateQuantity: (
    itemId: string,
    quantity: number,
    variantId?: string
  ) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = '3line_gadgets_cart_v2';
const CART_EVENT = '3line_gadgets_cart_update';

let cachedRawCart: string | null = null;
let cachedCartItems: CartItem[] = [];

function subscribeCart(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(CART_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CART_EVENT, callback);
  };
}

function getCartSnapshot(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw !== cachedRawCart) {
      cachedRawCart = raw;
      cachedCartItems = raw ? JSON.parse(raw) : [];
    }
    return cachedCartItems;
  } catch {
    return cachedCartItems;
  }
}

const SERVER_CART_SNAPSHOT: CartItem[] = [];
function getServerCartSnapshot(): CartItem[] {
  return SERVER_CART_SNAPSHOT;
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(items);
    localStorage.setItem(CART_STORAGE_KEY, serialized);
    cachedRawCart = serialized;
    cachedCartItems = items;
    window.dispatchEvent(new Event(CART_EVENT));
  } catch (e) {
    console.error('Failed to persist cart to client storage', e);
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStaleItems, setHasStaleItems] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  const clearError = useCallback(() => setError(null), []);

  // Refresh cart from backend
  const refreshCart = useCallback(async () => {
    try {
      const res = await getCartAction();
      if (res.success && res.data) {
        setIsAuthenticated(res.data.isAuthenticated);
        setHasStaleItems(res.data.hasStaleItems);

        if (res.data.isAuthenticated) {
          const localItems = getCartSnapshot();
          const guestItems = localItems.filter((i) => i.id.startsWith('guest-'));

          if (guestItems.length > 0) {
            const syncRes = await syncGuestCartAction(
              guestItems.map((i) => ({
                productId: i.productId,
                variantId: i.variantId,
                quantity: i.quantity,
              }))
            );

            if (syncRes.success && syncRes.data) {
              saveCartToStorage(syncRes.data.items);
              setHasStaleItems(syncRes.data.hasStaleItems);
              return;
            }
          }

          saveCartToStorage(res.data.items);
        }
      }
    } catch (err) {
      console.warn('Cart sync skipped or offline:', err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      try {
        const res = await getCartAction();
        if (!isMounted || !res.success || !res.data) return;

        setIsAuthenticated(res.data.isAuthenticated);
        setHasStaleItems(res.data.hasStaleItems);

        if (res.data.isAuthenticated) {
          const localItems = getCartSnapshot();
          const guestItems = localItems.filter((i) => i.id.startsWith('guest-'));

          if (guestItems.length > 0) {
            const syncRes = await syncGuestCartAction(
              guestItems.map((i) => ({
                productId: i.productId,
                variantId: i.variantId,
                quantity: i.quantity,
              }))
            );

            if (syncRes.success && syncRes.data) {
              saveCartToStorage(syncRes.data.items);
              setHasStaleItems(syncRes.data.hasStaleItems);
              return;
            }
          }

          saveCartToStorage(res.data.items);
        }
      } catch (err) {
        console.warn('Cart initialization error:', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Remove single item from cart
  const removeFromCart = useCallback(
    async (itemId: string, variantId?: string): Promise<void> => {
      setError(null);
      const currentItems = getCartSnapshot();
      const optimistic = currentItems.filter((i) => i.id !== itemId);
      saveCartToStorage(optimistic);

      setIsMutating(true);
      try {
        const result = await removeCartItemAction({
          itemId,
          variantId,
        });

        if (!result.success) {
          saveCartToStorage(currentItems);
          setError(result.error || 'Failed to remove item');
          return;
        }

        if (result.data) {
          saveCartToStorage(result.data.items);
          setHasStaleItems(result.data.hasStaleItems);
        }
      } catch (err: any) {
        saveCartToStorage(currentItems);
        setError(err?.message || 'Failed to remove item');
      } finally {
        setIsMutating(false);
      }
    },
    []
  );

  // Update item quantity
  const updateQuantity = useCallback(
    async (
      itemId: string,
      quantity: number,
      variantId?: string
    ): Promise<{ success: boolean; error?: string }> => {
      setError(null);
      const currentItems = getCartSnapshot();
      const targetItem = currentItems.find((i) => i.id === itemId);

      if (!targetItem) return { success: false, error: 'Item not found' };

      // Validate quantity bounds
      if (quantity < 1) {
        await removeFromCart(itemId, variantId);
        return { success: true };
      }

      if (targetItem.availableStock > 0 && quantity > targetItem.availableStock) {
        const errMsg = `Only ${targetItem.availableStock} units are currently available.`;
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      // Optimistic update
      const optimistic = currentItems.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      );
      saveCartToStorage(optimistic);

      setIsMutating(true);
      try {
        const result = await updateCartItemQuantityAction({
          itemId,
          quantity,
          variantId: variantId || targetItem.variantId,
        });

        if (!result.success) {
          // Revert optimistic update
          saveCartToStorage(currentItems);
          setError(result.error || 'Failed to update quantity');
          return { success: false, error: result.error };
        }

        if (result.data) {
          saveCartToStorage(result.data.items);
          setHasStaleItems(result.data.hasStaleItems);
        }

        return { success: true };
      } catch (err: any) {
        saveCartToStorage(currentItems);
        const msg = err?.message || 'Failed to update quantity';
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setIsMutating(false);
      }
    },
    [removeFromCart]
  );

  // Add Item to Cart with authoritative server-side validation
  const addToCart = useCallback(
    async (
      product: StorefrontProduct,
      variant?: StorefrontProductVariant,
      quantity: number = 1
    ): Promise<{ success: boolean; error?: string }> => {
      setError(null);
      setIsMutating(true);

      const targetVariant = variant || product.variants?.[0];
      if (!targetVariant) {
        setIsMutating(false);
        const errMsg = 'No selectable variant for this gadget';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      // Check stock limit on client before calling server
      const availableStock = Math.max(0, targetVariant.stock_quantity ?? 0);
      if (availableStock <= 0) {
        setIsMutating(false);
        const errMsg = 'This gadget is currently out of stock.';
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      const currentItems = getCartSnapshot();
      const existingItem = currentItems.find(
        (i) => i.variantId === targetVariant.id
      );

      if (existingItem && existingItem.quantity + quantity > availableStock) {
        setIsMutating(false);
        const errMsg = `Cannot add ${quantity} more. You already have ${existingItem.quantity} in your cart, and only ${availableStock} units are available.`;
        setError(errMsg);
        return { success: false, error: errMsg };
      }

      try {
        const result = await addToCartAction({
          productId: product.id,
          variantId: targetVariant.id,
          quantity,
        });

        if (!result.success) {
          setError(result.error || 'Failed to add item to cart');
          setIsMutating(false);
          return { success: false, error: result.error };
        }

        // Authenticated customer: Supabase updated and returned fresh cart
        if (result.data) {
          saveCartToStorage(result.data.items);
          setHasStaleItems(result.data.hasStaleItems);
        } else if (result.guestItem) {
          // Guest customer: store validated item
          const gItem = result.guestItem;
          let updated: CartItem[];

          if (existingItem) {
            updated = currentItems.map((i) =>
              i.variantId === targetVariant.id
                ? {
                    ...i,
                    quantity: i.quantity + quantity,
                    price: gItem.price,
                    availableStock: gItem.availableStock,
                  }
                : i
            );
          } else {
            updated = [...currentItems, gItem];
          }

          saveCartToStorage(updated);
        }

        setIsCartOpen(true);
        return { success: true };
      } catch (err: any) {
        const msg = err?.message || 'Failed to add item to cart';
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setIsMutating(false);
      }
    },
    []
  );

  // Clear entire cart
  const clearCart = useCallback(async (): Promise<void> => {
    setError(null);
    const currentItems = getCartSnapshot();
    saveCartToStorage([]);

    setIsMutating(true);
    try {
      const result = await clearCartAction();
      if (!result.success) {
        saveCartToStorage(currentItems);
        setError(result.error || 'Failed to clear cart');
        return;
      }
      if (result.data) {
        saveCartToStorage(result.data.items);
      }
    } catch (err: any) {
      saveCartToStorage(currentItems);
      setError(err?.message || 'Failed to clear cart');
    } finally {
      setIsMutating(false);
    }
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const warnings = items
    .map((i) => i.warning)
    .filter((w): w is string => Boolean(w));

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isCartOpen,
        isLoading,
        isMutating,
        error,
        warnings,
        hasStaleItems,
        isAuthenticated,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
