// ==============================================================================
// 3LINE GADGETS — ADMIN LAYOUT SHELL (CLIENT WRAPPER)
// components/admin/AdminLayoutShell.tsx
// ==============================================================================

'use client';

import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutShellProps {
  userProfile: {
    full_name: string | null;
    role: string;
    avatar_url: string | null;
  };
  children: React.ReactNode;
}

export function AdminLayoutShell({
  userProfile,
  children,
}: AdminLayoutShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('3lg_admin_sidebar_collapsed');
        if (saved !== null) {
          return saved === 'true';
        }
      } catch {
        // Ignore
      }
    }
    return false;
  });

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('3lg_admin_sidebar_collapsed', String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-[#fcfcfe] text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <AdminSidebar
        userProfile={userProfile}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader
          onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)}
          userRole={userProfile.role}
          adminName={userProfile.full_name}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
