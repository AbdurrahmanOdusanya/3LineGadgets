// ==============================================================================
// 3LINE GADGETS — ADMIN AREA LAYOUT
// app/admin/layout.tsx
// ==============================================================================

import { requireAdmin } from '@/lib/auth/session';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin('/admin');

  return (
    <AdminLayoutShell
      userProfile={{
        full_name: profile.full_name,
        role: profile.role,
        avatar_url: profile.avatar_url,
      }}
    >
      {children}
    </AdminLayoutShell>
  );
}
