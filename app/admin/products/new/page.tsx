// ==============================================================================
// 3LINE GADGETS — ADMIN CREATE PRODUCT PAGE
// app/admin/products/new/page.tsx
// ==============================================================================

import { requireAdmin } from '@/lib/auth/session';
import { getAdminCategories } from '@/lib/actions/admin-categories';
import { getAdminBrands } from '@/lib/actions/admin-brands';
import { ProductForm } from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  await requireAdmin('/admin/products/new');

  const [categories, brands] = await Promise.all([
    getAdminCategories(),
    getAdminBrands(),
  ]);

  return (
    <div className="py-2">
      <ProductForm
        categories={categories}
        brands={brands}
        isEditing={false}
      />
    </div>
  );
}
