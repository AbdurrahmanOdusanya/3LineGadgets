// ==============================================================================
// 3LINE GADGETS — ADMIN ORDERS MANAGEMENT PAGE
// app/admin/orders/page.tsx
// ==============================================================================

import type { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth/session';
import { getAllOrders } from '@/lib/orders/store';
import { OrdersTable } from '@/components/admin/OrdersTable';
import { ShoppingBag, Clock, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order Management | 3Line Gadgets Admin',
  description: 'Manage and verify manual bank transfer orders with live tracking.',
};

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  await requireAdmin('/admin/orders');

  const orders = await getAllOrders();
  const pendingOrders = orders.filter((o) => o.payment_status === 'pending');
  const verifiedOrders = orders.filter((o) => o.payment_status === 'successful');

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Metric Highlights */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-montserrat">
            Customer Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium font-manrope mt-1">
            Verify manual bank transfer payments, track dispatch progress, and fulfill orders.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{pendingOrders.length} Pending Verification</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{verifiedOrders.length} Verified</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable initialOrders={orders} />
    </div>
  );
}
