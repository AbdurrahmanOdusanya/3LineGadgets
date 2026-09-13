// ==============================================================================
// 3LINE GADGETS — AUTHENTICATION SERVER ACTIONS
// lib/auth/actions.ts
// ==============================================================================

'use server';

import { createClient } from '@/lib/supabase/server';
import {
  signUpSchema,
  signInSchema,
  resetPasswordEmailSchema,
  updatePasswordSchema,
  type SignUpInput,
  type SignInInput,
  type ResetPasswordEmailInput,
  type UpdatePasswordInput,
} from '@/lib/validations/auth';
import { formatErrorMessage } from '@/lib/utils/errors';
import type { AuthResult } from '@/types/auth';

/**
 * Registers a new customer account using Supabase Auth.
 * Automatically triggers profile row creation in PostgreSQL via trigger.
 */
export async function signUpAction(rawInput: SignUpInput): Promise<AuthResult<{ email: string; requiresVerification: boolean }>> {
  try {
    const validated = signUpSchema.parse(rawInput);
    const supabase = await createClient();

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      'http://localhost:3000';

    const { data, error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          full_name: validated.fullName,
          phone: validated.phone || null,
        },
        emailRedirectTo: `${appUrl}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }

    const requiresVerification = !data.session;

    return {
      success: true,
      data: {
        email: validated.email,
        requiresVerification,
      },
    };
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return {
      success: false,
      error: formatted.message,
      code: formatted.code,
    };
  }
}

/**
 * Authenticates a user with email and password, establishing an encrypted cookie session.
 */
export async function signInAction(rawInput: SignInInput): Promise<AuthResult<{ userId: string }>> {
  try {
    const validated = signInSchema.parse(rawInput);
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('User data missing from authentication response');
    }

    return {
      success: true,
      data: {
        userId: data.user.id,
      },
    };
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return {
      success: false,
      error: formatted.message,
      code: formatted.code,
    };
  }
}

/**
 * Signs out the current user and invalidates the session cookie.
 */
export async function signOutAction(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    return { success: true };
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return {
      success: false,
      error: formatted.message,
      code: formatted.code,
    };
  }
}

/**
 * Sends a password reset email with a secure token link.
 */
export async function requestPasswordResetAction(
  rawInput: ResetPasswordEmailInput
): Promise<AuthResult<{ message: string }>> {
  try {
    const validated = resetPasswordEmailSchema.parse(rawInput);
    const supabase = await createClient();

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_URL ||
      'http://localhost:3000';

    const { error } = await supabase.auth.resetPasswordForEmail(validated.email, {
      redirectTo: `${appUrl}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      data: {
        message: 'Password reset link sent. Please check your inbox.',
      },
    };
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return {
      success: false,
      error: formatted.message,
      code: formatted.code,
    };
  }
}

/**
 * Updates the current authenticated user's password.
 */
export async function updatePasswordAction(
  rawInput: UpdatePasswordInput
): Promise<AuthResult> {
  try {
    const validated = updatePasswordSchema.parse(rawInput);
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: validated.password,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return {
      success: false,
      error: formatted.message,
      code: formatted.code,
    };
  }
}
