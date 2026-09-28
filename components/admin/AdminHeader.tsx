// ==============================================================================
// 3LINE GADGETS — ADMIN TOP HEADER (RESPONSIVE DESKTOP, TABLET & MOBILE)
// components/admin/AdminHeader.tsx
// ==============================================================================

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Calendar,
  Bell,
  Sparkles,
  ExternalLink,
  Plus,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Boxes,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  userRole?: string;
  adminName?: string | null;
  adminEmail?: string | null;
}

export function AdminHeader({
  onMenuToggle,
  userRole = 'admin',
  adminName,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabletSearchOpen, setTabletSearchOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const tabletInputRef = useRef<HTMLInputElement>(null);

  // Derive current page title
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname === '/admin/products') return 'Products Catalog';
    if (pathname === '/admin/products/new') return 'New Gadget';
    if (pathname.startsWith('/admin/products/')) return 'Edit Gadget';
    if (pathname.startsWith('/admin/categories')) return 'Categories';
    if (pathname.startsWith('/admin/brands')) return 'Brand Partners';
    if (pathname.startsWith('/admin/inventory')) return 'Inventory & Stock';
    return 'Admin';
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/auth/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setTabletSearchOpen(false);
    }
  };

  // Focus tablet search input when opened
  useEffect(() => {
    if (tabletSearchOpen) {
      setTimeout(() => tabletInputRef.current?.focus(), 60);
    }
  }, [tabletSearchOpen]);

  // Handle keyboard Escape to close menus & dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (profileMenuOpen) setProfileMenuOpen(false);
        if (notificationsOpen) setNotificationsOpen(false);
        if (tabletSearchOpen) setTabletSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profileMenuOpen, notificationsOpen, tabletSearchOpen]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all shadow-2xs">
      <div className="flex h-16 md:h-18 w-full items-center justify-between px-3 sm:px-6 lg:px-8 gap-2 sm:gap-4">
        {/* ======================================================== */}
        {/* LEFT: MOBILE/TABLET SIDEBAR TOGGLE & PAGE TITLE          */}
        {/* ======================================================== */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-10 w-10 items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 lg:hidden cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 shrink-0"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-slate-900 font-montserrat truncate max-w-[130px] sm:max-w-[220px] md:max-w-[320px] lg:max-w-none">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT CONTROLS: SEARCH, QUICK ACTIONS, NOTIFS, PROFILE    */}
        {/* ======================================================== */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          {/* DESKTOP Search Bar (Only on >= 1024px to prevent tablet crowding) */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="relative hidden lg:block w-48 xl:w-64"
          >
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600 pointer-events-none" />
            <input
              type="search"
              placeholder="Search catalog or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-8 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs hover:border-violet-300 focus:border-violet-600 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all h-9"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* TABLET / MOBILE Search Toggle Button (< 1024px) */}
          <button
            type="button"
            onClick={() => setTabletSearchOpen(!tabletSearchOpen)}
            aria-label={tabletSearchOpen ? 'Close search' : 'Search catalog'}
            className={`flex lg:hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
              tabletSearchOpen
                ? 'border-violet-300 bg-violet-50 text-violet-600'
                : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-slate-900 shadow-2xs'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Live Sync Date Badge (Only on wide desktop >= 1280px to free space on tablet) */}
          <div className="hidden xl:flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-violet-600" />
            <span>Sep 2026 • Live Sync</span>
          </div>

          {/* Live Storefront Quick Link (Desktop & Tablet) */}
          <Link
            href="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-violet-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-violet-600 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title="Preview Live Storefront in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600" />
            <span className="hidden lg:inline">Storefront</span>
          </Link>

          {/* Notification Bell with Purple Badge */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-slate-900 shadow-2xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-xs">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-[min(90vw,320px)] rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Store Alerts (3)
                  </h4>
                  <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                    Real-time
                  </span>
                </div>
                <div className="divide-y divide-slate-100 mt-2 text-xs space-y-2">
                  <div className="pt-2">
                    <p className="font-bold text-slate-900">AirPods Pro Gen 2 Low Stock</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Only 2 units remaining in Ikeja depot.</p>
                  </div>
                  <div className="pt-2">
                    <p className="font-bold text-slate-900">iPhone 16 Pro Max Sold Out</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Restock requisition pending admin approval.</p>
                  </div>
                  <div className="pt-2">
                    <p className="font-bold text-slate-900">Interstate Courier Rates Updated</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Lagos to Abuja standard transit confirmed.</p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <Link
                    href="/admin/inventory"
                    onClick={() => setNotificationsOpen(false)}
                    className="block text-center text-xs font-bold text-violet-600 hover:text-violet-700"
                  >
                    Manage Inventory Alerts →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Administrator Profile Button & Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-1.5 sm:gap-2.5 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-1 sm:p-1.5 sm:pr-3 shadow-2xs hover:border-violet-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label="Administrator Menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg sm:rounded-xl bg-violet-600 text-white font-bold text-xs shadow-xs shrink-0">
                {adminName?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block text-left min-w-0 max-w-[80px] md:max-w-[120px] lg:max-w-[160px]">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                  {adminName || 'Admin'}
                </p>
                <p className="text-[10px] font-semibold text-violet-600 uppercase tracking-wider truncate">
                  {userRole}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />
            </button>

            {/* Account Dropdown Menu */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {adminName || 'Administrator'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-500 capitalize">
                      {userRole} Account
                    </span>
                  </div>
                </div>

                <div className="p-1 space-y-0.5 text-xs font-semibold">
                  <Link
                    href="/admin/products/new"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-violet-600" />
                    <span>Add New Product</span>
                  </Link>

                  <Link
                    href="/admin/inventory"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                  >
                    <Boxes className="w-4 h-4 text-violet-600" />
                    <span>Stock Management</span>
                  </Link>

                  <Link
                    href="/"
                    target="_blank"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>View Customer Store</span>
                  </Link>
                </div>

                <div className="p-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 w-full transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TABLET / MOBILE SLIDE-DOWN SEARCH DRAWER (< 1024px)      */}
      {/* ======================================================== */}
      {tabletSearchOpen && (
        <div className="lg:hidden border-t border-slate-100 px-3 sm:px-6 py-2.5 bg-slate-50/95 animate-in fade-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600 pointer-events-none" />
            <input
              ref={tabletInputRef}
              type="search"
              placeholder="Search catalog, SKU, IMEI or brand..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-20 py-2 bg-white border border-slate-200 focus:border-violet-600 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 h-10 shadow-2xs focus:outline-none focus:ring-4 focus:ring-violet-500/10"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear query"
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setTabletSearchOpen(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md hover:bg-slate-200/50"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
