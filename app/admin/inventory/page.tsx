// ==============================================================================
// 3LINE GADGETS — ADMIN INVENTORY PAGE
// app/admin/inventory/page.tsx
// ==============================================================================

import { requireAdmin } from '@/lib/auth/session';
import {
  getInventoryOverview,
  getInventoryStats,
} from '@/lib/actions/admin-inventory';
import { InventoryManager } from '@/components/admin/InventoryManager';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    stockStatus?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  }>;
}

export default async function AdminInventoryPage({ searchParams }: PageProps) {
  await requireAdmin('/admin/inventory');
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const search = params.search || '';
  const stockStatus = params.stockStatus || 'all';

  const [inventoryData, stats] = await Promise.all([
    getInventoryOverview({
      page,
      limit: 15,
      search,
      stockStatus,
    }),
    getInventoryStats(),
  ]);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory &amp; Stock Control
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
            {stats.totalStockUnits.toLocaleString()} units
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Track real-time SKU inventory levels, configure alert thresholds, and record stock adjustments with atomic audit logging.
        </p>
      </div>

      <InventoryManager
        variants={inventoryData.variants}
        totalCount={inventoryData.totalCount}
        currentPage={inventoryData.page}
        totalPages={inventoryData.totalPages}
        stats={stats}
        filters={{
          search,
          stockStatus,
        }}
      />
    </div>
  );
}
