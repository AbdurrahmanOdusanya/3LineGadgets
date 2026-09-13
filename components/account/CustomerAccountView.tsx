// ==============================================================================
// 3LINE GADGETS — CUSTOMER ACCOUNT DASHBOARD (CLIENT COMPONENT)
// components/account/CustomerAccountView.tsx
// ==============================================================================

'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Shield,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Save,
  ShoppingBag,
  ArrowRight,
  Phone,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatNaira, formatDate } from '@/lib/utils';
import { signOutAction } from '@/lib/auth/actions';
import {
  updateCustomerProfile,
  addCustomerAddress,
  deleteCustomerAddress,
  type CustomerOrder,
  type CustomerAddress,
} from '@/lib/actions/account';

interface CustomerAccountViewProps {
  user: {
    id: string;
    email?: string;
  };
  profile: {
    id: string;
    full_name: string | null;
    phone: string | null;
    role: string;
    avatar_url: string | null;
    created_at: string;
  };
  orders: CustomerOrder[];
  addresses: CustomerAddress[];
  initialTab?: string;
}

export function CustomerAccountView({
  user,
  profile,
  orders,
  addresses,
  initialTab = 'overview',
}: CustomerAccountViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'profile'>(
    (initialTab as any) || 'overview'
  );

  // Profile Form State
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [phone, setPhone] = useState(profile.phone || '');
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingProfile, startUpdateProfile] = useTransition();

  // Address Form State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    fullName: profile.full_name || '',
    phone: profile.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: 'Ikeja',
    state: 'Lagos',
    postalCode: '',
    isDefault: true,
  });
  const [addressMsg, setAddressMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isAddingAddress, startAddAddress] = useTransition();

  // Sign out transition
  const [isSigningOut, startSignOut] = useTransition();

  const handleSignOut = () => {
    startSignOut(async () => {
      await signOutAction();
      router.push('/');
      router.refresh();
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    startUpdateProfile(async () => {
      const res = await updateCustomerProfile({ fullName, phone });
      if (res.success) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        router.refresh();
      } else {
        setProfileMsg({ type: 'error', text: res.error || 'Failed to update profile' });
      }
    });
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressMsg(null);
    startAddAddress(async () => {
      const res = await addCustomerAddress(newAddress);
      if (res.success) {
        setShowAddressModal(false);
        setNewAddress({
          label: 'Home',
          fullName: profile.full_name || '',
          phone: profile.phone || '',
          addressLine1: '',
          addressLine2: '',
          city: 'Ikeja',
          state: 'Lagos',
          postalCode: '',
          isDefault: false,
        });
        router.refresh();
      } else {
        setAddressMsg({ type: 'error', text: res.error || 'Failed to add address' });
      }
    });
  };

  const handleDeleteAddress = (id: string) => {
    if (!confirm('Are you sure you want to remove this delivery address?')) return;
    startAddAddress(async () => {
      await deleteCustomerAddress(id);
      router.refresh();
    });
  };

  const isAdmin = profile.role === 'admin' || profile.role === 'super_admin';

  return (
    <div className="space-y-8">
      {/* Top Banner Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-violet-500/20 shrink-0">
            {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {profile.full_name || 'Valued Customer'}
              </h1>
              <Badge variant={isAdmin ? 'violet' : 'outline'} className="capitalize">
                {profile.role.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.email}</span>
              {profile.phone && (
                <>
                  <span>•</span>
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.phone}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {isAdmin && (
            <Link href="/admin">
              <Button variant="subtle" size="sm" className="font-semibold cursor-pointer">
                <Shield className="w-4 h-4 mr-1.5 text-violet-600" />
                Admin Console
              </Button>
            </Link>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-slate-600 hover:text-rose-600 hover:border-rose-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
          </Button>
        </div>
      </div>

      {/* Main Content Layout with Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs space-y-1">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-violet-50 text-violet-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>Account Overview</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-violet-50 text-violet-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Orders &amp; Tracking</span>
            </div>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-bold">
              {orders.length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-violet-50 text-violet-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4" />
              <span>Delivery Addresses</span>
            </div>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-bold">
              {addresses.length}
            </Badge>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-violet-50 text-violet-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Save className="w-4 h-4" />
              <span>Profile Settings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          </button>
        </div>

        {/* Tab Panels */}
        <div className="lg:col-span-3">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-slate-200/80 shadow-2xs">
                  <CardHeader className="p-4 pb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Total Orders
                    </span>
                    <CardTitle className="text-2xl font-black text-slate-900 mt-1">
                      {orders.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-slate-500">
                    Lifetime gadget purchases
                  </CardContent>
                </Card>

                <Card className="border-slate-200/80 shadow-2xs">
                  <CardHeader className="p-4 pb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Saved Addresses
                    </span>
                    <CardTitle className="text-2xl font-black text-slate-900 mt-1">
                      {addresses.length}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-slate-500">
                    Verified delivery destinations
                  </CardContent>
                </Card>

                <Card className="border-slate-200/80 shadow-2xs">
                  <CardHeader className="p-4 pb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Account Status
                    </span>
                    <CardTitle className="text-2xl font-black text-emerald-600 mt-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-5 h-5" />
                      Active
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-slate-500">
                    Standard customer access
                  </CardContent>
                </Card>
              </div>

              {/* Quick Recent Orders */}
              <Card className="border-slate-200/80 shadow-2xs">
                <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Recent Orders
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Your recent purchases and tracking details
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-violet-600 hover:text-violet-700"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-5">
                  {orders.length === 0 ? (
                    <div className="text-center py-8 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800">No orders placed yet</p>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto">
                          Ready to upgrade your gear? Browse our catalog of smartphones, laptops, and audio gear.
                        </p>
                      </div>
                      <Link href="/shop">
                        <Button size="sm" className="mt-2 font-semibold">
                          Explore Gadgets
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-slate-900">
                                #{order.order_number}
                              </span>
                              <Badge variant="outline" className="text-[10px] capitalize">
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500">
                              Placed on {formatDate(order.created_at)}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-sm font-black text-slate-900">
                              {formatNaira(order.total_amount)}
                            </p>
                            <span className="text-[11px] font-semibold text-emerald-600">
                              {order.payment_status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick links card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="border-slate-200/80 shadow-2xs p-5 hover:border-violet-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Shop Authentic Gadgets</h4>
                      <p className="text-xs text-slate-500 mt-0.5 mb-3">
                        Brand new flagship phones, MacBooks, and audio gear with Lagos warranty.
                      </p>
                      <Link href="/shop" className="text-xs font-bold text-violet-600 hover:underline inline-flex items-center gap-1">
                        Go to store catalog &rarr;
                      </Link>
                    </div>
                  </div>
                </Card>

                <Card className="border-slate-200/80 shadow-2xs p-5 hover:border-violet-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">1-Year Warranty &amp; Returns</h4>
                      <p className="text-xs text-slate-500 mt-0.5 mb-3">
                        100% factory sealed hardware with our Otigba Computer Village service desk.
                      </p>
                      <Link href="/#contact" className="text-xs font-bold text-violet-600 hover:underline inline-flex items-center gap-1">
                        Contact support desk &rarr;
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* 2. ORDERS TAB */}
          {activeTab === 'orders' && (
            <Card className="border-slate-200/80 shadow-2xs">
              <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Order History
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Detailed record of your gadget orders and shipping progress
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                {orders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Package className="w-7 h-7" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">No orders found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      You haven&apos;t placed any orders yet. When you check out items from your cart, their tracking numbers and receipts will appear here.
                    </p>
                    <Link href="/shop">
                      <Button size="sm" className="mt-2 font-semibold">
                        Browse Catalog
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-xl border border-slate-200/80 overflow-hidden bg-white"
                      >
                        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-slate-900">
                              Order #{order.order_number}
                            </span>
                            <Badge variant="outline" className="capitalize">
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-slate-500">
                            <span>Placed {formatDate(order.created_at)}</span>
                            <span className="font-black text-slate-900 text-sm">
                              {formatNaira(order.total_amount)}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-xs py-1"
                              >
                                <div>
                                  <p className="font-semibold text-slate-900">{item.product_name}</p>
                                  {item.variant_name && (
                                    <p className="text-slate-500">{item.variant_name}</p>
                                  )}
                                  <p className="text-slate-400 font-mono text-[11px]">Qty: {item.quantity}</p>
                                </div>
                                <span className="font-bold text-slate-800">
                                  {formatNaira(item.total_price)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 italic">No item breakdown available</p>
                          )}

                          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                            <span>
                              Payment: <strong className="capitalize text-slate-800">{order.payment_status}</strong>
                            </span>
                            <span>
                              Fulfillment: <strong className="capitalize text-slate-800">{order.fulfillment_status}</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 3. ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <Card className="border-slate-200/80 shadow-2xs">
              <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Saved Delivery Addresses
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Manage where your authentic gadgets and accessories are delivered
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAddressModal(true)}
                  className="font-semibold text-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Address
                </Button>
              </CardHeader>
              <CardContent className="p-5">
                {addresses.length === 0 ? (
                  <div className="text-center py-10 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">No saved addresses</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Add your default shipping address in Lagos, Abuja, or across Nigeria for fast checkout.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddressModal(true)}
                      className="mt-2 text-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add New Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-4 rounded-xl border border-slate-200 bg-white relative space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-violet-600" />
                            {addr.label || 'Home'}
                          </span>
                          {addr.is_default && (
                            <Badge variant="violet" className="text-[10px]">
                              Default
                            </Badge>
                          )}
                        </div>

                        <p className="font-semibold text-slate-800">{addr.full_name}</p>
                        <p className="text-slate-600">{addr.address_line_1}</p>
                        {addr.address_line_2 && <p className="text-slate-600">{addr.address_line_2}</p>}
                        <p className="text-slate-600">
                          {addr.city}, {addr.state}, {addr.country}
                        </p>
                        <p className="text-slate-500 font-mono text-[11px]">{addr.phone}</p>

                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 4. PROFILE TAB */}
          {activeTab === 'profile' && (
            <Card className="border-slate-200/80 shadow-2xs">
              <CardHeader className="p-5 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900">
                  Profile Settings
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Update your contact details and default account information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                  {profileMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                        profileMsg.type === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {profileMsg.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{profileMsg.text}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Email Address</label>
                    <Input
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="bg-slate-50 text-slate-500 text-xs cursor-not-allowed"
                    />
                    <p className="text-[11px] text-slate-400">
                      Email address is managed by Supabase Authentication.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Full Name</label>
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Olawale Johnson"
                      required
                      className="text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 812 345 6789"
                      className="text-xs"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="font-semibold text-xs cursor-pointer mt-2"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" />
                    <span>{isUpdatingProfile ? 'Saving...' : 'Save Profile Details'}</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add New Delivery Address</h3>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {addressMsg && (
              <div className="p-3 rounded-xl text-xs bg-rose-50 text-rose-700 border border-rose-200">
                {addressMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Address Label</label>
                  <Input
                    type="text"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                    placeholder="Home, Office, etc."
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Recipient Name</label>
                  <Input
                    type="text"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    required
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Contact Phone</label>
                <Input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="+234 812 345 6789"
                  required
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Street Address</label>
                <Input
                  type="text"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                  placeholder="Street name, building, apartment"
                  required
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">City</label>
                  <Input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="e.g. Ikeja"
                    required
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">State</label>
                  <Input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    placeholder="e.g. Lagos"
                    required
                    className="text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="defaultAddressCheck"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                  className="rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                />
                <label htmlFor="defaultAddressCheck" className="text-slate-700 cursor-pointer">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressModal(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isAddingAddress}
                  className="font-semibold cursor-pointer"
                >
                  {isAddingAddress ? 'Saving...' : 'Save Address'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
