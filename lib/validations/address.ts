// ==============================================================================
// 3LINE GADGETS — ADDRESS VALIDATION SCHEMAS
// lib/validations/address.ts
// ==============================================================================

import { z } from 'zod';

export const addressSchema = z.object({
  label: z.string().trim().max(50).optional().or(z.literal('')),
  fullName: z
    .string()
    .trim()
    .min(2, 'Full recipient name is required')
    .max(100),
  phone: z
    .string()
    .trim()
    .min(10, 'Contact phone is required (min 10 digits)')
    .max(20)
    .regex(/^[+0-9\s-]+$/, 'Invalid phone number format'),
  addressLine1: z
    .string()
    .trim()
    .min(5, 'Street address is required')
    .max(255),
  addressLine2: z.string().trim().max(255).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'City is required').max(100),
  state: z.string().trim().min(2, 'State / Region is required').max(100),
  country: z.string().trim().min(2).max(100).default('Nigeria'),
  postalCode: z.string().trim().max(20).optional().or(z.literal('')),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
