// ==============================================================================
// 3LINE GADGETS — SHOPPING CART SERVER ACTIONS & DATA SERVICE
// lib/actions/cart.ts
// ==============================================================================

'use server';

import { createClient } from '@/lib/supabase/server';
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
  syncGuestCartSchema,
} from '@/lib/validations/cart';
import type {
  CartData,
  CartItem,
  CartActionResult,
} from '@/types/cart';
import { formatErrorMessage } from '@/lib/utils/errors';

/**
 * Helper to fetch a product's primary or variant-specific image
 */
function resolveItemImage(
  images: Array<{ image_url: string; is_primary?: boolean; variant_id?: string | null }> | null | undefined,
  variantId?: string
): string {
  const fallback =
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80';

  if (!images || images.length === 0) return fallback;

  // 1. Variant-specific image
  if (variantId) {
    const variantImg = images.find((img) => img.variant_id === variantId);
    if (variantImg?.image_url) return variantImg.image_url;
  }

  // 2. Primary product image
  const primaryImg = images.find((img) => img.is_primary);
  if (primaryImg?.image_url) return primaryImg.image_url;

  // 3. First available image
  return images[0]?.image_url || fallback;
}

/**
 * Retrieves the currently active cart for the authenticated user, or returns
 * an empty unauthenticated cart structure for guests.
 */
export async function getCartAction(): Promise<CartActionResult<CartData>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: true,
        data: {
          id: null,
          userId: null,
          status: 'active',
          items: [],
          itemCount: 0,
          subtotal: 0,
          hasStaleItems: false,
          isAuthenticated: false,
        },
      };
    }

    // 1. Fetch or initialize active cart for authenticated user
    let { data: cart } = await (supabase.from('carts') as any)
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (!cart) {
      // Create active cart for user
      const { data: newCart, error: createError } = await (supabase.from('carts') as any)
        .insert({
          user_id: user.id,
          status: 'active',
        })
        .select()
        .single();

      if (createError) {
        // If unique index race condition occurred, retry fetch
        const { data: existingCart } = await (supabase.from('carts') as any)
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();

        cart = existingCart;
      } else {
        cart = newCart;
      }
    }

    if (!cart) {
      throw new Error('Failed to retrieve or create active shopping cart');
    }

    // 2. Fetch cart items with joined product and variant data
    const { data: rawItems, error: itemsError } = await (supabase.from('cart_items') as any)
      .select(`
        id,
        cart_id,
        product_id,
        variant_id,
        quantity,
        unit_price,
        created_at,
        updated_at,
        product:products (
          id,
          name,
          slug,
          is_active,
          product_images (
            id,
            image_url,
            is_primary,
            variant_id
          )
        ),
        variant:product_variants (
          id,
          name,
          sku,
          price,
          compare_at_price,
          stock_quantity,
          is_active
        )
      `)
      .eq('cart_id', cart.id)
      .order('created_at', { ascending: true });

    if (itemsError) {
      throw itemsError;
    }

    // 3. Authoritative server-side revalidation of items
    let hasStaleItems = false;
    const items: CartItem[] = [];

    for (const row of rawItems || []) {
      const product = row.product as any;
      const variant = row.variant as any;

      const isProductActive = Boolean(product && product.is_active);
      const isVariantActive = Boolean(variant && variant.is_active);
      const availableStock = variant ? Math.max(0, Number(variant.stock_quantity) || 0) : 0;
      const currentRealPrice = variant ? Number(variant.price) : Number(row.unit_price);
      const storedPrice = Number(row.unit_price);

      let warning: string | undefined;
      let isStale = false;
      let priceChanged = false;
      let outOfStock = false;

      if (!isProductActive || !isVariantActive) {
        warning = 'This item is no longer available in our store.';
        isStale = true;
        hasStaleItems = true;
      } else if (availableStock <= 0) {
        warning = 'This item is currently out of stock.';
        outOfStock = true;
        hasStaleItems = true;
      } else if (availableStock < row.quantity) {
        warning = `Only ${availableStock} units are currently available.`;
        hasStaleItems = true;
      }

      if (currentRealPrice !== storedPrice) {
        priceChanged = true;
        warning = warning || 'Price has updated since this item was added.';
      }

      const imageUrl = resolveItemImage(product?.product_images, row.variant_id);

      items.push({
        id: row.id,
        cartId: row.cart_id,
        productId: row.product_id,
        variantId: row.variant_id,
        name: product?.name || 'Gadget Product',
        slug: product?.slug || '',
        variantName: variant?.name || 'Standard Edition',
        sku: variant?.sku || '',
        price: storedPrice,
        originalPrice: currentRealPrice,
        compareAtPrice: variant?.compare_at_price ?? null,
        image: imageUrl,
        quantity: row.quantity,
        availableStock,
        isActive: isProductActive && isVariantActive && availableStock > 0,
        isStale,
        priceChanged,
        outOfStock,
        warning,
      });
    }

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const cartData: CartData = {
      id: cart.id,
      userId: user.id,
      status: cart.status as 'active',
      items,
      itemCount,
      subtotal,
      hasStaleItems,
      isAuthenticated: true,
    };

    return {
      success: true,
      data: cartData,
    };
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return {
      success: false,
      error: formatted.message,
    };
  }
}

