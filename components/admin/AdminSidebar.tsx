// ==============================================================================
// 3LINE GADGETS — ADMIN SIDEBAR NAVIGATION
// components/admin/AdminSidebar.tsx
// Slim, modern, collapsible on desktop and responsive on mobile
// ==============================================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  Boxes,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface AdminSidebarProps {
  userProfile?: {
    full_name?: string | null;
    role?: string;
    avatar_url?: string | null;
  } | null;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({
  userProfile,
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Close sidebar drawer on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      active: pathname === '/admin',
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingBag,
      active: pathname.startsWith('/admin/orders'),
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      active: pathname.startsWith('/admin/products'),
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: Layers,
      active: pathname.startsWith('/admin/categories'),
    },
    {
      name: 'Brands',
      href: '/admin/brands',
      icon: Tag,
      active: pathname.startsWith('/admin/brands'),
    },
    {
      name: 'Inventory',
      href: '/admin/inventory',
      icon: Boxes,
      active: pathname.startsWith('/admin/inventory'),
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ease-in-out lg:static shadow-sm',
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand / Logo Section */}
        <div
          className={cn(
            'flex h-16 items-center border-b border-slate-100 px-4 transition-all',
            isCollapsed ? 'justify-center' : 'justify-between px-5'
          )}
        >
          <Link
            href="/admin"
            className="flex items-center gap-3 group"
            title="3Line Gadgets Admin"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-500/25 transition-transform group-hover:scale-105">
              <Sparkles className="h-5 w-5" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0 transition-opacity">
                <div className="flex items-center gap-1 font-montserrat">
                  <span className="text-base font-black tracking-tight text-slate-900">
                    3Line
                  </span>
                  <span className="text-base font-bold text-violet-600">
                    Gadgets
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Admin Console
                </p>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5">
          {!isCollapsed && (
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Management
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                title={item.name}
                className={cn(
                  'flex items-center rounded-2xl transition-all font-semibold',
                  isCollapsed
                    ? 'h-12 w-12 mx-auto justify-center'
                    : 'gap-3 px-3.5 py-3 text-xs sm:text-sm',
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                    : 'text-slate-800 hover:bg-violet-50 hover:text-violet-700'
                )}
              >
                <Icon
                  className={cn(
                    'shrink-0 transition-colors',
                    isCollapsed ? 'h-5 w-5' : 'h-4 w-4',
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-violet-600'
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}

          {/* Quick Divider */}
          <div className="my-4 border-t border-slate-100" />

          {/* Storefront Link */}
          <Link
            href="/"
            target="_blank"
            title="View Live Storefront"
            className={cn(
              'flex items-center rounded-2xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors',
              isCollapsed
                ? 'h-12 w-12 mx-auto justify-center'
                : 'gap-3 px-3.5 py-2.5'
            )}
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>Storefront</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold rounded-md px-1.5 py-0.5">
                  Live
                </span>
              </div>
            )}
          </Link>
        </nav>

        {/* Desktop Collapse Toggle Button */}
        <div className="hidden lg:block border-t border-slate-100 p-3">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(
              'flex items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors w-full cursor-pointer text-xs font-semibold gap-2',
              isCollapsed && 'aspect-square'
            )}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>

        {/* Administrator Profile / Bottom Action */}
        <div className="border-t border-slate-100 p-3">
          <div
            className={cn(
              'flex items-center rounded-2xl bg-slate-50 border border-slate-200/80 p-2 transition-all',
              isCollapsed ? 'justify-center' : 'justify-between gap-2.5'
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white font-bold text-xs shadow-xs">
                {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
              </div>

              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-slate-900">
                    {userProfile?.full_name || 'Administrator'}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                    <span className="text-[10px] font-bold text-violet-700 uppercase tracking-wider">
                      {userProfile?.role || 'Admin'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                className="rounded-xl p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
