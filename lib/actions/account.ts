// ==============================================================================
// 3LINE GADGETS — CUSTOMER ACCOUNT & PROFILE SERVER ACTIONS
// lib/actions/account.ts
// ==============================================================================

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth/session';
import { formatErrorMessage } from '@/lib/utils/errors';

export interface CustomerAddress {
  id: string;
  user_id: string;
  label: string | null;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  country: string;
  postal_code: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string | null;
  sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CustomerOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  shipping_address: any;
  billing_address: any;
  customer_note: string | null;
  created_at: string;
  updated_at: string;
  items?: CustomerOrderItem[];
}

/**
 * Retrieves the current customer's order history and delivery records
 */
export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  try {
    const { user } = await requireAuth('/account');
    const supabase = await createClient();

    const { data: orders, error } = await (supabase.from('orders') as any)
      .select(`
        *,
        items:order_items (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Could not fetch customer orders:', error.message);
      return [];
    }

    return (orders as CustomerOrder[]) || [];
  } catch (error) {
    console.warn('getCustomerOrders caught error:', error);
    return [];
  }
}

/**
 * Retrieves the customer's saved shipping & delivery addresses
 */
export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  try {
    const { user } = await requireAuth('/account');
    const supabase = await createClient();

    const { data: addresses, error } = await (supabase.from('addresses') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Could not fetch customer addresses:', error.message);
      return [];
    }

    return (addresses as CustomerAddress[]) || [];
  } catch (error) {
    console.warn('getCustomerAddresses caught error:', error);
    return [];
  }
}

/**
 * Updates the customer's profile details (full name, phone, etc.)
 */
export async function updateCustomerProfile(data: {
  fullName: string;
  phone?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requireAuth('/account');
    const supabase = await createClient();

    const { error } = await (supabase.from('profiles') as any)
      .update({
        full_name: data.fullName.trim(),
        phone: data.phone?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) throw error;

    revalidatePath('/account');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return { success: false, error: formatted.message };
  }
}

/**
 * Adds a new delivery address for the customer
 */
export async function addCustomerAddress(data: {
  label?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode?: string;
  isDefault?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requireAuth('/account');
    const supabase = await createClient();

    if (data.isDefault) {
      await (supabase.from('addresses') as any)
        .update({ is_default: false })
        .eq('user_id', user.id);
    }

    const { error } = await (supabase.from('addresses') as any).insert({
      user_id: user.id,
      label: data.label?.trim() || 'Home',
      full_name: data.fullName.trim(),
      phone: data.phone.trim(),
      address_line_1: data.addressLine1.trim(),
      address_line_2: data.addressLine2?.trim() || null,
      city: data.city.trim(),
      state: data.state.trim(),
      country: 'Nigeria',
      postal_code: data.postalCode?.trim() || null,
      is_default: !!data.isDefault,
    });

    if (error) throw error;

    revalidatePath('/account');
    return { success: true };
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return { success: false, error: formatted.message };
  }
}

/**
 * Deletes a delivery address for the customer
 */
export async function deleteCustomerAddress(addressId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requireAuth('/account');
    const supabase = await createClient();

    const { error } = await (supabase.from('addresses') as any)
      .delete()
      .eq('id', addressId)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/account');
    return { success: true };
  } catch (error) {
    const formatted = formatErrorMessage(error);
    return { success: false, error: formatted.message };
  }
}
