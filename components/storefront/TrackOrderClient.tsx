// ==============================================================================
// 3LINE GADGETS — ORDER TRACKING CLIENT COMPONENT
// components/storefront/TrackOrderClient.tsx
// ==============================================================================

'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
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
  Phone,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { formatNaira, formatDate } from '@/lib/utils';

export function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [orderData, setOrderData] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSearching, startSearching] = useTransition();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setErrorMsg(null);
    setSearched(true);

    startSearching(async () => {
      try {
        const cleanNumber = orderNumber.trim().replace(/^#/, '');
        const supabase = createClient();

        let query = (supabase.from('orders') as any)
          .select(`
            id,
            order_number,
            status,
            payment_status,
            fulfillment_status,
            total_amount,
            shipping_address,
            created_at,
            items:order_items (
              id,
              product_name,
              variant_name,
              quantity,
              unit_price,
              total_price
            )
          `)
          .ilike('order_number', `%${cleanNumber}%`);

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.warn('Track order error:', error);
          setErrorMsg('Unable to retrieve tracking information at this moment. Please check your order reference.');
          setOrderData(null);
          return;
        }

        if (!data) {
          setOrderData(null);
        } else {
          setOrderData(data);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error looking up order tracking');
        setOrderData(null);
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Search Header Box */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Dispatch Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Track Your Shipment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Enter your 3Line Gadgets Order Number (e.g. <code>3LG-89214</code> or numbers from your checkout confirmation) to check real-time Lagos &amp; interstate courier delivery status.
          </p>

          <form onSubmit={handleTrack} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Order Number (e.g. 3LG-89214)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                className="pl-10 h-11 text-xs sm:text-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={isSearching || !orderNumber.trim()}
              className="h-11 px-6 font-bold text-xs sm:text-sm cursor-pointer"
            >
              {isSearching ? 'Tracking...' : 'Track Package'}
            </Button>
          </form>
        </div>
      </div>

      {/* Error notification */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Result Display */}
      {searched && !isSearching && orderData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Card className="border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tracking Summary
                </span>
                <h2 className="text-xl font-black mt-0.5 flex items-center gap-2">
                  <span>Order #{orderData.order_number}</span>
                  <Badge variant="violet" className="text-xs uppercase">
                    {orderData.status}
                  </Badge>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Placed on {formatDate(orderData.created_at)} &bull; Total {formatNaira(orderData.total_amount)}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">
                  Delivery Status
                </span>
                <span className="text-sm font-black text-emerald-400 capitalize">
                  {orderData.fulfillment_status || 'Processing shipment'}
                </span>
              </div>
            </div>

            {/* Visual Timeline Steps */}
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Order Confirmed</p>
                    <p className="text-[11px] text-slate-500">Payment verified</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    orderData.fulfillment_status === 'packed' || orderData.fulfillment_status === 'shipped' || orderData.fulfillment_status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Quality Packed</p>
                    <p className="text-[11px] text-slate-500">Ikeja distribution hub</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    orderData.fulfillment_status === 'shipped' || orderData.fulfillment_status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">In Transit</p>
                    <p className="text-[11px] text-slate-500">Dispatched with courier</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    orderData.fulfillment_status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Delivered</p>
                    <p className="text-[11px] text-slate-500">Customer confirmation</p>
                  </div>
                </div>
              </div>

              {/* Items in order */}
              <div className="pt-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Items in this Package
                </h4>
                {orderData.items && orderData.items.length > 0 ? (
                  <div className="space-y-2">
                    {orderData.items.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{item.product_name}</p>
                          {item.variant_name && <p className="text-slate-500">{item.variant_name}</p>}
                          <span className="text-[11px] text-slate-400">Qty: {item.quantity}</span>
                        </div>
                        <span className="font-black text-slate-800">{formatNaira(item.total_price)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Authentic hardware parcel</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty / Not found case */}
      {searched && !isSearching && !orderData && !errorMsg && (
        <Card className="border-slate-200/80 shadow-xs p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No order found for &ldquo;{orderNumber}&rdquo;</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Please double-check your order number. If you just placed your order within the last 5 minutes, our system may still be processing your invoice.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/account?tab=orders">
              <Button size="sm" variant="outline" className="text-xs">
                Check My Account Orders
              </Button>
            </Link>
            <a
              href="https://wa.me/2348123456789"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:underline px-3 py-2"
            >
              <Phone className="w-3.5 h-3.5" />
              WhatsApp Support (+234 812 345 6789)
            </a>
          </div>
        </Card>
      )}

      {/* Support banner */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-violet-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">Direct Lagos Dispatch Hub</p>
            <p className="text-slate-500">Same-day delivery across Lagos, next-day nationwide via verified haulage partners.</p>
          </div>
        </div>
        <Link href="/account">
          <Button variant="outline" size="sm" className="font-semibold text-xs whitespace-nowrap">
            Customer Portal
          </Button>
        </Link>
      </div>
    </div>
  );
}
