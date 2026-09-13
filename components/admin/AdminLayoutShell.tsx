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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <AdminSidebar
        userProfile={userProfile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
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
