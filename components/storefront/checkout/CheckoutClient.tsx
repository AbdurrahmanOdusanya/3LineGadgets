// ==============================================================================
// 3LINE GADGETS — MANUAL BANK TRANSFER CHECKOUT COMPONENT
// components/storefront/checkout/CheckoutClient.tsx
// ==============================================================================

'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import {
  getRandomBankAccount,
  CONFIGURED_BANK_ACCOUNTS,
  type BankAccountDetails,
} from '@/lib/config/bank-accounts';
import { createManualTransferOrder } from '@/lib/actions/orders';
import type { StoredOrder } from '@/lib/orders/store';
import { formatNaira } from '@/lib/utils';
import {
  CreditCard,
  Building2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Truck,
  ShieldCheck,
  Package,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Clock,
  Sparkles,
  MapPin,
  ExternalLink,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Nigerian States with Courier Shipping Fee Structure
const NIGERIAN_STATES = [
  { name: 'Lagos', fee: 3000, region: 'Intra-State Fast Delivery (24-48 hrs)' },
  { name: 'Abuja (FCT)', fee: 6500, region: 'Interstate Tracked Dispatch (2-4 days)' },
  { name: 'Rivers (Port Harcourt)', fee: 6500, region: 'Interstate Tracked Dispatch (2-4 days)' },
  { name: 'Ogun', fee: 4500, region: 'Regional Tracked Dispatch (1-3 days)' },
  { name: 'Oyo (Ibadan)', fee: 4500, region: 'Regional Tracked Dispatch (1-3 days)' },
  { name: 'Enugu', fee: 6500, region: 'Interstate Tracked Dispatch (2-4 days)' },
  { name: 'Delta', fee: 6500, region: 'Interstate Tracked Dispatch (2-4 days)' },
  { name: 'Kano', fee: 7500, region: 'Interstate Tracked Dispatch (3-5 days)' },
  { name: 'Kaduna', fee: 7500, region: 'Interstate Tracked Dispatch (3-5 days)' },
  { name: 'Edo (Benin)', fee: 6000, region: 'Interstate Tracked Dispatch (2-4 days)' },
  { name: 'Anambra (Onitsha/Awka)', fee: 6500, region: 'Interstate Tracked Dispatch (2-4 days)' },
  { name: 'Akwa Ibom (Uyo)', fee: 7000, region: 'Interstate Tracked Dispatch (3-5 days)' },
  { name: 'Cross River (Calabar)', fee: 7000, region: 'Interstate Tracked Dispatch (3-5 days)' },
  { name: 'Imo (Owerri)', fee: 6500, region: 'Interstate Tracked Dispatch (2-4 days)' },
  { name: 'Abia (Aba/Umuahia)', fee: 6500, region: 'Interstate Tracked Dispatch (2-4 days)' },
  { name: 'Kwara (Ilorin)', fee: 5500, region: 'Interstate Tracked Dispatch (2-4 days)' },
  { name: 'Osun', fee: 5000, region: 'Interstate Tracked Dispatch (2-4 days)' },
  { name: 'Ondo', fee: 5000, region: 'Interstate Tracked Dispatch (2-4 days)' },
  { name: 'Plateau (Jos)', fee: 7500, region: 'Interstate Tracked Dispatch (3-5 days)' },
  { name: 'Other States (Nationwide)', fee: 7500, region: 'Interstate Tracked Dispatch (3-5 days)' },
];

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, clearCart, addToCart, isLoading: isCartLoading } = useCart();

  // Selected test bank account (randomized lazily on client mount)
  const [bankAccount, setBankAccount] = useState<BankAccountDetails>(() => getRandomBankAccount());

  // Customer Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Lagos');
  const [customerNote, setCustomerNote] = useState('');

  // UI status states
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(false);
  const [copiedTrackingCode, setCopiedTrackingCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submitting & Double-click prevention
  const [isPending, startTransition] = useTransition();
  const isSubmittingRef = useRef(false);

  // Completed order state
  const [placedOrder, setPlacedOrder] = useState<StoredOrder | null>(null);

  // Calculate dynamic shipping fee based on selected state
  const currentStateObj = NIGERIAN_STATES.find((s) => s.name === state) || NIGERIAN_STATES[0];
  const shippingFee = items.length > 0 ? currentStateObj.fee : 0;
  const totalAmount = subtotal + shippingFee;

  // Copy helper with feedback
  const handleCopy = (text: string, type: 'account' | 'amount' | 'order' | 'tracking') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'account') {
        setCopiedAccount(true);
        setTimeout(() => setCopiedAccount(false), 2500);
      } else if (type === 'amount') {
        setCopiedAmount(true);
        setTimeout(() => setCopiedAmount(false), 2500);
      } else if (type === 'order') {
        setCopiedOrderNumber(true);
        setTimeout(() => setCopiedOrderNumber(false), 2500);
      } else if (type === 'tracking') {
        setCopiedTrackingCode(true);
        setTimeout(() => setCopiedTrackingCode(false), 2500);
      }
    }
  };

  // Submit Handler for "I've Made the Payment"
  const handlePaymentSubmitted = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Guard duplicate submissions
    if (isSubmittingRef.current || isPending) {
      return;
    }

    // Basic Client Validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your recipient full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address for dispatch updates.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please provide a valid phone number (e.g. 08012345678).');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please provide your physical street or house delivery address.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your city / locality.');
      return;
    }
    if (items.length === 0) {
      setErrorMessage('Your shopping cart is empty.');
      return;
    }

    isSubmittingRef.current = true;

    startTransition(async () => {
      try {
        const orderPayload = {
          customer: {
            fullName,
            email,
            phone,
            address,
            city,
            state,
            note: customerNote,
          },
          bankDetails: {
            bankName: bankAccount.bankName,
            accountNumber: bankAccount.accountNumber,
            accountName: bankAccount.accountName,
          },
          items: items.map((it) => ({
            productId: it.productId,
            variantId: it.variantId,
            name: it.name,
            variantName: it.variantName,
            sku: it.sku,
            price: it.price,
            quantity: it.quantity,
            imageUrl: it.image,
          })),
          subtotal,
          shippingFee,
          totalAmount,
        };

        const result = await createManualTransferOrder(orderPayload);

        if (!result.success || !result.order) {
          setErrorMessage(result.error || 'Failed to place order. Please try again.');
          isSubmittingRef.current = false;
          return;
        }

        // Successfully created order!
        setPlacedOrder(result.order);
        // Clear shopping cart
        await clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err: any) {
        setErrorMessage(err?.message || 'A network error occurred. Please check your connection.');
      } finally {
        isSubmittingRef.current = false;
      }
    });
  };

  // ============================================================================
  // SCREEN 1: SUCCESSFUL ORDER CONFIRMATION VIEW
  // ============================================================================
  if (placedOrder) {
    return (
      <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 sm:p-10 space-y-8">
          {/* Header Badge */}
          <div className="text-center space-y-3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              Payment Notification Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-montserrat">
              Order Confirmed &amp; Queued!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium font-manrope leading-relaxed">
              Thank you, <strong className="text-slate-900">{placedOrder.customer.full_name}</strong>! Your order has been registered in our database. Our audit team is verifying your bank transfer.
            </p>
          </div>

          {/* Key Reference Cards: Order Number & Tracking Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Order Number */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-manrope">
                  Order Number
                </span>
                <p className="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tight mt-1">
                  {placedOrder.order_number}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(placedOrder.order_number, 'order')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs w-full"
              >
                {copiedOrderNumber ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Order Number</span>
                  </>
                )}
              </button>
            </div>

            {/* Tracking Code */}
            <div className="p-4 sm:p-5 rounded-2xl bg-violet-50/80 border border-violet-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700 block font-manrope">
                    Dispatch Tracking Code
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-200/60 text-violet-900">
                    Live
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-black text-violet-900 font-mono tracking-tight mt-1">
                  {placedOrder.tracking_code}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(placedOrder.tracking_code, 'tracking')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-violet-200 bg-white hover:bg-violet-50 text-violet-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs w-full"
              >
                {copiedTrackingCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-violet-600" />
                    <span className="text-violet-800">Copied Tracking Code!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-violet-600" />
                    <span>Copy Tracking Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Transfer & Delivery Summary */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Transferred To:</span>
              <span className="font-bold text-slate-900 text-right">
                {placedOrder.bank_details.bank_name} • {placedOrder.bank_details.account_number}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Total Transferred:</span>
              <span className="font-black text-violet-700 text-sm">
                {formatNaira(placedOrder.total_amount)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Payment Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                <Clock className="w-3 h-3" />
                <span>Pending Admin Verification</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500">Delivery Address:</span>
              <span className="font-medium text-slate-800 text-right max-w-xs truncate">
                {placedOrder.customer.address}, {placedOrder.customer.city}, {placedOrder.customer.state}
              </span>
            </div>
          </div>

          {/* Purchased Items Snapshot */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-manrope">
              Order Items ({placedOrder.items.length})
            </h3>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2 bg-white">
              {placedOrder.items.map((item) => (
                <div key={item.id} className="py-2.5 px-3 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{item.product_name}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.variant_name || 'Standard'} • Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {formatNaira(item.total_price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/track-order?code=${encodeURIComponent(placedOrder.tracking_code)}`}
              className="flex-1"
            >
              <Button className="w-full h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/20 cursor-pointer flex items-center justify-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Track This Order Live</span>
              </Button>
            </Link>

            <Link href="/shop" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer"
              >
                <span>Continue Shopping</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // EMPTY CART CHECK
  // ============================================================================
  if (!isCartLoading && items.length === 0) {
    const handleAddSampleGadget = async () => {
      await addToCart(
        {
          id: 'da000000-0000-0000-0000-000000000001',
          name: 'Apple iPhone 16 Pro Max',
          slug: 'iphone-16-pro-max',
          base_price: 1950000,
          is_active: true,
          category: { id: 'ca000000-0000-0000-0000-000000000001', name: 'Smartphones & Tablets', slug: 'smartphones-tablets' },
          brand: { id: 'ba000000-0000-0000-0000-000000000001', name: 'Apple', slug: 'apple' },
          variants: [
            {
              id: 'ea000000-0000-0000-0000-000000000001',
              name: 'Natural Titanium / 256GB',
              sku: '3LG-IP16PM-NT-256',
              price: 1950000,
              stock_quantity: 15,
              is_active: true,
            },
          ],
          images: [
            {
              id: 'fa000000-0000-0000-0000-000000000001',
              image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
              is_primary: true,
              sort_order: 1,
            },
          ],
        } as any,
        {
          id: 'ea000000-0000-0000-0000-000000000001',
          name: 'Natural Titanium / 256GB',
          sku: '3LG-IP16PM-NT-256',
          price: 1950000,
          stock_quantity: 15,
          is_active: true,
        } as any,
        1
      );
    };

    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 font-montserrat tracking-tight">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto font-medium font-manrope">
          Add authentic imported smartphones, MacBooks, or studio audio gadgets to proceed to manual bank transfer checkout.
        </p>
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={handleAddSampleGadget}
            className="h-11 px-5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/20 cursor-pointer w-full sm:w-auto"
          >
            Add iPhone 16 Pro Max to Checkout
          </Button>
          <Link href="/shop" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="h-11 px-5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer w-full sm:w-auto"
            >
              Browse Catalog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ============================================================================
  // SCREEN 2: ACTIVE CHECKOUT FORM & BANK TRANSFER DISPLAY
  // ============================================================================
  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Breadcrumb & Page Title */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
          <Link href="/cart" className="hover:text-violet-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" />
            <span>Back to Shopping Cart</span>
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Manual Bank Transfer Checkout</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-montserrat">
          Secure Bank Transfer Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium font-manrope mt-1">
          Make a direct transfer to 3Line Gadgets verified merchant bank account with instant automated tracking code generation.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handlePaymentSubmitted} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* ==================================================================== */}
        {/* LEFT COLUMN: CUSTOMER DETAILS & DELIVERY ADDRESS (7 COLS)             */}
        {/* ==================================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer & Shipping Information */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs p-6 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 font-montserrat tracking-tight">
                  1. Recipient &amp; Delivery Destination
                </h2>
                <p className="text-xs text-slate-500 font-medium font-manrope">
                  Enter your address for tracked dispatch in Nigeria
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block font-manrope">
                  Full Name / Contact Person *
                </label>
                <Input
                  required
                  placeholder="e.g. Babatunde Adeleke"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isPending}
                  className="rounded-xl border-slate-200 h-11 text-xs sm:text-sm focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block font-manrope">
                    Email Address (For Receipt &amp; Code) *
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                    className="rounded-xl border-slate-200 h-11 text-xs sm:text-sm focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block font-manrope">
                    Phone Number (Calls &amp; WhatsApp) *
                  </label>
                  <Input
                    type="tel"
                    required
                    placeholder="e.g. 0802 345 6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isPending}
                    className="rounded-xl border-slate-200 h-11 text-xs sm:text-sm focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10"
                  />
                </div>
              </div>

              {/* Physical Street Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 block font-manrope">
                  Delivery Street Address *
                </label>
                <Input
                  required
                  placeholder="House/Plot number, Street name, Estate / Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isPending}
                  className="rounded-xl border-slate-200 h-11 text-xs sm:text-sm focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10"
                />
              </div>

              {/* City & State Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block font-manrope">
                    City / Town *
                  </label>
                  <Input
                    required
                    placeholder="e.g. Ikeja, Lekki, Wuse 2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isPending}
                    className="rounded-xl border-slate-200 h-11 text-xs sm:text-sm focus-visible:border-violet-600 focus-visible:ring-4 focus-visible:ring-violet-500/10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800 block font-manrope">
                    State (Select for Courier Fee) *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={isPending}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 h-11 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 shadow-2xs transition-all cursor-pointer"
                  >
                    {NIGERIAN_STATES.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} — {formatNaira(s.fee)} ({s.region})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delivery Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block font-manrope">
                  Special Delivery Instructions / Gate Code (Optional)
                </label>
                <Input
                  placeholder="e.g. Leave with building security if unavailable"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  disabled={isPending}
                  className="rounded-xl border-slate-200 h-11 text-xs sm:text-sm"
                />
              </div>
            </div>
          </Card>

          {/* Cart Items Overview */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 font-montserrat tracking-tight">
                Review Cart Items ({items.length})
              </h2>
              <Link
                href="/cart"
                className="text-xs font-bold text-violet-600 hover:text-violet-700"
              >
                Modify Cart
              </Link>
            </div>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {item.variantName || 'Standard'} • Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-slate-900 shrink-0">
                    {formatNaira(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN: RANDOMLY SELECTED BANK DETAILS & PAYMENT BUTTON (5 COLS)*/}
        {/* ==================================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* Bank Transfer Details Card */}
          <div className="rounded-3xl border-2 border-violet-600 bg-gradient-to-b from-white to-violet-50/40 p-6 shadow-xl shadow-violet-500/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-violet-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-xs">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 font-montserrat tracking-tight">
                    2. Pay via Bank Transfer
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    ● Instant Verification
                  </span>
                </div>
              </div>

              {/* Refresh / Switch Random Bank */}
              <button
                type="button"
                onClick={() => setBankAccount(getRandomBankAccount())}
                className="text-[11px] font-bold text-violet-600 hover:text-violet-800 flex items-center gap-1 p-1 rounded-lg hover:bg-violet-100/50 transition-colors cursor-pointer"
                title="Switch to another configured bank account"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Switch Bank</span>
              </button>
            </div>

            {/* Total Amount to Pay Banner */}
            <div className="p-4 rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-600/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-200 block font-manrope">
                  Exact Amount to Transfer
                </span>
                <span className="text-2xl sm:text-3xl font-black font-montserrat tracking-tight">
                  {formatNaira(totalAmount)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(totalAmount.toString(), 'amount')}
                aria-label="Copy exact amount"
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer backdrop-blur-xs shrink-0"
              >
                {copiedAmount ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Amount</span>
                  </>
                )}
              </button>
            </div>

            {/* Configured Random Bank Account Information */}
            <div className="rounded-2xl border border-violet-200/80 bg-white p-5 space-y-4 shadow-2xs">
              {/* Bank Name */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-manrope">
                  Bank Name
                </span>
                <p className="text-sm font-black text-slate-900 mt-0.5">
                  {bankAccount.bankName}
                </p>
              </div>

              {/* Account Number with Copy Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-manrope">
                    Account Number (10 Digits)
                  </span>
                  <p className="text-xl sm:text-2xl font-black text-violet-900 font-mono tracking-wider mt-0.5">
                    {bankAccount.accountNumber}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(bankAccount.accountNumber, 'account')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs ${
                    copiedAccount
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                      : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/20 active:scale-95'
                  }`}
                >
                  {copiedAccount ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>

              {/* Account Name */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-manrope">
                  Account Name
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                  {bankAccount.accountName}
                </p>
                {bankAccount.notes && (
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    ℹ️ {bankAccount.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal ({items.length} gadgets):</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Nationwide Courier ({state}):</span>
                <span>{formatNaira(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-violet-100">
                <span>Total Amount:</span>
                <span className="text-violet-700">{formatNaira(totalAmount)}</span>
              </div>
            </div>

            {/* Primary Action Button: "I've Made the Payment" */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 rounded-2xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-black text-sm sm:text-base shadow-xl shadow-violet-600/30 transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="flex items-center gap-2.5">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Generating Tracking Code...</span>
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>I&apos;ve Made the Payment</span>
                  </>
                )}
              </Button>
              <p className="text-[11px] text-slate-500 text-center font-medium mt-2">
                Clicking confirms transfer sent. Unique dispatch tracking code generated immediately.
              </p>
            </div>

            {/* Trust Assurance Badge */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-100 flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>100% Guaranteed factory seal warranty with tracked nationwide courier dispatch.</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
