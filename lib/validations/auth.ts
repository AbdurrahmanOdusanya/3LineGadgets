// ==============================================================================
// 3LINE GADGETS — AUTHENTICATION VALIDATION SCHEMAS
// lib/validations/auth.ts
// ==============================================================================

import { z } from 'zod';

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must not exceed 100 characters'),
    email: z
      .string()
      .trim()
      .email('Please enter a valid email address')
      .max(255, 'Email must not exceed 255 characters'),
    phone: z
      .string()
      .trim()
      .min(10, 'Phone number must be at least 10 digits')
      .max(20, 'Phone number must not exceed 20 characters')
      .regex(/^[+0-9\s-]+$/, 'Invalid phone number format')
      .optional()
      .or(z.literal('')),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(72, 'Password must not exceed 72 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const resetPasswordEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(72, 'Password must not exceed 72 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ResetPasswordEmailInput = z.infer<typeof resetPasswordEmailSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
