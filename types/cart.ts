// ==============================================================================
// 3LINE GADGETS — SHOPPING CART DATA TYPES & INTERFACES
// types/cart.ts
// ==============================================================================

export interface CartItem {
  id: string; // Database cart_items.id or client guest key
  cartId?: string | null;
  productId: string;
  variantId: string;
  name: string;
  slug?: string;
  variantName: string;
  sku: string;
  price: number; // Unit price (stored unit_price)
  originalPrice?: number; // Real-time current variant price from DB
  compareAtPrice?: number | null;
  image: string;
  quantity: number;
  availableStock: number;
  isActive: boolean;
  isStale?: boolean;
  priceChanged?: boolean;
  outOfStock?: boolean;
  warning?: string;
}

export interface CartData {
  id: string | null;
  userId: string | null;
  status: 'active' | 'converted' | 'abandoned';
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hasStaleItems: boolean;
  isAuthenticated: boolean;
}

export interface AddToCartInput {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  itemId: string;
  quantity: number;
  variantId?: string;
}

export interface RemoveCartItemInput {
  itemId: string;
  variantId?: string;
}

export interface CartActionResult<T = any> {
  success: boolean;
  error?: string;
  data?: T;
  cart?: CartData;
  guestItem?: CartItem;
  requiresAuth?: boolean;
}
