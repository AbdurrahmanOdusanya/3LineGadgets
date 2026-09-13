// ==============================================================================
// 3LINE GADGETS — CATEGORY VALIDATION SCHEMAS
// lib/validations/category.ts
// ==============================================================================

import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, 'Category name must be at least 2 characters').max(100),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().trim().max(500).optional().nullable(),
  imageUrl: z.string().trim().url('Must be a valid URL').optional().nullable().or(z.literal('')),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;