/**
 * Adds an item to the shopping cart with authoritative server-side validation
 * of product, variant, availability, stock, and price.
 */
export async function addToCartAction(
  rawInput: unknown
): Promise<CartActionResult<CartData>> {
  try {
    const validated = addToCartSchema.parse(rawInput);
    const supabase = await createClient();

    // 1. Authoritative verification of variant and product
    const { data: variantRaw, error: variantError } = await (supabase.from('product_variants') as any)
      .select(`
        id,
        product_id,
        name,
        sku,
        price,
        compare_at_price,
        stock_quantity,
        is_active,
        product:products (
          id,
          name,
          slug,
          is_active,
          product_images (
            id,
            image_url,
            is_primary,
            variant_id
          )
        )
      `)
      .eq('id', validated.variantId)
      .maybeSingle();

    const variant = variantRaw as any;

    if (variantError || !variant) {
      return {
        success: false,
        error: 'The selected product variant could not be found.',
      };
    }

    const product = variant.product;
    if (!variant.is_active || !product?.is_active) {
      return {
        success: false,
        error: 'This product or variant is currently unavailable.',
      };
    }

    const availableStock = Math.max(0, Number(variant.stock_quantity) || 0);
    if (availableStock <= 0) {
      return {
        success: false,
        error: 'This item is currently out of stock.',
      };
    }

    if (validated.quantity > availableStock) {
      return {
        success: false,
        error: `Only ${availableStock} units are currently available.`,
      };
    }

    // 2. Check customer authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const imageUrl = resolveItemImage(product?.product_images, variant.id);

    // If customer is unauthenticated (guest), return validated guest item
    if (!user) {
      const guestItem: CartItem = {
        id: `guest-${variant.id}`,
        cartId: null,
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        slug: product.slug,
        variantName: variant.name,
        sku: variant.sku,
        price: Number(variant.price),
        originalPrice: Number(variant.price),
        compareAtPrice: variant.compare_at_price,
        image: imageUrl,
        quantity: validated.quantity,
        availableStock,
        isActive: true,
      };

      return {
        success: true,
        guestItem,
        requiresAuth: false,
      };
    }

    // 3. Authenticated customer: Find or create active cart
    let { data: cart } = await (supabase.from('carts') as any)
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: createCartError } = await (supabase.from('carts') as any)
        .insert({
          user_id: user.id,
          status: 'active',
        })
        .select('id, status')
        .single();

      if (createCartError) {
        // Handle race condition
        const { data: existingCart } = await (supabase.from('carts') as any)
          .select('id, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .maybeSingle();
        cart = existingCart;
      } else {
        cart = newCart;
      }
    }

    if (!cart) {
      throw new Error('Could not initialize active cart for customer');
    }

    // 4. Check if variant already exists in the active cart
    const { data: existingItem } = await (supabase.from('cart_items') as any)
      .select('id, quantity, unit_price')
      .eq('cart_id', cart.id)
      .eq('variant_id', variant.id)
      .maybeSingle();

    if (existingItem) {
      const newQuantity = existingItem.quantity + validated.quantity;

      if (newQuantity > availableStock) {
        return {
          success: false,
          error: `Cannot add ${validated.quantity} more. You already have ${existingItem.quantity} in your cart, and only ${availableStock} units are available.`,
        };
      }

      const { error: updateError } = await (supabase.from('cart_items') as any)
        .update({
          quantity: newQuantity,
          unit_price: variant.price,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingItem.id);

      if (updateError) throw updateError;
    } else {
      // 5. Insert new cart item with authoritative variant price
      const { error: insertError } = await (supabase.from('cart_items') as any).insert({
        cart_id: cart.id,
        product_id: product.id,
        variant_id: variant.id,
        quantity: validated.quantity,
        unit_price: variant.price,
      });

      if (insertError) throw insertError;
    }

    // Return the fresh authoritative cart
    return await getCartAction();
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return {
      success: false,
      error: formatted.message,
    };
  }
}

/**
 * Authoritatively updates the quantity of an item in the customer's cart.
 */
