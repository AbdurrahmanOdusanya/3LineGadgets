// ==============================================================================
// 3LINE GADGETS — ADMIN BRANDS PAGE
// app/admin/brands/page.tsx
// ==============================================================================

import { requireAdmin } from '@/lib/auth/session';
import { getAdminBrands } from '@/lib/actions/admin-brands';
import { BrandManager } from '@/components/admin/BrandManager';

export const dynamic = 'force-dynamic';

export default async function AdminBrandsPage() {
  await requireAdmin('/admin/brands');
  const brands = await getAdminBrands();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Brand Directory
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
            {brands.length} brands
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Manage gadget manufacturers, hardware partners, and official brand assets.
        </p>
      </div>

      <BrandManager brands={brands} />
    </div>
  );
}
