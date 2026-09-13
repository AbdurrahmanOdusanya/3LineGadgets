// ==============================================================================
// 3LINE GADGETS — ADMIN INVENTORY SERVER ACTIONS
// lib/actions/admin-inventory.ts
// ==============================================================================

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/session';
import {
  stockAdjustmentSchema,
  type StockAdjustmentInput,
} from '@/lib/validations/inventory';

export interface InventoryFilterOptions {
  search?: string;
  stockStatus?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  page?: number;
  limit?: number;
}

/**
 * Fetch inventory overview with variants, parent products, and stock status
 */
export async function getInventoryOverview(filters: InventoryFilterOptions = {}) {
  const supabase = await createClient();
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 15));
  const offset = (page - 1) * limit;

  let query = supabase
    .from('product_variants')
    .select(
      `
      id,
      name,
      sku,
      price,
      compare_at_price,
      stock_quantity,
      low_stock_threshold,
      is_active,
      created_at,
      updated_at,
      product:products (
        id,
        name,
        slug,
        is_active,
        category:categories (id, name),
        brand:brands (id, name),
        images:product_images (id, image_url, is_primary)
      )
    `,
      { count: 'exact' }
    )
    .order('updated_at', { ascending: false });

  if (filters.search && filters.search.trim()) {
    const term = filters.search.trim();
    query = query.or(`name.ilike.%${term}%,sku.ilike.%${term}%`);
  }

  // Stock status database-level filters where possible
  if (filters.stockStatus === 'out_of_stock') {
    query = query.eq('stock_quantity', 0);
  } else if (filters.stockStatus === 'in_stock') {
    query = query.gt('stock_quantity', 0);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching inventory:', error);
    return {
      variants: [],
      totalCount: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  let variants = (data || []).map((v: any) => {
    let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
    if (v.stock_quantity === 0) {
      status = 'out_of_stock';
    } else if (v.stock_quantity <= (v.low_stock_threshold || 5)) {
      status = 'low_stock';
    }

    const primaryImage =
      v.product?.images?.find((img: any) => img.is_primary)?.image_url ||
      v.product?.images?.[0]?.image_url ||
      null;

    return {
      ...v,
      stockStatus: status,
      primaryImage,
    };
  });

  // If low_stock filter requested, refine in-memory (since comparison between columns requires SQL)
  if (filters.stockStatus === 'low_stock') {
    variants = variants.filter((v: any) => v.stockStatus === 'low_stock');
  }

  const total = count ?? variants.length;
  const totalPages = Math.ceil(total / limit);

  return {
    variants,
    totalCount: total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Fetch inventory summary metrics for the Admin Dashboard and Inventory page
 */
export async function getInventoryStats() {
  const supabase = await createClient();

  // 1. Total products & active/inactive products
  const { data: products } = await (supabase.from('products') as any)
    .select('id, is_active');

  const productList = (products as Array<{ id: string; is_active: boolean }>) || [];
  const totalProducts = productList.length;
  const activeProducts = productList.filter((p) => p.is_active).length;
  const inactiveProducts = totalProducts - activeProducts;

  // 2. Variants stock counts
  const { data: variants } = await (supabase.from('product_variants') as any)
    .select('id, stock_quantity, low_stock_threshold, is_active');

  const variantList = (variants as Array<{
    id: string;
    stock_quantity: number;
    low_stock_threshold: number;
    is_active: boolean;
  }>) || [];

  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalStockUnits = 0;

  for (const v of variantList) {
    const qty = v.stock_quantity || 0;
    const threshold = v.low_stock_threshold || 5;
    totalStockUnits += qty;

    if (qty === 0) {
      outOfStockCount++;
    } else if (qty <= threshold) {
      lowStockCount++;
    }
  }

  return {
    totalProducts,
    activeProducts,
    inactiveProducts,
    totalVariants: variantList.length,
    totalStockUnits,
    lowStockCount,
    outOfStockCount,
  };
}

/**
 * Adjust variant inventory stock atomically with transaction record and activity log
 */
export async function adjustVariantStock(input: StockAdjustmentInput) {
  const { user, profile } = await requireAdmin();
  const supabase = await createClient();

  const validated = stockAdjustmentSchema.parse(input);

  // Attempt 1: Call atomic stored procedure if installed
  try {
    const { data: rpcResult, error: rpcError } = await (supabase as any).rpc(
      'adjust_inventory_stock',
      {
        p_variant_id: validated.variantId,
        p_adjustment_quantity: validated.adjustmentQuantity,
        p_transaction_type: validated.transactionType as any,
        p_note: validated.note || null,
        p_admin_id: user.id,
      }
    );


    if (!rpcError && rpcResult) {
      revalidatePath('/admin');
      revalidatePath('/admin/inventory');
      revalidatePath('/admin/products');
      return { success: true, result: rpcResult };
    }
  } catch {
    // Fall back to direct database transaction below
  }

  // Fallback: Direct atomic-safe update
  const { data: variant, error: varError } = await (supabase.from('product_variants') as any)
    .select('id, stock_quantity, sku, name, product:products(name)')
    .eq('id', validated.variantId)
    .single();

  if (varError || !variant) {
    return { success: false, error: 'Variant not found' };
  }

  const currentStock = Number(variant.stock_quantity) || 0;
  const newStock = currentStock + validated.adjustmentQuantity;

  if (newStock < 0) {
    return {
      success: false,
      error: `Insufficient stock. Current stock is ${currentStock}, adjustment is ${validated.adjustmentQuantity} (would result in ${newStock}).`,
    };
  }

  // Update variant stock
  const { error: updateError } = await (supabase.from('product_variants') as any)
    .update({ stock_quantity: newStock, updated_at: new Date().toISOString() })
    .eq('id', validated.variantId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Insert inventory transaction
  const { error: txError } = await (supabase.from('inventory_transactions') as any).insert({
    variant_id: validated.variantId,
    transaction_type: validated.transactionType as any,
    quantity: validated.adjustmentQuantity,
    note: validated.note || null,
    created_by: user.id,
  });

  if (txError) {
    console.error('Failed to log inventory transaction:', txError);
  }

  // Log to admin activity logs
  const productName = (variant.product as any)?.name || 'Product';
  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: 'inventory_adjusted',
    entity_type: 'product_variant',
    entity_id: validated.variantId,
    description: `Adjusted stock for ${productName} (${variant.sku}): ${
      validated.adjustmentQuantity > 0 ? '+' : ''
    }${validated.adjustmentQuantity} (New stock: ${newStock})`,
    metadata: {
      sku: variant.sku,
      variantName: variant.name,
      previousStock: currentStock,
      adjustment: validated.adjustmentQuantity,
      newStock,
      transactionType: validated.transactionType,
      note: validated.note,
      adminName: profile.full_name,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/inventory');
  revalidatePath('/admin/products');

  return {
    success: true,
    previousStock: currentStock,
    newStock,
    adjustment: validated.adjustmentQuantity,
  };
}

/**
 * Fetch inventory movement history for a specific variant
 */
export async function getVariantTransactionHistory(variantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inventory_transactions')
    .select(
      `
      id,
      quantity,
      transaction_type,
      reference_type,
      reference_id,
      note,
      created_at,
      admin:profiles!created_by (id, full_name, avatar_url, role)
    `
    )
    .eq('variant_id', variantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch recent admin activity logs for dashboard feed
 */
export async function getRecentAdminActivityLogs(limit = 8): Promise<any[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('admin_activity_logs')
    .select(
      `
      id,
      action,
      entity_type,
      entity_id,
      description,
      metadata,
      created_at,
      admin:profiles (id, full_name, role)
    `
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching admin logs:', error);
    return [];
  }

  return (data as any[]) || [];
}

