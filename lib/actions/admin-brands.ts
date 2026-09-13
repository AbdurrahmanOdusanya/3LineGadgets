// ==============================================================================
// 3LINE GADGETS — ADMIN BRANDS SERVER ACTIONS
// lib/actions/admin-brands.ts
// ==============================================================================

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/session';
import { brandSchema, type BrandInput } from '@/lib/validations/brand';
import { slugify } from '@/lib/utils';

/**
 * Fetch all brands with product count
 */
export async function getAdminBrands(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('brands')
    .select(
      `
      id,
      name,
      slug,
      description,
      logo_url,
      is_active,
      created_at,
      updated_at,
      products:products(count)
    `
    )
    .order('name', { ascending: true });

  if (search && search.trim()) {
    const term = search.trim();
    query = query.or(`name.ilike.%${term}%,slug.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  return (data || []).map((brand: any) => ({
    ...brand,
    productCount: brand.products?.[0]?.count || 0,
  }));
}

/**
 * Create a new brand
 */
export async function createAdminBrand(input: BrandInput) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const validated = brandSchema.parse(input);
  let safeSlug = slugify(validated.slug || validated.name);

  // Check unique slug
  const { data: existing } = await supabase
    .from('brands')
    .select('id')
    .eq('slug', safeSlug)
    .maybeSingle();

  if (existing) {
    safeSlug = `${safeSlug}-${Math.floor(100 + Math.random() * 900)}`;
  }

  const { data: brand, error } = await (supabase.from('brands') as any)
    .insert({
      name: validated.name,
      slug: safeSlug,
      description: validated.description || null,
      logo_url: validated.logoUrl || null,
      is_active: validated.isActive ?? true,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: 'brand_created',
    entity_type: 'brand',
    entity_id: brand.id,
    description: `Created brand "${validated.name}"`,
    metadata: { brandId: brand.id, slug: safeSlug },
  });

  revalidatePath('/admin/brands');
  revalidatePath('/admin/products');
  return { success: true, brand };
}

/**
 * Update an existing brand
 */
export async function updateAdminBrand(id: string, input: BrandInput) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const validated = brandSchema.parse(input);
  let safeSlug = slugify(validated.slug || validated.name);

  const { data: existing } = await supabase
    .from('brands')
    .select('id')
    .eq('slug', safeSlug)
    .neq('id', id)
    .maybeSingle();

  if (existing) {
    safeSlug = `${safeSlug}-${Math.floor(100 + Math.random() * 900)}`;
  }

  const { error } = await (supabase.from('brands') as any)
    .update({
      name: validated.name,
      slug: safeSlug,
      description: validated.description || null,
      logo_url: validated.logoUrl || null,
      is_active: validated.isActive ?? true,
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: 'brand_updated',
    entity_type: 'brand',
    entity_id: id,
    description: `Updated brand "${validated.name}"`,
    metadata: { brandId: id, slug: safeSlug },
  });

  revalidatePath('/admin/brands');
  revalidatePath('/admin/products');
  return { success: true };
}

/**
 * Toggle brand active status
 */
export async function toggleBrandStatus(id: string, isActive: boolean) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { data: brand, error } = await (supabase.from('brands') as any)
    .update({ is_active: isActive })
    .eq('id', id)
    .select('name')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: isActive ? 'brand_activated' : 'brand_deactivated',
    entity_type: 'brand',
    entity_id: id,
    description: `${isActive ? 'Activated' : 'Deactivated'} brand "${brand.name}"`,
    metadata: { brandId: id, isActive },
  });

  revalidatePath('/admin/brands');
  revalidatePath('/admin/products');
  return { success: true };
}

/**
 * Safely delete a brand if no products reference it
 */
export async function deleteAdminBrand(id: string) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { data: brand } = await (supabase.from('brands') as any)
    .select('name')
    .eq('id', id)
    .maybeSingle();

  if (!brand) {
    return { success: false, error: 'Brand not found' };
  }

  // Check product count
  const { count: productCount } = await (supabase.from('products') as any)
    .select('id', { count: 'exact', head: true })
    .eq('brand_id', id);

  if (productCount && productCount > 0) {
    return {
      success: false,
      error: `Cannot delete brand "${brand.name}" because it is currently assigned to ${productCount} product(s). Please reassign those products or deactivate this brand instead.`,
    };
  }

  const { error } = await (supabase.from('brands') as any).delete().eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: 'brand_deleted',
    entity_type: 'brand',
    entity_id: id,
    description: `Deleted brand "${brand.name}"`,
    metadata: { brandId: id, brandName: brand.name },
  });

  revalidatePath('/admin/brands');
  revalidatePath('/admin/products');
  return { success: true };
}
