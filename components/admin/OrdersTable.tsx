// ==============================================================================
// 3LINE GADGETS — ADMIN ORDERS MANAGEMENT TABLE COMPONENT
// components/admin/OrdersTable.tsx
// ==============================================================================

'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ExternalLink,
  Building2,
  Copy,
  Check,
  Eye,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  Package,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';
import { formatNaira, formatDate } from '@/lib/utils';
import type { StoredOrder } from '@/lib/orders/store';
import { updateAdminOrderStatusAction } from '@/lib/actions/orders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface OrdersTableProps {
  initialOrders: StoredOrder[];
}

export function OrdersTable({ initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState<StoredOrder[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'successful' | 'failed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isUpdating, startTransition] = useTransition();

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  // Status Updater (e.g. Verify Bank Transfer or Update Dispatch)
  const handleUpdateStatus = (
    orderId: string,
    updates: Partial<Pick<StoredOrder, 'status' | 'payment_status' | 'fulfillment_status'>>
  ) => {
    startTransition(async () => {
      const res = await updateAdminOrderStatusAction(orderId, updates);
      if (res.success && res.order) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? (res.order as StoredOrder) : o))
        );
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(res.order as StoredOrder);
        }
      }
    });
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === '' ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tracking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'all' || order.payment_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search by order #, tracking code, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-2xl border-slate-200 focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10 text-xs sm:text-sm"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 hover:text-amber-900'
            }`}
          >
            Pending Verification ({orders.filter((o) => o.payment_status === 'pending').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('successful')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              statusFilter === 'successful'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            Verified ({orders.filter((o) => o.payment_status === 'successful').length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">No Orders Found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? `No orders matching "${searchQuery}". Try searching with another phone or tracking reference.`
                : 'When customers place orders with manual bank transfer, they will instantly appear here for payment verification.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 sm:px-6">Order &amp; Tracking</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Bank Transferred To</th>
                  <th className="py-3.5 px-4">Total (NGN)</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Order Number & Tracking Code */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-black text-slate-900 font-mono flex items-center gap-1.5">
                          <span>{order.order_number}</span>
                        </div>
                        <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-mono text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                          <span>{order.tracking_code}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(order.tracking_code)}
                            className="hover:text-violet-900"
                            title="Copy tracking code"
                          >
                            {copiedText === order.tracking_code ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-violet-500" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                        <span className="font-semibold block text-slate-900">
                          {new Date(order.created_at).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(order.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4 min-w-[140px]">
                        <p className="font-bold text-slate-900 leading-snug">{order.customer.full_name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{order.customer.phone}</p>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[180px]">
                          {order.customer.city}, {order.customer.state}
                        </span>
                      </td>

                      {/* Bank Details */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-800 block">
                          {order.bank_details.bank_name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {order.bank_details.account_number}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4">
                        <span className="font-black text-slate-900 text-sm">
                          {formatNaira(order.total_amount)}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </span>
                      </td>

                      {/* Payment Status Badge */}
                      <td className="py-4 px-4">
                        {order.payment_status === 'successful' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        ) : order.payment_status === 'failed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200/60">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Failed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/60">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending Transfer</span>
                          </span>
                        )}
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-4 px-4">
                        <span className="capitalize font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full text-[11px]">
                          {order.fulfillment_status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right space-x-1.5 whitespace-nowrap">
                        {order.payment_status === 'pending' && (
                          <Button
                            size="sm"
                            disabled={isUpdating}
                            onClick={() =>
                              handleUpdateStatus(order.id, {
                                payment_status: 'successful',
                                status: 'processing',
                              })
                            }
                            className="h-8 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer"
                            title="Verify bank credit and mark payment as received"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Verify Payment
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 px-2.5 rounded-xl border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700 font-bold text-[11px] cursor-pointer"
                        >
                          <Eye className="w-3 h-3 mr-1 text-violet-600" />
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Order Details Modal / Drawer */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-manrope">
                  Order Inspection
                </span>
                <h3 className="text-xl font-black text-slate-900 font-montserrat">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-sm font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Quick Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Tracking Code
                </span>
                <span className="font-mono font-bold text-violet-700 truncate block mt-0.5">
                  {selectedOrder.tracking_code}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Payment Status
                </span>
                <span className="font-bold capitalize text-slate-900 block mt-0.5">
                  {selectedOrder.payment_status}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Fulfillment
                </span>
                <span className="font-bold capitalize text-slate-900 block mt-0.5">
                  {selectedOrder.fulfillment_status}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Total Amount
                </span>
                <span className="font-black text-slate-900 block mt-0.5">
                  {formatNaira(selectedOrder.total_amount)}
                </span>
              </div>
            </div>

            {/* Customer & Bank Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-violet-600" />
                  <span>Customer &amp; Shipping</span>
                </h4>
                <p className="font-bold text-slate-900">{selectedOrder.customer.full_name}</p>
                <p className="text-slate-600">{selectedOrder.customer.email}</p>
                <p className="text-slate-600">{selectedOrder.customer.phone}</p>
                <p className="text-slate-700 font-medium pt-1">
                  {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.state}
                </p>
                {selectedOrder.customer.note && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200/60 mt-2">
                    Note: {selectedOrder.customer.note}
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-100 space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-violet-600" />
                  <span>Bank Transfer Details</span>
                </h4>
                <p className="font-bold text-slate-900">{selectedOrder.bank_details.bank_name}</p>
                <p className="text-slate-600">
                  Account Number: <strong className="font-mono text-slate-900">{selectedOrder.bank_details.account_number}</strong>
                </p>
                <p className="text-slate-600">
                  Account Name: {selectedOrder.bank_details.account_name}
                </p>
                <p className="text-violet-800 font-black pt-1">
                  Payment Method: Manual Bank Transfer
                </p>
              </div>
            </div>

            {/* Items in order */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-manrope">
                Purchased Gadgets ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2 bg-white">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-2.5 px-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{item.product_name}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.variant_name || 'Standard'} • SKU: {item.sku} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-black text-slate-900">
                      {formatNaira(item.total_price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Status Modifiers */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
              {selectedOrder.payment_status === 'pending' && (
                <Button
                  size="sm"
                  disabled={isUpdating}
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, {
                      payment_status: 'successful',
                      status: 'processing',
                    })
                  }
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Confirm Payment Received
                </Button>
              )}

              {selectedOrder.fulfillment_status === 'unfulfilled' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, {
                      fulfillment_status: 'processing',
                      status: 'processing',
                    })
                  }
                  className="rounded-xl border-slate-200 text-xs font-bold"
                >
                  Mark Processing
                </Button>
              )}

              {selectedOrder.fulfillment_status !== 'shipped' && selectedOrder.fulfillment_status !== 'delivered' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, {
                      fulfillment_status: 'shipped',
                      status: 'shipped',
                    })
                  }
                  className="rounded-xl border-slate-200 text-xs font-bold"
                >
                  Mark Dispatched / Shipped
                </Button>
              )}

              {selectedOrder.fulfillment_status !== 'delivered' && (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isUpdating}
                  onClick={() =>
                    handleUpdateStatus(selectedOrder.id, {
                      fulfillment_status: 'delivered',
                      status: 'delivered',
                    })
                  }
                  className="rounded-xl border-slate-200 text-xs font-bold"
                >
                  Mark Delivered
                </Button>
              )}

              <Link
                href={`/track-order?code=${encodeURIComponent(selectedOrder.tracking_code)}`}
                target="_blank"
                className="ml-auto"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-violet-600 hover:text-violet-700 text-xs font-bold"
                >
                  Open in Public Tracker
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
