// ==============================================================================
// 3LINE GADGETS — STOREFRONT TYPES & CLIENT UTILS
// types/storefront.ts
// ==============================================================================

export interface StorefrontProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price?: number | null;
  stock_quantity: number;
  low_stock_threshold?: number;
  is_active: boolean;
  attributes?: Record<string, any>;
}

export interface StorefrontProductImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order?: number;
  display_order?: number;
}

export interface StorefrontProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  base_price: number;
  compare_at_price?: number | null;
  specifications: Record<string, any>;
  is_featured: boolean;
  is_active: boolean;
  rating?: number;
  review_count?: number;
  created_at?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    image_url?: string | null;
  } | null;
  brand?: {
    id: string;
    name: string;
    slug: string;
    logo_url?: string | null;
  } | null;
  variants: StorefrontProductVariant[];
  images: StorefrontProductImage[];
}

export interface StorefrontCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  itemCount: number;
}

export interface StorefrontBrand {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  itemCount: number;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductStockInfo {
  status: StockStatus;
  label: string;
  totalStock: number;
  isAvailable: boolean;
}

export interface StorefrontCatalogResult {
  products: StorefrontProduct[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StorefrontFilterOptions {
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  sortBy?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  page?: number;
  limit?: number;
  onlyDeals?: boolean;
}

/**
 * Calculates stock availability logic across all active variants
 */
export function getProductStockInfo(variants?: StorefrontProductVariant[]): ProductStockInfo {
  if (!variants || variants.length === 0) {
    return {
      status: 'out_of_stock',
      label: 'Out of Stock',
      totalStock: 0,
      isAvailable: false,
    };
  }

  const totalStock = variants.reduce(
    (acc, v) => acc + (v.is_active ? v.stock_quantity || 0 : 0),
    0
  );

  if (totalStock <= 0) {
    return {
      status: 'out_of_stock',
      label: 'Out of Stock',
      totalStock: 0,
      isAvailable: false,
    };
  }

  if (totalStock <= 5) {
    return {
      status: 'low_stock',
      label: 'Low Stock',
      totalStock,
      isAvailable: true,
    };
  }

  return {
    status: 'in_stock',
    label: 'In Stock',
    totalStock,
    isAvailable: true,
  };
}
