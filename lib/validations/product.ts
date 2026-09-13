// ==============================================================================
// 3LINE GADGETS — PRODUCT VALIDATION SCHEMAS
// lib/validations/product.ts
// ==============================================================================

import { z } from 'zod';

export const productImageSchema = z.object({
  id: z.string().uuid().optional(),
  imageUrl: z.string().url('Must be a valid URL'),
  altText: z.string().trim().max(200).optional().nullable(),
  sortOrder: z.number().int().default(0),
  isPrimary: z.boolean().default(false),
  variantId: z.string().uuid().optional().nullable(),
});

export const productVariantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, 'Variant name is required').max(100),
  sku: z
    .string()
    .trim()
    .min(3, 'SKU must be at least 3 characters')
    .max(60)
    .regex(/^[A-Za-z0-9-_]+$/, 'SKU may only contain alphanumeric characters, hyphens, and underscores'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  compareAtPrice: z.coerce.number().min(0, 'Compare-at price cannot be negative').optional().nullable(),
  stockQuantity: z.coerce.number().int().min(0, 'Stock quantity cannot be negative').default(0),
  lowStockThreshold: z.coerce.number().int().min(0, 'Threshold cannot be negative').default(5),
  isActive: z.boolean().default(true),
});

export const specificationItemSchema = z.object({
  key: z.string().trim().min(1, 'Key is required').max(80),
  value: z.string().trim().min(1, 'Value is required').max(300),
});

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2, 'Product name is required').max(200),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  categoryId: z.string().uuid('Category is required'),
  brandId: z.string().uuid('Brand is invalid').optional().nullable(),
  description: z.string().trim().min(10, 'Full description must be at least 10 characters'),
  shortDescription: z.string().trim().max(500).optional().nullable(),
  basePrice: z.coerce.number().min(0, 'Base price cannot be negative'),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  specifications: z.record(z.string(), z.any()).default({}),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  variants: z.array(productVariantSchema).min(1, 'Product must have at least one variant'),
  images: z.array(productImageSchema).optional().default([]),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductVariantInput = z.infer<typeof productVariantSchema>;
export type ProductImageInput = z.infer<typeof productImageSchema>;
export type SpecificationItemInput = z.infer<typeof specificationItemSchema>;
