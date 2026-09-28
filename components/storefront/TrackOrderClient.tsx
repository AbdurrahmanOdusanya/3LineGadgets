// ==============================================================================
// 3LINE GADGETS — ORDER TRACKING CLIENT COMPONENT
// components/storefront/TrackOrderClient.tsx
// ==============================================================================

'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Copy,
  Check,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatNaira, formatDate } from '@/lib/utils';
import { trackOrderAction } from '@/lib/actions/orders';
import { createClient } from '@/lib/supabase/client';

export function TrackOrderClient() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || searchParams.get('order') || '';

  const [queryInput, setQueryInput] = useState(initialCode);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSearching, startSearching] = useTransition();
  const initialSearchTriggered = useRef(false);

  const executeTrackSearch = (searchRef: string) => {
    if (!searchRef.trim()) return;

    setErrorMsg(null);
    setSearched(true);

    startSearching(async () => {
      try {
        const cleanRef = searchRef.trim().replace(/^#/, '');

        // 1. Try trackOrderAction (checks persistent orders storage and tracking codes)
        const result = await trackOrderAction(cleanRef);
        if (result.success && result.order) {
          setOrderData(result.order);
          return;
        }

        // 2. Fallback query to Supabase orders table
        const supabase = createClient();
        const { data, error } = await (supabase.from('orders') as any)
          .select(`
            id,
            order_number,
            status,
            payment_status,
            fulfillment_status,
            total_amount,
            shipping_address,
            created_at,
            customer_note,
            items:order_items (
              id,
              product_name,
              variant_name,
              quantity,
              unit_price,
              total_price
            )
          `)
          .or(`order_number.ilike.%${cleanRef}%,id.eq.${cleanRef}`)
          .maybeSingle();

        if (error || !data) {
          setErrorMsg(
            result.error ||
              `No order found matching "${cleanRef}". Please verify your order number or tracking code.`
          );
          setOrderData(null);
        } else {
          setOrderData(data);
        }
      } catch (err: any) {
        setErrorMsg(err?.message || 'Error looking up order tracking reference.');
        setOrderData(null);
      }
    });
  };

  // Auto-search if code was passed in URL query param (e.g. from checkout confirmation)
  useEffect(() => {
    if (initialCode && !initialSearchTriggered.current) {
      initialSearchTriggered.current = true;
      executeTrackSearch(initialCode);
    }
  }, [initialCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeTrackSearch(queryInput);
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header Box */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Dispatch Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-montserrat">
            Track Your Gadget Delivery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium font-manrope mt-1">
            Enter your <strong>Tracking Code</strong> (e.g. <code>3LG-TRK-849201</code>) or <strong>Order Number</strong> to view real-time payment verification and dispatch progress across Nigeria.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="e.g. 3LG-TRK-749102 or 3LG-20260928-8921"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="pl-10 h-12 rounded-2xl border-slate-200 focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10 text-xs sm:text-sm shadow-2xs"
            />
          </div>
          <Button
            type="submit"
            disabled={isSearching || !queryInput.trim()}
            className="h-12 px-6 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/20 cursor-pointer shrink-0"
          >
            {isSearching ? 'Checking Database...' : 'Track Package'}
          </Button>
        </form>
      </div>

      {/* Error Message */}
      {searched && errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">No Matching Order Found</p>
            <p className="mt-0.5 text-xs text-rose-700">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {orderData && (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 font-manrope">
                  Order Details
                </span>
                <Badge
                  className={`text-[10px] font-bold capitalize ${
                    orderData.payment_status === 'successful'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  Payment: {orderData.payment_status || 'Pending Verification'}
                </Badge>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-montserrat tracking-tight mt-1 flex items-center gap-2">
                <span>{orderData.order_number}</span>
              </h2>

              {orderData.tracking_code && (
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-xl bg-white/10 text-violet-200 text-xs font-mono">
                  <span>Tracking: {orderData.tracking_code}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(orderData.tracking_code)}
                    className="p-1 hover:text-white"
                    title="Copy tracking code"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              <p className="text-xs text-slate-400 mt-2">
                Placed on {formatDate(orderData.created_at)} • Total {formatNaira(orderData.total_amount)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block font-manrope">
                Fulfillment Stage
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-400 capitalize">
                {orderData.fulfillment_status || 'Under Preparation'}
              </span>
            </div>
          </div>

          {/* Visual Tracking Timeline */}
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
              {/* Step 1: Order & Transfer Notification */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Transfer Received</p>
                  <p className="text-[11px] text-slate-500">Order logged in database</p>
                </div>
              </div>

              {/* Step 2: Quality Inspection & Packing */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    orderData.fulfillment_status === 'packed' ||
                    orderData.fulfillment_status === 'shipped' ||
                    orderData.fulfillment_status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Quality Inspection</p>
                  <p className="text-[11px] text-slate-500">Ikeja logistics warehouse</p>
                </div>
              </div>

              {/* Step 3: Courier Transit */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    orderData.fulfillment_status === 'shipped' ||
                    orderData.fulfillment_status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">With Dispatch Courier</p>
                  <p className="text-[11px] text-slate-500">En route to destination</p>
                </div>
              </div>

              {/* Step 4: Final Handover */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    orderData.fulfillment_status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Doorstep Delivery</p>
                  <p className="text-[11px] text-slate-500">Delivered &amp; inspected</p>
                </div>
              </div>
            </div>

            {/* Destination & Bank Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Delivery Address
                </span>
                <p className="font-bold text-slate-900">
                  {orderData.customer?.full_name || orderData.shipping_address?.full_name || 'Customer'}
                </p>
                <p className="text-slate-600">
                  {orderData.customer?.address || orderData.shipping_address?.address_line_1 || orderData.shipping_address?.address || 'Lagos Address'}
                </p>
                <p className="text-slate-500">
                  {orderData.customer?.city || orderData.shipping_address?.city || ''}, {orderData.customer?.state || orderData.shipping_address?.state || 'Nigeria'}
                </p>
              </div>

              {orderData.bank_details && (
                <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 space-y-1">
                  <span className="font-bold text-violet-700 uppercase tracking-wider text-[10px]">
                    Payment Reference
                  </span>
                  <p className="font-bold text-slate-900">
                    {orderData.bank_details.bank_name}
                  </p>
                  <p className="text-slate-600">
                    Account: {orderData.bank_details.account_number} ({orderData.bank_details.account_name})
                  </p>
                  <p className="text-violet-800 font-bold">
                    Amount: {formatNaira(orderData.total_amount)}
                  </p>
                </div>
              )}
            </div>

            {/* Items in order */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-manrope">
                Gadgets in this Shipment ({orderData.items?.length || 0})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2 bg-white">
                {orderData.items && orderData.items.length > 0 ? (
                  orderData.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{item.product_name}</p>
                        {item.variant_name && <p className="text-slate-500">{item.variant_name}</p>}
                        <span className="text-[11px] text-slate-400">Qty: {item.quantity}</span>
                      </div>
                      <span className="font-black text-slate-800">{formatNaira(item.total_price)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic p-3">Verified gadget package</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