export async function updateCartItemQuantityAction(
  rawInput: unknown
): Promise<CartActionResult<CartData>> {
  try {
    const validated = updateCartItemSchema.parse(rawInput);
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If guest, validate stock and return confirmation
    if (!user) {
      if (validated.variantId) {
        const { data: variant } = await (supabase.from('product_variants') as any)
          .select('id, stock_quantity, is_active, price')
          .eq('id', validated.variantId)
          .maybeSingle();

        if (variant) {
          const availableStock = Math.max(0, Number(variant.stock_quantity) || 0);
          if (validated.quantity > availableStock) {
            return {
              success: false,
              error: `Only ${availableStock} units are currently available.`,
            };
          }
        }
      }

      return {
        success: true,
      };
    }

    // Authenticated user: Verify cart ownership and item existence
    const { data: cart } = await (supabase.from('carts') as any)
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (!cart) {
      return { success: false, error: 'Active cart not found' };
    }

    // Find the cart item
    const { data: cartItem, error: fetchItemError } = await (supabase.from('cart_items') as any)
      .select(`
        id,
        cart_id,
        quantity,
        variant_id,
        variant:product_variants (
          id,
          price,
          stock_quantity,
          is_active,
          product:products (
            is_active
          )
        )
      `)
      .eq('id', validated.itemId)
      .eq('cart_id', cart.id)
      .maybeSingle();

    if (fetchItemError || !cartItem) {
      return { success: false, error: 'Cart item not found in active cart' };
    }

    const variant = cartItem.variant as any;
    const product = variant?.product as any;

    if (!variant || !variant.is_active || !product?.is_active) {
      return {
        success: false,
        error: 'This item is no longer available in the store.',
      };
    }

    const availableStock = Math.max(0, Number(variant.stock_quantity) || 0);
    if (validated.quantity > availableStock) {
      return {
        success: false,
        error: `Only ${availableStock} units are currently available.`,
      };
    }

    // Update quantity and refresh unit price to authoritative variant price
    const { error: updateError } = await (supabase.from('cart_items') as any)
      .update({
        quantity: validated.quantity,
        unit_price: variant.price,
        updated_at: new Date().toISOString(),
      })
      .eq('id', cartItem.id);

    if (updateError) throw updateError;

    return await getCartAction();
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return {
      success: false,
      error: formatted.message,
    };
  }
}

/**
 * Removes a specific cart item from the customer's active cart.
 */
export async function removeCartItemAction(
  rawInput: unknown
): Promise<CartActionResult<CartData>> {
  try {
    const validated = removeCartItemSchema.parse(rawInput);
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Guest remove does not touch database
    if (!user) {
      return { success: true };
    }

    const { data: cart } = await (supabase.from('carts') as any)
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (!cart) {
      return { success: false, error: 'Active cart not found' };
    }

    const { error: deleteError } = await (supabase.from('cart_items') as any)
      .delete()
      .eq('id', validated.itemId)
      .eq('cart_id', cart.id);

    if (deleteError) throw deleteError;

    return await getCartAction();
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return {
      success: false,
      error: formatted.message,
    };
  }
}

/**
 * Clears all items from the customer's active cart.
 */
export async function clearCartAction(): Promise<CartActionResult<CartData>> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: true };
    }

    const { data: cart } = await (supabase.from('carts') as any)
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (cart) {
      const { error: deleteError } = await (supabase.from('cart_items') as any)
        .delete()
        .eq('cart_id', cart.id);

      if (deleteError) throw deleteError;
    }

    return await getCartAction();
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return {
      success: false,
      error: formatted.message,
    };
  }
}

/**
 * Seamlessly synchronizes guest cart items into the authenticated customer's Supabase cart.
 * Merges quantities safely up to available stock.
 */
export async function syncGuestCartAction(
  rawItems: unknown
): Promise<CartActionResult<CartData>> {
  try {
    const items = syncGuestCartSchema.parse(rawItems);
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || items.length === 0) {
      return await getCartAction();
    }

    // 1. Ensure active cart exists
    let { data: cart } = await (supabase.from('carts') as any)
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (!cart) {
      const { data: newCart } = await (supabase.from('carts') as any)
        .insert({ user_id: user.id, status: 'active' })
        .select('id')
        .single();
      cart = newCart;
    }

    if (!cart) {
      throw new Error('Failed to resolve active cart for user');
    }

    // 2. Fetch existing items in user's cart
    const { data: existingItems } = await (supabase.from('cart_items') as any)
      .select('id, variant_id, quantity')
      .eq('cart_id', cart.id);

    const existingMap = new Map<string, { id: string; quantity: number }>();
    (existingItems || []).forEach((item: any) => {
      existingMap.set(item.variant_id, { id: item.id, quantity: item.quantity });
    });

    // 3. Process each guest item
    for (const item of items) {
      const { data: variant } = await (supabase.from('product_variants') as any)
        .select('id, product_id, price, stock_quantity, is_active')
        .eq('id', item.variantId)
        .maybeSingle();

      if (!variant || !variant.is_active) continue;

      const availableStock = Math.max(0, Number(variant.stock_quantity) || 0);
      if (availableStock <= 0) continue;

      const existing = existingMap.get(variant.id);
      if (existing) {
        const mergedQuantity = Math.min(existing.quantity + item.quantity, availableStock);
        await (supabase.from('cart_items') as any)
          .update({
            quantity: mergedQuantity,
            unit_price: variant.price,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        const finalQuantity = Math.min(item.quantity, availableStock);
        await (supabase.from('cart_items') as any).insert({
          cart_id: cart.id,
          product_id: variant.product_id,
          variant_id: variant.id,
          quantity: finalQuantity,
          unit_price: variant.price,
        });
      }
    }

    return await getCartAction();
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return {
      success: false,
      error: formatted.message,
    };
  }
}
