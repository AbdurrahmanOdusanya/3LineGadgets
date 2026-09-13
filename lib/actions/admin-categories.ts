// ==============================================================================
// 3LINE GADGETS — ADMIN CATEGORIES SERVER ACTIONS
// lib/actions/admin-categories.ts
// ==============================================================================

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/session';
import { categorySchema, type CategoryInput } from '@/lib/validations/category';
import { slugify } from '@/lib/utils';

/**
 * Fetch all categories with product count
 */
export async function getAdminCategories(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('categories')
    .select(
      `
      id,
      name,
      slug,
      description,
      image_url,
      is_active,
      sort_order,
      created_at,
      updated_at,
      products:products(count)
    `
    )
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (search && search.trim()) {
    const term = search.trim();
    query = query.or(`name.ilike.%${term}%,slug.ilike.%${term}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return (data || []).map((cat: any) => ({
    ...cat,
    productCount: cat.products?.[0]?.count || 0,
  }));
}

/**
 * Create a new category
 */
export async function createAdminCategory(input: CategoryInput) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const validated = categorySchema.parse(input);
  let safeSlug = slugify(validated.slug || validated.name);

  // Check unique slug
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', safeSlug)
    .maybeSingle();

  if (existing) {
    safeSlug = `${safeSlug}-${Math.floor(100 + Math.random() * 900)}`;
  }

  const { data: category, error } = await (supabase.from('categories') as any)
    .insert({
      name: validated.name,
      slug: safeSlug,
      description: validated.description || null,
      image_url: validated.imageUrl || null,
      sort_order: validated.sortOrder ?? 0,
      is_active: validated.isActive ?? true,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: 'category_created',
    entity_type: 'category',
    entity_id: category.id,
    description: `Created category "${validated.name}"`,
    metadata: { categoryId: category.id, slug: safeSlug },
  });

  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  return { success: true, category };
}

/**
 * Update an existing category
 */
export async function updateAdminCategory(id: string, input: CategoryInput) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const validated = categorySchema.parse(input);
  let safeSlug = slugify(validated.slug || validated.name);

  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', safeSlug)
    .neq('id', id)
    .maybeSingle();

  if (existing) {
    safeSlug = `${safeSlug}-${Math.floor(100 + Math.random() * 900)}`;
  }

  const { error } = await (supabase.from('categories') as any)
    .update({
      name: validated.name,
      slug: safeSlug,
      description: validated.description || null,
      image_url: validated.imageUrl || null,
      sort_order: validated.sortOrder ?? 0,
      is_active: validated.isActive ?? true,
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: 'category_updated',
    entity_type: 'category',
    entity_id: id,
    description: `Updated category "${validated.name}"`,
    metadata: { categoryId: id, slug: safeSlug },
  });

  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  return { success: true };
}

/**
 * Toggle category active status
 */
export async function toggleCategoryStatus(id: string, isActive: boolean) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { data: cat, error } = await (supabase.from('categories') as any)
    .update({ is_active: isActive })
    .eq('id', id)
    .select('name')
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: isActive ? 'category_activated' : 'category_deactivated',
    entity_type: 'category',
    entity_id: id,
    description: `${isActive ? 'Activated' : 'Deactivated'} category "${cat.name}"`,
    metadata: { categoryId: id, isActive },
  });

  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  return { success: true };
}

/**
 * Safely delete a category if no products reference it
 */
export async function deleteAdminCategory(id: string) {
  const { user } = await requireAdmin();
  const supabase = await createClient();

  const { data: cat } = await (supabase.from('categories') as any)
    .select('name')
    .eq('id', id)
    .maybeSingle();

  if (!cat) {
    return { success: false, error: 'Category not found' };
  }

  // Check product count
  const { count: productCount } = await (supabase.from('products') as any)
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);

  if (productCount && productCount > 0) {
    return {
      success: false,
      error: `Cannot delete category "${cat.name}" because it currently has ${productCount} assigned product(s). Please reassign those products or deactivate this category instead.`,
    };
  }

  const { error } = await (supabase.from('categories') as any).delete().eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await (supabase.from('admin_activity_logs') as any).insert({
    admin_id: user.id,
    action: 'category_deleted',
    entity_type: 'category',
    entity_id: id,
    description: `Deleted category "${cat.name}"`,
    metadata: { categoryId: id, categoryName: cat.name },
  });

  revalidatePath('/admin/categories');
  revalidatePath('/admin/products');
  return { success: true };
}
