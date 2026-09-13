-- ==============================================================================
-- 3LINE GADGETS — DEVELOPMENT SEED DATA
-- seed.sql
-- All UUID literals use valid hexadecimal digits [0-9a-f]
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description, sort_order, is_active)
VALUES
    ('ca000000-0000-0000-0000-000000000001', 'Smartphones & Tablets', 'smartphones-tablets', 'Flagship and budget smartphones, tablets, and mobile computing gadgets.', 1, true),
    ('ca000000-0000-0000-0000-000000000002', 'Laptops & Computers', 'laptops-computers', 'Ultra-portable laptops, creator workstations, and desktop setups.', 2, true),
    ('ca000000-0000-0000-0000-000000000003', 'Audio & Sound', 'audio-sound', 'Studio headphones, true wireless earbuds, and portable Bluetooth speakers.', 3, true),
    ('ca000000-0000-0000-0000-000000000004', 'Wearables & Smart Home', 'wearables-smart-home', 'Smartwatches, fitness trackers, and smart home automation gadgets.', 4, true),
    ('ca000000-0000-0000-0000-000000000005', 'Power & Accessories', 'power-accessories', 'Fast chargers, GaN power bricks, MagSafe battery packs, and cables.', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED BRANDS
INSERT INTO public.brands (id, name, slug, description, is_active)
VALUES
    ('ba000000-0000-0000-0000-000000000001', 'Apple', 'apple', 'Premium consumer electronics, iPhones, MacBooks, and iPads.', true),
    ('ba000000-0000-0000-0000-000000000002', 'Samsung', 'samsung', 'Innovative Galaxy smartphones, tablets, and OLED displays.', true),
    ('ba000000-0000-0000-0000-000000000003', 'Sony', 'sony', 'Industry-leading noise-canceling audio and camera gear.', true),
    ('ba000000-0000-0000-0000-000000000004', 'Anker', 'anker', 'Pioneering charging technology, power banks, and sound accessories.', true),
    ('ba000000-0000-0000-0000-000000000005', 'Dell', 'dell', 'High-performance XPS and Alienware computing hardware.', true)
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED PRODUCTS
INSERT INTO public.products (
    id, category_id, brand_id, name, slug, description, short_description, 
    base_price, compare_at_price, specifications, is_active, is_featured
)
VALUES
    (
        'da000000-0000-0000-0000-000000000001',
        'ca000000-0000-0000-0000-000000000001',
        'ba000000-0000-0000-0000-000000000001',
        'Apple iPhone 16 Pro Max',
        'iphone-16-pro-max',
        'Forged in grade 5 titanium with the groundbreaking A18 Pro chip, 48MP Fusion camera system, and Camera Control.',
        'Titanium design, A18 Pro chip, 48MP camera, Camera Control.',
        1950000.00,
        2100000.00,
        '{"processor": "A18 Pro", "screen": "6.9-inch Super Retina XDR OLED 120Hz", "camera": "48MP Main, 48MP Ultra-Wide, 12MP 5x Telephoto", "battery": "Up to 33 hours video playback", "connectivity": "5G, Wi-Fi 7, USB-C 3.0"}'::jsonb,
        true,
        true
    ),
    (
        'da000000-0000-0000-0000-000000000002',
        'ca000000-0000-0000-0000-000000000002',
        'ba000000-0000-0000-0000-000000000001',
        'MacBook Pro 16" M3 Max',
        'macbook-pro-16-m3-max',
        'The most advanced Mac laptop ever built for pro developers, 3D artists, and video editors with the M3 Max chip.',
        '16-inch Liquid Retina XDR, M3 Max chip, up to 128GB unified memory.',
        3850000.00,
        4100000.00,
        '{"processor": "Apple M3 Max 16-core CPU, 40-core GPU", "display": "16.2-inch Liquid Retina XDR 120Hz ProMotion", "ports": "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3", "battery": "Up to 22 hours"}'::jsonb,
        true,
        true
    ),
    (
        'da000000-0000-0000-0000-000000000003',
        'ca000000-0000-0000-0000-000000000003',
        'ba000000-0000-0000-0000-000000000003',
        'Sony WH-1000XM5 Wireless Headphones',
        'sony-wh-1000xm5',
        'Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality.',
        'Industry-leading active noise canceling with 30-hour battery life.',
        520000.00,
        580000.00,
        '{"driver": "30mm precision carbon fiber", "battery": "30 hours with ANC", "charging": "3 min quick charge for 3 hours playback", "weight": "250g", "codecs": "LDAC, AAC, SBC"}'::jsonb,
        true,
        true
    ),
    (
        'da000000-0000-0000-0000-000000000004',
        'ca000000-0000-0000-0000-000000000005',
        'ba000000-0000-0000-0000-000000000004',
        'Anker Prime 27,650mAh Power Bank (250W)',
        'anker-prime-27650mah-250w',
        'Multi-device fast charging power bank delivering up to 250W total output with smart digital display and app control.',
        '250W total output, 27,650mAh capacity, smart display.',
        240000.00,
        275000.00,
        '{"capacity": "27,650mAh / 99.54Wh", "ports": "2x USB-C (140W max each), 1x USB-A (65W max)", "screen": "Smart digital TFT status display", "airline_approved": true}'::jsonb,
        true,
        false
    )
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED PRODUCT VARIANTS
INSERT INTO public.product_variants (
    id, product_id, name, sku, price, compare_at_price, stock_quantity, low_stock_threshold, is_active
)
VALUES
    (
        'ea000000-0000-0000-0000-000000000001',
        'da000000-0000-0000-0000-000000000001',
        'Natural Titanium / 256GB',
        '3LG-IP16PM-NT-256',
        1950000.00,
        2100000.00,
        15,
        3,
        true
    ),
    (
        'ea000000-0000-0000-0000-000000000002',
        'da000000-0000-0000-0000-000000000001',
        'Black Titanium / 512GB',
        '3LG-IP16PM-BT-512',
        2250000.00,
        2400000.00,
        10,
        2,
        true
    ),
    (
        'ea000000-0000-0000-0000-000000000003',
        'da000000-0000-0000-0000-000000000002',
        'Space Black / 36GB RAM / 1TB SSD',
        '3LG-MBP16-M3M-1TB',
        3850000.00,
        4100000.00,
        6,
        2,
        true
    ),
    (
        'ea000000-0000-0000-0000-000000000004',
        'da000000-0000-0000-0000-000000000003',
        'Silver',
        '3LG-SONY-XM5-SLV',
        520000.00,
        580000.00,
        25,
        5,
        true
    ),
    (
        'ea000000-0000-0000-0000-000000000005',
        'da000000-0000-0000-0000-000000000003',
        'Midnight Black',
        '3LG-SONY-XM5-BLK',
        520000.00,
        580000.00,
        30,
        5,
        true
    ),
    (
        'ea000000-0000-0000-0000-000000000006',
        'da000000-0000-0000-0000-000000000004',
        'Gunmetal Black',
        '3LG-ANKER-P250W-BLK',
        240000.00,
        275000.00,
        40,
        8,
        true
    )
ON CONFLICT (sku) DO NOTHING;

-- 5. SEED PRODUCT IMAGES (Metadata)
INSERT INTO public.product_images (
    id, product_id, variant_id, image_url, alt_text, sort_order, is_primary
)
VALUES
    (
        'fa000000-0000-0000-0000-000000000001',
        'da000000-0000-0000-0000-000000000001',
        'ea000000-0000-0000-0000-000000000001',
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
        'Apple iPhone 16 Pro Max Natural Titanium front and back',
        1,
        true
    ),
    (
        'fa000000-0000-0000-0000-000000000002',
        'da000000-0000-0000-0000-000000000002',
        'ea000000-0000-0000-0000-000000000003',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
        'Apple MacBook Pro 16 inch Space Black open on desk',
        1,
        true
    ),
    (
        'fa000000-0000-0000-0000-000000000003',
        'da000000-0000-0000-0000-000000000003',
        'ea000000-0000-0000-0000-000000000004',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
        'Sony WH-1000XM5 Wireless Headphones angled view',
        1,
        true
    ),
    (
        'fa000000-0000-0000-0000-000000000004',
        'da000000-0000-0000-0000-000000000004',
        'ea000000-0000-0000-0000-000000000006',
        'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=1200&q=80',
        'Anker Prime High Capacity Portable Power Bank with Digital Display',
        1,
        true
    )
ON CONFLICT (id) DO NOTHING;

-- 6. SEED INITIAL SAMPLE COUPON (For development & testing discount logic)
INSERT INTO public.coupons (
    id, code, description, discount_type, discount_value, minimum_order_amount, is_active
)
VALUES
    (
        'aa000000-0000-0000-0000-000000000001',
        'WELCOME3LG',
        'Welcome discount for new 3Line Gadgets shoppers: 5% off orders above 50,000 NGN.',
        'percentage',
        5.00,
        50000.00,
        true
    )
ON CONFLICT (code) DO NOTHING;
