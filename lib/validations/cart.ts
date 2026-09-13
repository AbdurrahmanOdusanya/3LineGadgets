// ==============================================================================
// 3LINE GADGETS — SHOPPING CART VALIDATION SCHEMAS
// lib/validations/cart.ts
// ==============================================================================

import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().min(1, 'Variant ID is required'),
  quantity: z
    .coerce
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(500, 'Maximum purchase limit per item is 500 units'),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().min(1, 'Cart item ID is required'),
  quantity: z
    .coerce
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(500, 'Maximum purchase limit per item is 500 units'),
  variantId: z.string().optional(),
});

export const removeCartItemSchema = z.object({
  itemId: z.string().min(1, 'Cart item ID is required'),
  variantId: z.string().optional(),
});

export const syncGuestCartSchema = z.array(
  z.object({
    productId: z.string().min(1),
    variantId: z.string().min(1),
    quantity: z.coerce.number().int().min(1).max(500),
  })
);

export type AddToCartInputValidated = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInputValidated = z.infer<typeof updateCartItemSchema>;
export type RemoveCartItemInputValidated = z.infer<typeof removeCartItemSchema>;
