// ==============================================================================
// 3LINE GADGETS — SIGN OUT BUTTON (CLIENT COMPONENT)
// components/auth/SignOutButton.tsx
// ==============================================================================

'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signOutAction } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOutAction();
      router.push('/auth/login');
      router.refresh();
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignOut}
      disabled={isPending}
      className="text-slate-300 hover:text-white"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>{isPending ? 'Signing out...' : 'Sign Out'}</span>
    </Button>
  );
}
