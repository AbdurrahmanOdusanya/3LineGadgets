// ==============================================================================
// 3LINE GADGETS — STOREFRONT NAVBAR (RESPONSIVE DESKTOP, TABLET & MOBILE)
// components/storefront/StorefrontNavbar.tsx
// ==============================================================================

'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  PackageCheck,
  Home,
  Info,
  Phone,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StorefrontNavbarProps {
  userProfile?: {
    id: string;
    full_name?: string | null;
    role?: string | null;
  } | null;
}

const emptySubscribe = () => () => {};

export function StorefrontNavbar({ userProfile }: StorefrontNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tabletSearchOpen, setTabletSearchOpen] = useState(false);

  const tabletInputRef = useRef<HTMLInputElement>(null);
  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin';

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Focus tablet search input when opened
  useEffect(() => {
    if (tabletSearchOpen) {
      setTimeout(() => tabletInputRef.current?.focus(), 50);
    }
  }, [tabletSearchOpen]);

  // Handle keyboard Escape to close menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (tabletSearchOpen) setTabletSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, tabletSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setTabletSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: ShoppingBag },
    { label: 'Track Order', href: '/track-order', icon: PackageCheck },
    { label: 'About', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <>
      {/* Main Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="h-16 md:h-18 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
            {/* ========================================================== */}
            {/* BRAND LOGO (DESKTOP, TABLET, MOBILE)                       */}
            {/* ========================================================== */}
            <Link
              href="/"
              className="flex items-center text-slate-900 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg p-0.5"
              aria-label="3Line Gadgets Home"
            >
              <span className="leading-tight font-black tracking-tight text-lg sm:text-xl xl:text-2xl uppercase text-slate-900 font-montserrat truncate select-none">
                3Line<span className="text-violet-600">Gadgets</span>
              </span>
            </Link>

            {/* ========================================================== */}
            {/* DESKTOP NAVIGATION (1024px+)                               */}
            {/* ========================================================== */}
            <nav
              aria-label="Desktop Navigation"
              className="hidden lg:flex items-center gap-6 xl:gap-8 font-manrope shrink-0"
            >
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href.split('?')[0]);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-sm font-medium transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-md ${
                      isActive
                        ? 'text-violet-600 font-semibold'
                        : 'text-slate-600 hover:text-violet-600'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ========================================================== */}
            {/* TABLET NAVIGATION (768px – 1023px)                         */}
            {/* ========================================================== */}
            <nav
              aria-label="Tablet Navigation"
              className="hidden md:flex lg:hidden items-center gap-3 md:gap-4 font-manrope shrink-0"
            >
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href.split('?')[0]);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs md:text-sm font-medium transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-md whitespace-nowrap ${
                      isActive
                        ? 'text-violet-600 font-semibold'
                        : 'text-slate-600 hover:text-violet-600'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* ========================================================== */}
            {/* RIGHT CONTROLS: DESKTOP, TABLET & MOBILE                   */}
            {/* ========================================================== */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
              {/* DESKTOP Search Bar (1024px+) */}
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                className="hidden lg:flex items-center relative w-48 xl:w-64"
              >
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600 pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 bg-white hover:bg-white focus:bg-white border border-slate-200 hover:border-violet-300 focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 rounded-full text-xs text-slate-900 placeholder:text-slate-400 transition-all h-9 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* TABLET Compact Search Toggle Button (768px – 1023px) */}
              <button
                type="button"
                onClick={() => setTabletSearchOpen(!tabletSearchOpen)}
                aria-label={tabletSearchOpen ? 'Close search' : 'Open search'}
                className={`hidden md:flex lg:hidden p-2 rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                  tabletSearchOpen
                    ? 'text-violet-600 bg-violet-50'
                    : 'text-slate-700 hover:text-violet-600 hover:bg-slate-50'
                }`}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Admin Console Shortcut */}
              <Link
                href="/admin"
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100 text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>

              {/* Wishlist Icon (Desktop, Tablet, Mobile) */}
              <Link
                href="/shop?filter=wishlist"
                aria-label={`Wishlist, ${isClient && wishlistCount > 0 ? `${wishlistCount} items` : 'empty'}`}
                className="relative min-w-[40px] min-h-[40px] sm:min-w-[42px] sm:min-h-[42px] p-2 rounded-full text-slate-700 hover:text-violet-600 hover:bg-slate-50 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <Heart className="w-5 h-5" />
                {isClient && wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag / Cart Icon (Desktop, Tablet, Mobile) */}
              <button
                id="storefront-cart-button"
                onClick={openCart}
                aria-label={`Shopping Cart, ${isClient && itemCount > 0 ? `${itemCount} items` : 'empty'}`}
                className="relative min-w-[40px] min-h-[40px] sm:min-w-[42px] sm:min-h-[42px] p-2 rounded-full text-slate-700 hover:text-violet-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <ShoppingBag className="w-5 h-5" />
                {isClient && itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account Button (Desktop & Tablet only) */}
              <Link
                href="/account"
                aria-label="User Account"
                className="hidden md:flex min-w-[40px] min-h-[40px] sm:min-w-[42px] sm:min-h-[42px] p-2 rounded-full text-slate-700 hover:text-violet-600 hover:bg-slate-50 transition-colors cursor-pointer items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Hamburger Menu Button (Mobile only: < 768px) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
                className="md:hidden min-w-[42px] min-h-[42px] p-2 rounded-xl text-slate-700 hover:text-violet-600 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* ========================================================== */}
          {/* TABLET SEARCH SLIDE-DOWN DRAWER (768px – 1023px)           */}
          {/* ========================================================== */}
          {tabletSearchOpen && (
            <div className="hidden md:block lg:hidden border-t border-slate-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600 pointer-events-none" />
                <Input
                  ref={tabletInputRef}
                  type="search"
                  placeholder="Search flagships, MacBooks, accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-20 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-violet-600 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 h-10 shadow-inner"
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
                    aria-label="Close search"
                    className="p-1 text-slate-400 hover:text-slate-700 text-xs font-semibold px-2 py-1 rounded-md hover:bg-slate-200/50"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* ========================================================== */}
      {/* MOBILE NAVIGATION DRAWER (< 768px)                         */}
      {/* ========================================================== */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-50 md:hidden overflow-hidden"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-in Panel */}
          <div className="fixed inset-y-0 right-0 w-[min(88vw,340px)] bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-5 space-y-6">
              {/* Drawer Header: Logo + Close Button */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center text-slate-900 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-md"
                >
                  <span className="font-black tracking-tight font-montserrat uppercase text-lg">
                    3Line<span className="text-violet-600">Gadgets</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="min-w-[40px] min-h-[40px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search Input */}
              <form onSubmit={handleSearchSubmit} role="search" className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600 pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 bg-slate-50 focus:bg-white border border-slate-200 hover:border-violet-300 focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 h-11 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search input"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Navigation Links */}
              <nav aria-label="Mobile Navigation Links" className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2 font-manrope">
                  Explore
                </p>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive =
                    link.href === '/'
                      ? pathname === '/'
                      : pathname.startsWith(link.href.split('?')[0]);

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                        isActive
                          ? 'bg-violet-50 text-violet-700 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-violet-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-violet-600' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-violet-600' : 'text-slate-300'}`} />
                    </Link>
                  );
                })}
              </nav>

              {/* Account & Console Shortcuts */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1 font-manrope">
                  Account
                </p>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-violet-600" />
                    <span>My Customer Account</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-violet-600" />
                    <span>Admin Console</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-violet-400" />
                </Link>
              </div>
            </div>

            {/* Bottom Support info */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 text-xs text-slate-500 space-y-2">
              <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" /> Need Assistance?
              </p>
              <p>Call or WhatsApp our Lagos support desk:</p>
              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-violet-600 hover:underline min-h-[40px]"
              >
                +234 812 345 6789
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
