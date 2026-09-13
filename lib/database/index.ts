// ==============================================================================
// 3LINE GADGETS — DATABASE DATA ACCESS LAYER (DAL)
// lib/database/index.ts
// ==============================================================================

import { createClient } from '@/lib/supabase/server';
import type { Category, Brand, Product } from '@/types/database';

/**
 * Fetches all active product categories ordered by sort_order.
 */
export async function getActiveCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Failed to query categories:', err);
    return [];
  }
}

/**
 * Fetches all active brands.
 */
export async function getActiveBrands(): Promise<Brand[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching brands:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Failed to query brands:', err);
    return [];
  }
}

/**
 * Fetches featured products with their primary images and active variants.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(8);

    if (error) {
      console.error('Error fetching featured products:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Failed to query featured products:', err);
    return [];
  }
}
