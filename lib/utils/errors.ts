// ==============================================================================
// 3LINE GADGETS — ERROR HANDLING ARCHITECTURE
// lib/utils/errors.ts
// ==============================================================================

import { AuthError as SupabaseAuthError, PostgrestError } from '@supabase/supabase-js';
import { ZodError } from 'zod';

export type ErrorCode =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'DATABASE_ERROR'
  | 'AUTH_ERROR'
  | 'RATE_LIMITED'
  | 'INTERNAL_SERVER_ERROR';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: ErrorCode = 'INTERNAL_SERVER_ERROR',
    statusCode: number = 500,
    isOperational: boolean = true,
    details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required to access this resource') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'You do not have permission to perform this action') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} was not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', 422, true, details);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'A database error occurred', details?: unknown) {
    super(message, 'DATABASE_ERROR', 500, true, details);
    this.name = 'DatabaseError';
  }
}

/**
 * Sanitizes any raw system, Supabase, or PostgreSQL error into a clean,
 * safe client-facing error message without leaking sensitive internal table
 * names, constraints, or query plans.
 */
export function formatErrorMessage(error: unknown): {
  message: string;
  code: ErrorCode;
  statusCode: number;
} {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    return {
      message: firstIssue?.message || 'Invalid input data',
      code: 'VALIDATION_ERROR',
      statusCode: 422,
    };
  }

  if (error instanceof SupabaseAuthError) {
    // Translate common Supabase Auth messages to user-friendly messages
    if (error.message.includes('Invalid login credentials')) {
      return {
        message: 'Invalid email or password. Please try again.',
        code: 'AUTH_ERROR',
        statusCode: 401,
      };
    }
    if (error.message.includes('User already registered')) {
      return {
        message: 'An account with this email address already exists.',
        code: 'CONFLICT',
        statusCode: 409,
      };
    }
    if (error.message.includes('Email not confirmed')) {
      return {
        message: 'Please confirm your email address before signing in.',
        code: 'AUTH_ERROR',
        statusCode: 401,
      };
    }
    return {
      message: error.message || 'Authentication failed',
      code: 'AUTH_ERROR',
      statusCode: 400,
    };
  }

  // Handle Postgrest / Supabase database errors securely
  if (isPostgrestError(error)) {
    // Unique violation code
    if (error.code === '23505') {
      return {
        message: 'A record with this information already exists.',
        code: 'CONFLICT',
        statusCode: 409,
      };
    }
    // Foreign key violation
    if (error.code === '23503') {
      return {
        message: 'Referenced item does not exist or has been removed.',
        code: 'BAD_REQUEST',
        statusCode: 400,
      };
    }
    // Row level security violation
    if (error.code === '42501') {
      return {
        message: 'You do not have permission to access this data.',
        code: 'FORBIDDEN',
        statusCode: 403,
      };
    }
    return {
      message: 'A database query error occurred. Please try again.',
      code: 'DATABASE_ERROR',
      statusCode: 500,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred.',
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: 500,
    };
  }

  return {
    message: 'An unknown error occurred.',
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
  };
}

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'details' in error &&
    'message' in error
  );
}
