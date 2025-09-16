-- Migration: Initial Data
-- This migration inserts initial site settings and sample data

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Coupons are viewable by everyone" ON public.coupons;
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON public.site_settings;

-- Insert initial site settings
INSERT INTO public.site_settings (key, value, description) VALUES
('site_name', '"Aurealis Cosmetics"', 'The name of the website'),
('site_description', '"Premium cosmetics and skincare products"', 'Site description for SEO'),
('currency', '"EGP"', 'Default currency'),
('tax_rate', '14', 'Default tax rate percentage'),
('shipping_cost', '50', 'Default shipping cost'),
('free_shipping_threshold', '500', 'Minimum order amount for free shipping'),
('contact_email', '"support@aurealis.com"', 'Contact email address'),
('contact_phone', '"+20 123 456 7890"', 'Contact phone number'),
('social_media', '{"facebook": "https://facebook.com/aurealis", "instagram": "https://instagram.com/aurealis", "twitter": "https://twitter.com/aurealis"}', 'Social media links')
ON CONFLICT (key) DO NOTHING;

-- Insert sample categories (these will be synced with Sariee later)
INSERT INTO public.categories (sariee_category_id, name, description, is_featured, sort_order) VALUES
('sample-skincare', 'Skincare', 'Premium skincare products for all skin types', true, 1),
('sample-makeup', 'Makeup', 'High-quality makeup products and cosmetics', true, 2),
('sample-fragrance', 'Fragrance', 'Luxury fragrances and perfumes', true, 3),
('sample-hair-care', 'Hair Care', 'Professional hair care products', true, 4),
('sample-bath-body', 'Bath & Body', 'Luxurious bath and body products', true, 5)
ON CONFLICT (sariee_category_id) DO NOTHING;

-- Insert sample products (these will be synced with Sariee later)
INSERT INTO public.products (sariee_product_id, name, description, price, sku, inventory_quantity, is_featured) VALUES
('sample-serum-001', 'Hydrating Face Serum', 'Intensive hydration serum with hyaluronic acid', 299.99, 'SERUM-001', 50, true),
('sample-lipstick-001', 'Matte Lipstick Collection', 'Long-lasting matte lipstick in 12 shades', 149.99, 'LIP-001', 30, true),
('sample-perfume-001', 'Signature Perfume', 'Elegant floral fragrance for special occasions', 599.99, 'PERF-001', 25, true),
('sample-hair-mask-001', 'Nourishing Hair Mask', 'Deep conditioning treatment for damaged hair', 199.99, 'HAIR-001', 40, true)
ON CONFLICT (sariee_product_id) DO NOTHING;

-- Link products to categories
INSERT INTO public.product_categories (product_id, category_id, is_primary) 
SELECT p.id, c.id, true
FROM public.products p, public.categories c
WHERE p.sariee_product_id = 'sample-serum-001' AND c.sariee_category_id = 'sample-skincare'
ON CONFLICT (product_id, category_id) DO NOTHING;

INSERT INTO public.product_categories (product_id, category_id, is_primary) 
SELECT p.id, c.id, true
FROM public.products p, public.categories c
WHERE p.sariee_product_id = 'sample-lipstick-001' AND c.sariee_category_id = 'sample-makeup'
ON CONFLICT (product_id, category_id) DO NOTHING;

INSERT INTO public.product_categories (product_id, category_id, is_primary) 
SELECT p.id, c.id, true
FROM public.products p, public.categories c
WHERE p.sariee_product_id = 'sample-perfume-001' AND c.sariee_category_id = 'sample-fragrance'
ON CONFLICT (product_id, category_id) DO NOTHING;

INSERT INTO public.product_categories (product_id, category_id, is_primary) 
SELECT p.id, c.id, true
FROM public.products p, public.categories c
WHERE p.sariee_product_id = 'sample-hair-mask-001' AND c.sariee_category_id = 'sample-hair-care'
ON CONFLICT (product_id, category_id) DO NOTHING;

-- Insert sample coupons
INSERT INTO public.coupons (code, name, description, discount_type, discount_value, minimum_amount, usage_limit, is_active) VALUES
('WELCOME10', 'Welcome Discount', '10% off your first order', 'percentage', 10.00, 100.00, 1000, true),
('SAVE50', 'Save 50 EGP', '50 EGP off orders over 300 EGP', 'fixed', 50.00, 300.00, 500, true),
('FREESHIP', 'Free Shipping', 'Free shipping on all orders', 'fixed', 50.00, 0.00, 10000, true)
ON CONFLICT (code) DO NOTHING;
