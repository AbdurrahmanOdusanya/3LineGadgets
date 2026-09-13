// ==============================================================================
// 3LINE GADGETS — ADMIN STORAGE ACTIONS
// lib/actions/admin-storage.ts
// ==============================================================================

'use server';

import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/session';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload a product image to Supabase Storage 'product-images' bucket
 */
export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();
  const supabase = await createClient();

  const file = formData.get('file') as File | null;
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  // Validate MIME type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file type "${file.type}". Allowed types: JPG, PNG, WEBP, GIF`,
    };
  }

  // Validate Size
  if (file.size > MAX_SIZE_BYTES) {
    return {
      success: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum 5MB limit.`,
    };
  }

  try {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const fileName = `products/${timestamp}-${randomStr}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return { success: false, error: error.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('product-images').getPublicUrl(data.path);

    return { success: true, url: publicUrl };
  } catch (err: any) {
    console.error('Storage upload exception:', err);
    return { success: false, error: err.message || 'Failed to upload image' };
  }
}
