// ==============================================================================
// 3LINE GADGETS — ADMIN CATEGORIES PAGE
// app/admin/categories/page.tsx
// ==============================================================================

import { requireAdmin } from '@/lib/auth/session';
import { getAdminCategories } from '@/lib/actions/admin-categories';
import { CategoryManager } from '@/components/admin/CategoryManager';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  await requireAdmin('/admin/categories');
  const categories = await getAdminCategories();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Category Taxonomy
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
            {categories.length} categories
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Define storefront catalog sections, navigational slugs, and visual ordering.
        </p>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
}
