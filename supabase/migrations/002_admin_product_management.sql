-- ==============================================================================
-- 3LINE GADGETS — FEATURE 2: ADMIN PRODUCT & INVENTORY MANAGEMENT
-- Migration: 002_admin_product_management.sql
-- ==============================================================================

-- 1. ATOMIC INVENTORY ADJUSTMENT FUNCTION
-- Ensures stock update and transaction record insertion happen atomically
-- with row-level locking (FOR UPDATE) to eliminate race conditions.
CREATE OR REPLACE FUNCTION public.adjust_inventory_stock(
    p_variant_id UUID,
    p_adjustment_quantity INTEGER,
    p_transaction_type public.inventory_transaction_type,
    p_note TEXT DEFAULT NULL,
    p_admin_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_stock INTEGER;
    v_new_stock INTEGER;
    v_product_id UUID;
    v_sku TEXT;
    v_variant_name TEXT;
    v_product_name TEXT;
    v_transaction_id UUID;
BEGIN
    -- 1. Authorization check: only admin or super_admin may execute stock adjustments
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only administrators can adjust inventory';
    END IF;

    -- 2. Lock the variant row to guarantee concurrency isolation
    SELECT pv.stock_quantity, pv.product_id, pv.sku, pv.name, p.name
    INTO v_current_stock, v_product_id, v_sku, v_variant_name, v_product_name
    FROM public.product_variants pv
    JOIN public.products p ON p.id = pv.product_id
    WHERE pv.id = p_variant_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Product variant with ID % not found', p_variant_id;
    END IF;

    -- 3. Calculate new stock and prevent negative stock
    v_new_stock := v_current_stock + p_adjustment_quantity;
    IF v_new_stock < 0 THEN
        RAISE EXCEPTION 'Insufficient stock. Current stock is %, adjustment is % (would result in %)', 
            v_current_stock, p_adjustment_quantity, v_new_stock;
    END IF;

    -- 4. Update the variant stock quantity
    UPDATE public.product_variants
    SET stock_quantity = v_new_stock,
        updated_at = now()
    WHERE id = p_variant_id;

    -- 5. Insert the inventory transaction record
    INSERT INTO public.inventory_transactions (
        variant_id,
        transaction_type,
        quantity,
        note,
        created_by
    )
    VALUES (
        p_variant_id,
        p_transaction_type,
        p_adjustment_quantity,
        p_note,
        COALESCE(p_admin_id, auth.uid())
    )
    RETURNING id INTO v_transaction_id;

    -- 6. Log to admin activity logs
    INSERT INTO public.admin_activity_logs (
        admin_id,
        action,
        entity_type,
        entity_id,
        description,
        metadata
    )
    VALUES (
        COALESCE(p_admin_id, auth.uid()),
        'inventory_adjusted',
        'product_variant',
        p_variant_id,
        format('Adjusted stock for SKU %s (%s): %s%s (new stock: %s)', 
               v_sku, v_variant_name, 
               CASE WHEN p_adjustment_quantity > 0 THEN '+' ELSE '' END, 
               p_adjustment_quantity, v_new_stock),
        jsonb_build_object(
            'sku', v_sku,
            'variant_name', v_variant_name,
            'product_name', v_product_name,
            'previous_stock', v_current_stock,
            'adjustment', p_adjustment_quantity,
            'new_stock', v_new_stock,
            'transaction_type', p_transaction_type,
            'note', p_note,
            'transaction_id', v_transaction_id
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'variant_id', p_variant_id,
        'sku', v_sku,
        'previous_stock', v_current_stock,
        'adjustment', p_adjustment_quantity,
        'new_stock', v_new_stock,
        'transaction_id', v_transaction_id
    );
END;
$$;

-- 2. CREATE STORAGE BUCKET FOR PRODUCT IMAGES (IF STORAGE SCHEMA IS ACCESSIBLE)
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'product-images',
        'product-images',
        true,
        5242880, -- 5MB limit
        ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    )
    ON CONFLICT (id) DO UPDATE
    SET public = true,
        file_size_limit = 5242880,
        allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
EXCEPTION
    WHEN undefined_table THEN
        null;
    WHEN others THEN
        null;
END $$;

-- 3. STORAGE POLICIES (ONLY ADMINS CAN UPLOAD/DELETE, PUBLIC CAN VIEW)
DO $$
BEGIN
    -- Public read policy for product images
    DROP POLICY IF EXISTS "Public Access Product Images" ON storage.objects;
    CREATE POLICY "Public Access Product Images"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'product-images');

    -- Admin insert policy
    DROP POLICY IF EXISTS "Admins Insert Product Images" ON storage.objects;
    CREATE POLICY "Admins Insert Product Images"
        ON storage.objects FOR INSERT
        WITH CHECK (
            bucket_id = 'product-images' 
            AND (EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() 
                  AND role IN ('admin'::public.user_role, 'super_admin'::public.user_role)
            ))
        );

    -- Admin update policy
    DROP POLICY IF EXISTS "Admins Update Product Images" ON storage.objects;
    CREATE POLICY "Admins Update Product Images"
        ON storage.objects FOR UPDATE
        USING (
            bucket_id = 'product-images' 
            AND (EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() 
                  AND role IN ('admin'::public.user_role, 'super_admin'::public.user_role)
            ))
        );

    -- Admin delete policy
    DROP POLICY IF EXISTS "Admins Delete Product Images" ON storage.objects;
    CREATE POLICY "Admins Delete Product Images"
        ON storage.objects FOR DELETE
        USING (
            bucket_id = 'product-images' 
            AND (EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() 
                  AND role IN ('admin'::public.user_role, 'super_admin'::public.user_role)
            ))
        );
EXCEPTION
    WHEN undefined_table THEN
        null;
    WHEN others THEN
        null;
END $$;
