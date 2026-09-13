// ==============================================================================
// 3LINE GADGETS — ADMIN PRODUCTS SERVER ACTIONS
// lib/actions/admin-products.ts
// ==============================================================================

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/session';
import { productSchema, type ProductInput } from '@/lib/validations/product';
import { slugify } from '@/lib/utils';

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: 'all' | 'active' | 'inactive';
  stockStatus?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  isFeatured?: 'all' | 'featured' | 'standard';
}

export interface AdminProductListResult {
  products: any[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Fetch filtered and paginated list of products for the admin table
 */
export async function getAdminProducts(
  filters: ProductFilters = {}
): Promise<AdminProductListResult> {
  const supabase = await createClient();
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, Math.max(1, filters.limit || 10));
  const offset = (page - 1) * limit;

  let query = supabase
    .from('products')
    .select(
      `
      id,
      name,
      slug,
      description,
      short_description,
      base_price,
      compare_at_price,
      specifications,
      is_active,
      is_featured,
      created_at,
      updated_at,
      category:categories (id, name, slug),
      brand:brands (id, name, slug, logo_url),
      variants:product_variants (
        id,
        name,
        sku,
        price,
        compare_at_price,
        stock_quantity,
        low_stock_threshold,
        is_active
      ),
      images:product_images (
        id,
        image_url,
        alt_text,
        is_primary,
        sort_order
      )
    `,
      { count: 'exact' }
    );

  // Search by product name or slug
  if (filters.search && filters.search.trim()) {
    const term = filters.search.trim();
    query = query.or(`name.ilike.%${term}%,slug.ilike.%${term}%`);
  }

  // Category filter
  if (filters.categoryId && filters.categoryId !== 'all') {
    query = query.eq('category_id', filters.categoryId);
  }

  // Brand filter
  if (filters.brandId && filters.brandId !== 'all') {
    query = query.eq('brand_id', filters.brandId);
  }

  // Active status filter
  if (filters.status === 'active') {
    query = query.eq('is_active', true);
  } else if (filters.status === 'inactive') {
    query = query.eq('is_active', false);
  }

  // Featured filter
  if (filters.isFeatured === 'featured') {
    query = query.eq('is_featured', true);
  } else if (filters.isFeatured === 'standard') {
    query = query.eq('is_featured', false);
  }

  // Order by newest first
  query = query.order('created_at', { ascending: false });

  // Pagination bounds
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching admin products:', error);
    return {
      products: [],
      totalCount: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  let products: any[] = (data as any[]) || [];

  // Filter in-memory for complex stock status if requested
  if (filters.stockStatus && filters.stockStatus !== 'all') {
    products = products.filter((product: any) => {
      const variants = product.variants || [];
      const totalStock = variants.reduce(
        (sum: number, v: any) => sum + (v.stock_quantity || 0),
        0
      );
      const hasLowStockVariant = variants.some(
        (v: any) =>
          v.stock_quantity > 0 && v.stock_quantity <= (v.low_stock_threshold || 5)
      );

      if (filters.stockStatus === 'out_of_stock') {
        return totalStock === 0 || variants.some((v: any) => v.stock_quantity === 0);
      }
      if (filters.stockStatus === 'low_stock') {
        return hasLowStockVariant;
      }
      if (filters.stockStatus === 'in_stock') {
        return totalStock > 0 && !hasLowStockVariant;
      }
      return true;
    });
  }

  const total = count ?? products.length;
  const totalPages = Math.ceil(total / limit);

  return {
    products,
    totalCount: total,
    page,
    limit,
    totalPages,
  };
}

/**
 * Fetch a single product by ID with category, brand, variants, and images
 */
export async function getAdminProductById(id: string) {
  const supabase = await createClient();

  const { data, error } = await (supabase.from('products') as any)
    .select(
      `
      *,
      category:categories (id, name, slug),
      brand:brands (id, name, slug, logo_url),
      variants:product_variants (*),
      images:product_images (*)
    `
    )
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const productData = data as any;

  // Sort images by sort_order
  if (productData.images && Array.isArray(productData.images)) {
    productData.images.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  return productData;
}

/**
 * Create a new product with variants and images
 */
export async function createAdminProduct(input: ProductInput) {
  const { user, profile } = await requireAdmin();
  const supabase = await createClient();

  // Validate payload
  const validated = productSchema.parse(input);

  // Ensure unique slug
  let safeSlug = slugify(validated.slug || validated.name);
  const { data: existingSlug } = await (supabase.from('products') as any)
    .select('id')
    .eq('slug', safeSlug)
    .maybeSingle();

  if (existingSlug) {
    safeSlug = `${safeSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // 1. Insert product record
  const { data: product, error: productError } = await (supabase.from('products') as any)
    .insert({
      name: validated.name,
      slug: safeSlug,
      category_id: validated.categoryId,
      brand_id: validated.brandId || null,
      description: validated.description,
      short_description: validated.shortDescription || null,
      base_price: validated.basePrice,
      compare_at_price: validated.compareAtPrice || null,
      specifications: validated.specifications || {},
      is_active: validated.isActive ?? true,
      is_featured: validated.isFeatured ?? false,
    })
    .select()
    .single();

  if (productError || !product) {
    console.error('Failed to insert product:', productError);
    return {
      success: false,
      error: productError?.message || 'Failed to create product record',
    };
  }

  // 2. Insert product variants
  const variantsToInsert = validated.variants.map((v) => ({
    product_id: product.id,
    name: v.name,
    sku: v.sku.toUpperCase(),
    price: v.price,
    compare_at_price: v.compareAtPrice || null,
    stock_quantity: v.stockQuantity ?? 0,
    low_stock_threshold: v.lowStockThreshold ?? 5,
    is_active: v.isActive ?? true,
  }));

  const { data: createdVariants, error: variantError } = await (supabase.from('product_variants') as any)
    .insert(variantsToInsert)
    .select();

  if (variantError) {
    console.error('Failed to insert variants:', variantError);
  }

  // 3. Insert initial inventory transactions for variants with stock > 0
  const createdVariantList = (createdVariants as any[]) || [];
  if (createdVariantList.length > 0) {
    for (const v of createdVariantList) {
      if (v.stock_quantity > 0) {
        await (supabase.from('inventory_transactions') as any).insert({
          variant_id: v.id,
          transaction_type: 'restock',
          quantity: v.stock_quantity,
          note: 'Initial inventory upon product creation',
          created_by: user.id,
        });
      }
    }
  }

  // 4. Insert product images if any
  if (validated.images && validated.images.length > 0) {
    const imagesToInsert = validated.images.map((img, index) => ({
      product_id: product.id,
      image_url: img.imageUrl,
      alt_text: img.altText || validated.name,
      sort_order: img.sortOrder ?? index,
      is_primary: img.isPrimary ?? index === 0,
      variant_id: img.variantId || null,
    }));

    await (supabase.from('product_images') as any).insert(imagesToInsert);
  }

  // 5. Log activity
  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: 'product_created',
    entity_type: 'product',
    entity_id: product.id,
    description: `Created product "${validated.name}" with ${validated.variants.length} variant(s)`,
    metadata: {
      productId: product.id,
      slug: safeSlug,
      basePrice: validated.basePrice,
      variantCount: validated.variants.length,
      adminName: profile.full_name,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/products');
  revalidatePath('/admin/inventory');

  return { success: true, product };
}

/**
 * Update an existing product, variants, and images
 */
export async function updateAdminProduct(id: string, input: ProductInput) {
  const { user, profile } = await requireAdmin();
  const supabase = await createClient();

  const validated = productSchema.parse(input);

  // Check slug uniqueness excluding self
  let safeSlug = slugify(validated.slug || validated.name);
  const { data: existingSlug } = await (supabase.from('products') as any)
    .select('id')
    .eq('slug', safeSlug)
    .neq('id', id)
    .maybeSingle();

  if (existingSlug) {
    safeSlug = `${safeSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  // 1. Update product base info
  const { error: updateError } = await (supabase.from('products') as any)
    .update({
      name: validated.name,
      slug: safeSlug,
      category_id: validated.categoryId,
      brand_id: validated.brandId || null,
      description: validated.description,
      short_description: validated.shortDescription || null,
      base_price: validated.basePrice,
      compare_at_price: validated.compareAtPrice || null,
      specifications: validated.specifications || {},
      is_active: validated.isActive ?? true,
      is_featured: validated.isFeatured ?? false,
    })
    .eq('id', id);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // 2. Manage Variants:
  // Fetch existing variants
  const { data: existingVariants } = await (supabase.from('product_variants') as any)
    .select('id, sku, stock_quantity')
    .eq('product_id', id);

  const existingList = (existingVariants as any[]) || [];
  const existingIds = new Set(existingList.map((v) => v.id));
  const incomingIds = new Set(validated.variants.filter((v) => v.id).map((v) => v.id!));

  // Deactivate or delete removed variants safely
  for (const ev of existingList) {
    if (!incomingIds.has(ev.id)) {
      // Check if variant is used in orders
      const { data: orderItem } = await (supabase.from('order_items') as any)
        .select('id')
        .eq('variant_id', ev.id)
        .limit(1)
        .maybeSingle();

      if (orderItem) {
        // Soft-deactivate if in orders
        await (supabase.from('product_variants') as any)
          .update({ is_active: false })
          .eq('id', ev.id);
      } else {
        // Safe to delete if not in orders
        await (supabase.from('product_variants') as any).delete().eq('id', ev.id);
      }
    }
  }

  // Upsert variants
  for (const v of validated.variants) {
    if (v.id && existingIds.has(v.id)) {
      await (supabase.from('product_variants') as any)
        .update({
          name: v.name,
          sku: v.sku.toUpperCase(),
          price: v.price,
          compare_at_price: v.compareAtPrice || null,
          stock_quantity: v.stockQuantity ?? 0,
          low_stock_threshold: v.lowStockThreshold ?? 5,
          is_active: v.isActive ?? true,
        })
        .eq('id', v.id);
    } else {
      const { data: newVar } = await (supabase.from('product_variants') as any)
        .insert({
          product_id: id,
          name: v.name,
          sku: v.sku.toUpperCase(),
          price: v.price,
          compare_at_price: v.compareAtPrice || null,
          stock_quantity: v.stockQuantity ?? 0,
          low_stock_threshold: v.lowStockThreshold ?? 5,
          is_active: v.isActive ?? true,
        })
        .select()
        .single();

      if (newVar && (newVar as any).stock_quantity > 0) {
        await (supabase.from('inventory_transactions') as any).insert({
          variant_id: (newVar as any).id,
          transaction_type: 'restock',
          quantity: (newVar as any).stock_quantity,
          note: 'Initial inventory for new variant',
          created_by: user.id,
        });
      }
    }
  }

  // 3. Manage Images
  // Clean existing images and replace with updated set
  await (supabase.from('product_images') as any).delete().eq('product_id', id);

  if (validated.images && validated.images.length > 0) {
    const imagesToInsert = validated.images.map((img, index) => ({
      product_id: id,
      image_url: img.imageUrl,
      alt_text: img.altText || validated.name,
      sort_order: img.sortOrder ?? index,
      is_primary: img.isPrimary ?? index === 0,
      variant_id: img.variantId || null,
    }));

    await (supabase.from('product_images') as any).insert(imagesToInsert);
  }

  // 4. Log admin activity
  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: 'product_updated',
    entity_type: 'product',
    entity_id: id,
    description: `Updated product "${validated.name}"`,
    metadata: {
      productId: id,
      slug: safeSlug,
      basePrice: validated.basePrice,
      adminName: profile.full_name,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${id}`);
  revalidatePath('/admin/inventory');

  return { success: true };
}

/**
 * Toggle product active / inactive status
 */
export async function toggleProductStatus(id: string, isActive: boolean) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { data: product, error } = await (supabase.from('products') as any)
    .update({ is_active: isActive })
    .eq('id', id)
    .select('name')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: isActive ? 'product_activated' : 'product_deactivated',
    entity_type: 'product',
    entity_id: id,
    description: `${isActive ? 'Activated' : 'Deactivated'} product "${product.name}"`,
    metadata: { productId: id, isActive },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/products');
  return { success: true };
}

/**
 * Toggle product featured flag
 */
export async function toggleProductFeatured(id: string, isFeatured: boolean) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { data: product, error } = await (supabase.from('products') as any)
    .update({ is_featured: isFeatured })
    .eq('id', id)
    .select('name')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: isFeatured ? 'product_featured' : 'product_unfeatured',
    entity_type: 'product',
    entity_id: id,
    description: `${isFeatured ? 'Featured' : 'Unfeatured'} product "${product.name}"`,
    metadata: { productId: id, isFeatured },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/products');
  return { success: true };
}

/**
 * Safely delete a product (prevent deletion if ordered or in active carts)
 */
export async function deleteAdminProduct(id: string) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  // 1. Get product name
  const { data: product } = await (supabase.from('products') as any)
    .select('name')
    .eq('id', id)
    .maybeSingle();

  if (!product) {
    return { success: false, error: 'Product not found' };
  }

  // 2. Check if product variants are referenced in order items
  const { data: variants } = await (supabase.from('product_variants') as any)
    .select('id')
    .eq('product_id', id);

  const variantIds = ((variants as any[]) || []).map((v) => v.id);

  if (variantIds.length > 0) {
    const { count: orderCount } = await (supabase.from('order_items') as any)
      .select('id', { count: 'exact', head: true })
      .in('variant_id', variantIds);

    if (orderCount && orderCount > 0) {
      return {
        success: false,
        error: `Cannot delete "${product.name}" because it is referenced in ${orderCount} existing customer order(s). To remove it from the store, please deactivate it instead.`,
      };
    }
  }

  // 3. Delete product (foreign key CASCADE removes variants and images)
  const { error: deleteError } = await (supabase.from('products') as any).delete().eq('id', id);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  // 4. Log to admin activity logs
  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: 'product_deleted',
    entity_type: 'product',
    entity_id: id,
    description: `Deleted product "${product.name}" and associated variants`,
    metadata: { productId: id, productName: product.name },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/products');
  revalidatePath('/admin/inventory');

  return { success: true };
}
