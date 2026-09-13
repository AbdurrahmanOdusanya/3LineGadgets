// ==============================================================================
// 3LINE GADGETS — ADMIN DASHBOARD
// app/admin/page.tsx
// ==============================================================================

import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/session';
import {
  getInventoryStats,
  getRecentAdminActivityLogs,
} from '@/lib/actions/admin-inventory';
import { getAdminProducts } from '@/lib/actions/admin-products';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package,
  Boxes,
  AlertTriangle,
  XCircle,
  Plus,
  Layers,
  Tag,
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { formatNaira, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { profile } = await requireAdmin('/admin');

  // Fetch dashboard data in parallel
  const [stats, recentProductsResult, recentLogs] = await Promise.all([
    getInventoryStats(),
    getAdminProducts({ limit: 5 }),
    getRecentAdminActivityLogs(6),
  ]);

  const recentProducts = recentProductsResult.products;

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Overview Dashboard
            </h1>
            <Badge variant="violet">{profile.role.toUpperCase()}</Badge>
          </div>
          <p className="text-sm text-slate-500">
            Welcome back, {profile.full_name || 'Administrator'}. Here is your store catalog &amp; inventory pulse.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/products/new">
            <Button className="shadow-xs font-semibold">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Product
            </Button>
          </Link>
          <Link href="/admin/inventory">
            <Button variant="outline">
              <Boxes className="w-4 h-4 mr-1.5 text-violet-600" />
              Adjust Stock
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <Card className="border-slate-200/80 hover:border-violet-200 transition-colors shadow-2xs">
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">
                Total Products
              </span>
              <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 mt-1">
              {stats.totalProducts}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="text-emerald-600 font-medium">
                {stats.activeProducts} active
              </span>
              <span>•</span>
              <span className="text-slate-400">
                {stats.inactiveProducts} inactive
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Variants */}
        <Card className="border-slate-200/80 hover:border-violet-200 transition-colors shadow-2xs">
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">
                Catalog Variants
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 mt-1">
              {stats.totalVariants}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-xs text-slate-500">
              {stats.totalStockUnits.toLocaleString()} units total in stock
            </p>
          </CardContent>
        </Card>

        {/* Low Stock Warning */}
        <Card className="border-slate-200/80 hover:border-amber-200 transition-colors shadow-2xs">
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">
                Low Stock Alerts
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-amber-600 mt-1">
              {stats.lowStockCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-xs text-slate-500">
              {stats.lowStockCount > 0
                ? 'Variants under low stock threshold'
                : 'All variant inventory healthy'}
            </p>
          </CardContent>
        </Card>

        {/* Out of Stock */}
        <Card className="border-slate-200/80 hover:border-rose-200 transition-colors shadow-2xs">
          <CardHeader className="p-5 pb-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">
                Out of Stock
              </span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-rose-600 mt-1">
              {stats.outOfStockCount}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <p className="text-xs text-slate-500">
              {stats.outOfStockCount > 0
                ? 'Variants with 0 remaining inventory'
                : 'No items currently depleted'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/products" className="group">
          <Card className="h-full border-slate-200/80 group-hover:border-violet-300 group-hover:shadow-md transition-all">
            <CardHeader className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
              </div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Products &amp; Variants
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                Manage your gadget catalog, specifications, pricing, and images.
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/categories" className="group">
          <Card className="h-full border-slate-200/80 group-hover:border-violet-300 group-hover:shadow-md transition-all">
            <CardHeader className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <Layers className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
              </div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Categories
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                Organize store hierarchy (Smartphones, Laptops, Audio, Wearables).
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/admin/brands" className="group">
          <Card className="h-full border-slate-200/80 group-hover:border-violet-300 group-hover:shadow-md transition-all">
            <CardHeader className="p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <Tag className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
              </div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Brands
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                Manage manufacturers (Apple, Samsung, Sony, Dell, Anker).
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Two Column Layout: Recent Products & Admin Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Products List (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Recently Added Products
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              View all products
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="border-slate-200/80 shadow-2xs overflow-hidden">
            {recentProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No products found in the catalog.</p>
                <Link href="/admin/products/new" className="mt-3 inline-block">
                  <Button size="sm">Add First Product</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentProducts.map((product) => {
                  const primaryImg =
                    product.images?.find((img: any) => img.is_primary)?.image_url ||
                    product.images?.[0]?.image_url ||
                    null;
                  const totalStock = (product.variants || []).reduce(
                    (sum: number, v: any) => sum + (v.stock_quantity || 0),
                    0
                  );

                  return (
                    <div
                      key={product.id}
                      className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0">
                          {primaryImg ? (
                            <img
                              src={primaryImg}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/products/${product.id}`}
                              className="text-sm font-semibold text-slate-900 hover:text-violet-600 truncate transition-colors"
                            >
                              {product.name}
                            </Link>
                            {product.is_featured && (
                              <Badge variant="violet" className="text-[10px] py-0">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span>{product.brand?.name || 'Generic'}</span>
                            <span>•</span>
                            <span>{product.category?.name || 'General'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">
                            {formatNaira(product.base_price)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {totalStock} in stock
                          </p>
                        </div>

                        <Link href={`/admin/products/${product.id}`}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Admin Activity Log (1 col on lg) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Admin Activity
            </h2>
            <Badge variant="secondary" className="text-[10px]">
              Audit Log
            </Badge>
          </div>

          <Card className="border-slate-200/80 shadow-2xs">
            <CardContent className="p-4 space-y-4">
              {recentLogs.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  <Clock className="w-5 h-5 mx-auto mb-1.5 opacity-50" />
                  No recent audit events recorded.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2.5 text-xs">
                      <div className="mt-0.5 p-1 rounded-full bg-violet-50 text-violet-600 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-800 leading-snug">
                          {log.description || log.action}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                          <span>{log.admin?.full_name || 'Admin'}</span>
                          <span>•</span>
                          <span>{formatDate(log.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
