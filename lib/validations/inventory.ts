// ==============================================================================
// 3LINE GADGETS — INVENTORY VALIDATION SCHEMAS
// lib/validations/inventory.ts
// ==============================================================================

import { z } from 'zod';

export const inventoryTransactionTypes = [
  'restock',
  'adjustment',
  'damage',
  'return',
  'purchase',
  'sale',
  'reservation',
  'release',
] as const;

export const stockAdjustmentSchema = z.object({
  variantId: z.string().uuid('Invalid variant ID'),
  adjustmentQuantity: z.coerce
    .number()
    .int('Adjustment must be an integer')
    .refine((val) => val !== 0, 'Adjustment quantity cannot be 0'),
  transactionType: z.enum(inventoryTransactionTypes, {
    message: 'Invalid transaction type',
  }),
  note: z.string().trim().max(500).optional().nullable(),
});

export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
