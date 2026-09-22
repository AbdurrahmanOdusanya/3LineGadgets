// ==============================================================================
// 3LINE GADGETS — ADMIN DASHBOARD (OVERVIEW)
// app/admin/page.tsx
// Inspired by modern dashboard reference layout with purple/white/black palette
// ==============================================================================

import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/session';
import {
  getInventoryStats,
  getRecentAdminActivityLogs,
} from '@/lib/actions/admin-inventory';
import { getAdminProducts } from '@/lib/actions/admin-products';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminRevenueChart } from '@/components/admin/AdminRevenueChart';
import {
  Package,
  Layers,
  Tag,
  Boxes,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Zap,
} from 'lucide-react';
import { formatNaira, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const { profile } = await requireAdmin('/admin');

  // Fetch dashboard data in parallel
  const [stats, recentProductsResult, recentLogs] = await Promise.all([
    getInventoryStats(),
    getAdminProducts({ limit: 5 }),
    getRecentAdminActivityLogs(5),
  ]);

  const recentProducts = recentProductsResult.products;
  const adminFirstName = profile.full_name?.split(' ')[0] || 'Admin';

  // Fast-moving category items (mirroring the right card in reference screenshot)
  const categoryHighlights = [
    {
      name: 'Smartphones & Foldables',
      icon: Smartphone,
      color: 'bg-violet-600 text-white',
      units: '142 units in stock',
      rating: '★ 4.9/5',
      status: 'Fast Moving',
      href: '/admin/products?category=smartphones',
    },
    {
      name: 'Laptops & MacBooks',
      icon: Laptop,
      color: 'bg-emerald-600 text-white',
      units: '89 units in stock',
      rating: '★ 4.9/5',
      status: 'Active',
      href: '/admin/products?category=laptops',
    },
    {
      name: 'Pro Audio & AirPods',
      icon: Headphones,
      color: 'bg-cyan-600 text-white',
      units: '77 units in stock',
      rating: '★ 4.8/5',
      status: 'Active',
      href: '/admin/products?category=audio',
    },
    {
      name: 'Smartwatches & Fitness',
      icon: Watch,
      color: 'bg-amber-600 text-white',
      units: '54 units in stock',
      rating: '★ 4.8/5',
      status: 'Active',
      href: '/admin/products?category=wearables',
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Welcome Section (Mirrors Reference Layout) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-montserrat">
            Hi, {adminFirstName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium font-manrope mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your 3Line Gadgets store today.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button className="h-11 px-5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/20 cursor-pointer flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </Link>
          <Link href="/admin/inventory">
            <Button
              variant="outline"
              className="h-11 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm shadow-2xs cursor-pointer flex items-center gap-2"
            >
              <Boxes className="w-4 h-4 text-violet-600" />
              <span>Adjust Stock</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top 4 Metric Cards (Mirrors Reference Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Primary Featured Card (Purple Solid Card like Screenshot) */}
        <div className="relative rounded-3xl bg-violet-600 p-6 text-white shadow-xl shadow-violet-600/20 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xs text-white">
              <Package className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-xs">
              <TrendingUp className="h-3 w-3" />
              +12.5%
            </span>
          </div>

          <div className="mt-6">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight font-montserrat text-white">
              {stats.totalProducts}
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-violet-100">
              Active Catalog Gadgets
            </p>
          </div>
        </div>

        {/* Card 2: Units in Stock */}
        <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Layers className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
              <TrendingUp className="h-3 w-3" />
              +8.2%
            </span>
          </div>

          <div className="mt-6">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight font-montserrat text-slate-900">
              {stats.totalStockUnits.toLocaleString()}
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              Units in Inventory
            </p>
          </div>
        </Card>

        {/* Card 3: In-Stock Health & Fulfillment */}
        <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200/60">
              <TrendingUp className="h-3 w-3" />
              +3.7%
            </span>
          </div>

          <div className="mt-6">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight font-montserrat text-slate-900">
              98.4%
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              Fulfillment Health
            </p>
          </div>
        </Card>

        {/* Card 4: Restock Priority Items */}
        <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 border border-amber-200/60">
              {stats.outOfStockCount} Depleted
            </span>
          </div>

          <div className="mt-6">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight font-montserrat text-slate-900">
              {stats.lowStockCount + stats.outOfStockCount}
            </h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              Restock Priority Items
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Main Dashboard Grid: Revenue Performance (Left) + Top Performers (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Revenue Chart */}
        <div className="lg:col-span-2">
          <AdminRevenueChart />
        </div>

        {/* Right Column (1 Col): Fast Moving Categories & Quick Optimization (Mirrors Screenshot AI Agents Card) */}
        <div className="flex flex-col">
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs p-6 flex flex-col justify-between h-full">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-black text-slate-900 tracking-tight font-montserrat">
                  Fast-Moving Categories
                </h3>
                <Link
                  href="/admin/inventory"
                  className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* List of Category Streamers */}
              <div className="mt-4 space-y-3.5">
                {categoryHighlights.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/40 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${cat.color} shadow-xs`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-violet-700 truncate transition-colors">
                            {cat.name}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                            <span>{cat.units}</span>
                            <span>•</span>
                            <span className="text-amber-600">{cat.rating}</span>
                          </div>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        ● {cat.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Full-Width CTA Button (Mirrors Screenshot 'Optimize AI Performance' Button) */}
            <div className="pt-6 mt-4 border-t border-slate-100">
              <Link href="/admin/inventory">
                <Button className="w-full h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/20 cursor-pointer flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Optimize Inventory &amp; Restock</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Lower Two-Column Section: Recently Added Products & Audit Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Products List (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight font-montserrat">
                Recently Added Gadgets
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Latest hardware added to Lagos and interstate stock
              </p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              View all products
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {recentProducts.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-slate-600">No products found in the catalog.</p>
                <Link href="/admin/products/new" className="mt-3 inline-block">
                  <Button size="sm" className="rounded-xl font-bold bg-violet-600 text-white">
                    Add First Product
                  </Button>
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
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0">
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
                              className="text-xs sm:text-sm font-bold text-slate-900 hover:text-violet-600 truncate transition-colors"
                            >
                              {product.name}
                            </Link>
                            {product.is_featured && (
                              <span className="text-[10px] font-bold text-violet-700 bg-violet-50 border border-violet-200/70 px-2 py-0.5 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                            <span>{product.brand?.name || 'Generic'}</span>
                            <span>•</span>
                            <span>{product.category?.name || 'General'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            {formatNaira(product.base_price)}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-500">
                            {totalStock} in stock
                          </p>
                        </div>

                        <Link href={`/admin/products/${product.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-slate-200 hover:border-violet-300 font-bold text-xs"
                          >
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
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight font-montserrat">
                Admin Activity
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Real-time security &amp; inventory audit
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
              Audit Trail
            </span>
          </div>

          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs p-5">
            {recentLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <Clock className="w-5 h-5 mx-auto mb-1.5 opacity-50" />
                No recent audit events recorded.
              </div>
            ) : (
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs">
                    <div className="mt-0.5 p-1 rounded-xl bg-violet-50 text-violet-600 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 leading-snug">
                        {log.description || log.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                        <span>{log.admin?.full_name || 'Admin'}</span>
                        <span>•</span>
                        <span>{formatDate(log.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
