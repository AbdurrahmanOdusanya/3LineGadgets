// ==============================================================================
// 3LINE GADGETS — AUTHENTICATION TYPES
// types/auth.ts
// ==============================================================================

import type { User, Session } from '@supabase/supabase-js';
import type { Profile, UserRole } from './database';

export type AuthUser = User;
export type AuthSession = Session;

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface AuthResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string | null;
  code?: string | null;
}

export interface UserSessionPayload {
  id: string;
  email: string | null;
  role: UserRole;
  fullName: string | null;
}
