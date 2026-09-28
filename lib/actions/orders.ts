// ==============================================================================
// 3LINE GADGETS — ORDER SERVER ACTIONS (MANUAL BANK TRANSFER)
// lib/actions/orders.ts
// ==============================================================================

'use server';

import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import {
  saveOrder,
  generateTrackingCode,
  generateOrderNumber,
  getOrderByTrackingCode,
  getOrderByIdOrNumber,
  getAllOrders,
  updateOrderStatus,
  type StoredOrder,
  type StoredOrderItem,
} from '@/lib/orders/store';
import { requireAdmin } from '@/lib/auth/session';

export interface CreateOrderInput {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    note?: string;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  items: Array<{
    productId: string;
    variantId?: string;
    name: string;
    variantName?: string | null;
    sku?: string;
    price: number;
    quantity: number;
    imageUrl?: string;
  }>;
  subtotal: number;
  shippingFee: number;
  discountAmount?: number;
  totalAmount: number;
  idempotencyKey?: string;
}

export interface CreateOrderResult {
  success: boolean;
  order?: StoredOrder;
  error?: string;
}

// In-memory duplicate submission cache (idempotency key -> timestamp)
const recentSubmissions = new Map<string, number>();

/**
 * Clean up old idempotency entries older than 2 minutes
 */
function cleanupIdempotency() {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > 120000) {
      recentSubmissions.delete(key);
    }
  }
}

/**
 * Creates an order via Manual Bank Transfer, generates a unique tracking code,
 * and persists the order details in the database.
 */
export async function createManualTransferOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  try {
    cleanupIdempotency();

    // 1. Validate customer information
    if (!input.customer?.fullName?.trim()) {
      return { success: false, error: 'Please enter your full recipient name.' };
    }
    if (!input.customer?.email?.trim() || !input.customer.email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address for receipt delivery.' };
    }
    if (!input.customer?.phone?.trim() || input.customer.phone.trim().length < 8) {
      return { success: false, error: 'Please enter a valid phone number for dispatch verification.' };
    }
    if (!input.customer?.address?.trim()) {
      return { success: false, error: 'Please provide your physical delivery address in Nigeria.' };
    }
    if (!input.customer?.city?.trim()) {
      return { success: false, error: 'Please enter your city.' };
    }
    if (!input.customer?.state?.trim()) {
      return { success: false, error: 'Please select your state.' };
    }

    // 2. Validate items & totals
    if (!input.items || input.items.length === 0) {
      return { success: false, error: 'Your shopping cart is empty. Please add gadgets before checkout.' };
    }
    if (input.totalAmount <= 0) {
      return { success: false, error: 'Invalid order total amount.' };
    }

    // 3. Duplicate Prevention (Idempotency)
    const idempotencyKey =
      input.idempotencyKey ||
      `${input.customer.email.trim().toLowerCase()}-${input.totalAmount}-${input.items.length}`;

    if (recentSubmissions.has(idempotencyKey)) {
      const prevTime = recentSubmissions.get(idempotencyKey)!;
      if (Date.now() - prevTime < 15000) {
        // Double-click prevented within 15 seconds
        return {
          success: false,
          error: 'An identical order is already being processed. Please wait a moment.',
        };
      }
    }
    recentSubmissions.set(idempotencyKey, Date.now());

    // 4. Generate unique IDs and codes
    const orderId = crypto.randomUUID();
    const orderNumber = generateOrderNumber();
    const trackingCode = generateTrackingCode();
    const nowIso = new Date().toISOString();

    // Map items
    const orderItems: StoredOrderItem[] = input.items.map((it) => ({
      id: crypto.randomUUID(),
      product_id: it.productId,
      variant_id: it.variantId,
      product_name: it.name,
      variant_name: it.variantName || null,
      sku: it.sku || `3LG-${it.productId.slice(0, 6).toUpperCase()}`,
      unit_price: it.price,
      quantity: it.quantity,
      total_price: it.price * it.quantity,
      image_url: it.imageUrl,
    }));

    // Construct full order object
    const newOrder: StoredOrder = {
      id: orderId,
      order_number: orderNumber,
      tracking_code: trackingCode,
      created_at: nowIso,
      updated_at: nowIso,
      status: 'pending',
      payment_status: 'pending',
      fulfillment_status: 'unfulfilled',
      payment_method: 'bank_transfer',
      bank_details: {
        bank_name: input.bankDetails.bankName,
        account_number: input.bankDetails.accountNumber,
        account_name: input.bankDetails.accountName,
      },
      customer: {
        full_name: input.customer.fullName.trim(),
        email: input.customer.email.trim().toLowerCase(),
        phone: input.customer.phone.trim(),
        address: input.customer.address.trim(),
        city: input.customer.city.trim(),
        state: input.customer.state.trim(),
        country: 'Nigeria',
        note: input.customer.note?.trim() || undefined,
      },
      items: orderItems,
      subtotal: input.subtotal,
      shipping_fee: input.shippingFee,
      discount_amount: input.discountAmount || 0,
      tax_amount: 0,
      total_amount: input.totalAmount,
      currency: 'NGN',
    };

    // Save to persistent storage and synchronize with database
    const saved = await saveOrder(newOrder);

    // Revalidate paths
    try {
      revalidatePath('/admin');
      revalidatePath('/admin/orders');
      revalidatePath('/track-order');
    } catch {
      // Revalidation in non-standard context is non-fatal
    }

    return {
      success: true,
      order: saved,
    };
  } catch (error: any) {
    console.error('Error in createManualTransferOrder:', error);
    return {
      success: false,
      error: error?.message || 'An unexpected error occurred while placing your order. Please try again.',
    };
  }
}

/**
 * Search for order tracking details by tracking code or order number
 */
export async function trackOrderAction(query: string): Promise<{
  success: boolean;
  order?: StoredOrder;
  error?: string;
}> {
  try {
    if (!query || !query.trim()) {
      return { success: false, error: 'Please enter an order number or tracking code.' };
    }

    const order = await getOrderByTrackingCode(query.trim());
    if (!order) {
      return {
        success: false,
        error: `No order found matching "${query.trim()}". Please verify your reference.`,
      };
    }

    return { success: true, order };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to retrieve order tracking info.' };
  }
}

/**
 * Admin action to fetch all orders
 */
export async function getAdminOrdersAction(): Promise<{
  success: boolean;
  orders: StoredOrder[];
}> {
  try {
    await requireAdmin();
    const orders = await getAllOrders();
    return { success: true, orders };
  } catch (err: any) {
    console.error('getAdminOrdersAction error:', err);
    return { success: false, orders: [] };
  }
}

/**
 * Admin action to update order status (e.g. mark payment received or mark dispatched)
 */
export async function updateAdminOrderStatusAction(
  orderId: string,
  updates: Partial<Pick<StoredOrder, 'status' | 'payment_status' | 'fulfillment_status'>>
): Promise<{ success: boolean; order?: StoredOrder; error?: string }> {
  try {
    await requireAdmin();
    const updated = await updateOrderStatus(orderId, updates);
    if (!updated) {
      return { success: false, error: 'Order not found.' };
    }

    try {
      revalidatePath('/admin');
      revalidatePath('/admin/orders');
      revalidatePath('/track-order');
    } catch {
      // ignore
    }

    return { success: true, order: updated };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update order status.' };
  }
}
