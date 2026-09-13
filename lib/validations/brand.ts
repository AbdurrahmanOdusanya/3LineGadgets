// ==============================================================================
// 3LINE GADGETS — BRAND VALIDATION SCHEMAS
// lib/validations/brand.ts
// ==============================================================================

import { z } from 'zod';

export const brandSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, 'Brand name must be at least 2 characters').max(100),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().trim().max(500).optional().nullable(),
  logoUrl: z.string().trim().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type BrandInput = z.infer<typeof brandSchema>;
