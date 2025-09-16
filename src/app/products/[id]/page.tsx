import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductDetail from '@/components/products/product-detail';
import RelatedProducts from '@/components/products/related-products';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Suspense } from 'react';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Default products for when Supabase is not available
const defaultProducts = [
  {
    id: '1',
    sariee_product_id: '1',
    name: 'Hydrating Face Serum',
    description: 'Intensive hydration for all skin types with hyaluronic acid and vitamin C. This lightweight serum penetrates deep into the skin to provide long-lasting moisture and improve skin texture.',
    short_description: 'Intensive hydration for all skin types',
    price: 45.99,
    compare_price: 59.99,
    sku: 'SERUM-001',
    brand: 'Aurealis',
    inventory_quantity: 50,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/serum-1.jpg', alt_text: 'Hydrating Face Serum', is_primary: true, sort_order: 1 },
      { image_url: '/products/serum-1.jpg', alt_text: 'Hydrating Face Serum - Side View', is_primary: false, sort_order: 2 }
    ],
    product_categories: [
      { categories: { name: 'Skincare', sariee_category_id: 'skincare' } }
    ],
    product_variants: []
  },
  {
    id: '2',
    sariee_product_id: '2',
    name: 'Matte Lipstick Collection',
    description: 'Long-lasting matte finish in 12 beautiful shades. Our matte lipstick provides up to 8 hours of wear with a comfortable, non-drying formula.',
    short_description: 'Long-lasting matte finish in 12 beautiful shades',
    price: 24.99,
    compare_price: null,
    sku: 'LIP-001',
    brand: 'Aurealis',
    inventory_quantity: 30,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/lipstick-1.jpg', alt_text: 'Matte Lipstick Collection', is_primary: true, sort_order: 1 }
    ],
    product_categories: [
      { categories: { name: 'Makeup', sariee_category_id: 'makeup' } }
    ],
    product_variants: [
      {
        id: '2-1',
        name: 'Classic Red',
        sku: 'LIP-001-RED',
        price: 24.99,
        inventory_quantity: 15,
        attributes: { color: 'red' },
        image_url: '/products/lipstick-1.jpg',
        is_active: true
      },
      {
        id: '2-2',
        name: 'Nude Pink',
        sku: 'LIP-001-PINK',
        price: 24.99,
        inventory_quantity: 15,
        attributes: { color: 'pink' },
        image_url: '/products/lipstick-1.jpg',
        is_active: true
      }
    ]
  },
  {
    id: '3',
    sariee_product_id: '3',
    name: 'Signature Perfume',
    description: 'Elegant floral fragrance for special occasions. A sophisticated blend of jasmine, rose, and sandalwood that creates a lasting impression.',
    short_description: 'Elegant floral fragrance for special occasions',
    price: 89.99,
    compare_price: 120.00,
    sku: 'PERF-001',
    brand: 'Aurealis',
    inventory_quantity: 25,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/perfume-1.jpg', alt_text: 'Signature Perfume', is_primary: true, sort_order: 1 }
    ],
    product_categories: [
      { categories: { name: 'Fragrance', sariee_category_id: 'fragrance' } }
    ],
    product_variants: []
  },
  {
    id: '4',
    sariee_product_id: '4',
    name: 'Nourishing Hair Mask',
    description: 'Deep conditioning treatment for damaged hair. Enriched with argan oil and keratin to restore strength and shine to your hair.',
    short_description: 'Deep conditioning treatment for damaged hair',
    price: 32.99,
    compare_price: null,
    sku: 'HAIR-001',
    brand: 'Aurealis',
    inventory_quantity: 40,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/hair-mask-1.jpg', alt_text: 'Nourishing Hair Mask', is_primary: true, sort_order: 1 }
    ],
    product_categories: [
      { categories: { name: 'Hair Care', sariee_category_id: 'hair-care' } }
    ],
    product_variants: []
  },
  {
    id: '5',
    sariee_product_id: '5',
    name: 'Vitamin C Brightening Cream',
    description: 'Brighten and even skin tone with powerful vitamin C. This antioxidant-rich cream helps reduce dark spots and promotes a radiant complexion.',
    short_description: 'Brighten and even skin tone with powerful vitamin C',
    price: 38.99,
    compare_price: 49.99,
    sku: 'VITC-001',
    brand: 'Aurealis',
    inventory_quantity: 35,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/serum-1.jpg', alt_text: 'Vitamin C Brightening Cream', is_primary: true, sort_order: 1 }
    ],
    product_categories: [
      { categories: { name: 'Skincare', sariee_category_id: 'skincare' } }
    ],
    product_variants: []
  },
  {
    id: '6',
    sariee_product_id: '6',
    name: 'Luxury Bath Oil',
    description: 'Indulgent bath oil with essential oils for relaxation. Transform your bath into a spa-like experience with this luxurious blend.',
    short_description: 'Indulgent bath oil with essential oils for relaxation',
    price: 28.99,
    compare_price: null,
    sku: 'BATH-001',
    brand: 'Aurealis',
    inventory_quantity: 20,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/hair-mask-1.jpg', alt_text: 'Luxury Bath Oil', is_primary: true, sort_order: 1 }
    ],
    product_categories: [
      { categories: { name: 'Bath & Body', sariee_category_id: 'bath-body' } }
    ],
    product_variants: []
  }
];

async function getProduct(productId: string) {
  // Check if Supabase is properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    // Use default products if Supabase is not configured
    const product = defaultProducts.find(p => p.sariee_product_id === productId);
    return product || null;
  }

  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images(image_url, alt_text, is_primary, sort_order),
      product_categories(
        category_id,
        categories(name, sariee_category_id)
      ),
      product_variants(
        id,
        name,
        sku,
        price,
        inventory_quantity,
        attributes,
        image_url,
        is_active
      )
    `)
    .eq('sariee_product_id', productId)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    console.warn('Supabase not available, checking default products:', error?.message);
    const defaultProduct = defaultProducts.find(p => p.sariee_product_id === productId);
    return defaultProduct || null;
  }

  return product;
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  // Check if Supabase is properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    // Use default products if Supabase is not configured
    const relatedProducts = defaultProducts
      .filter(p => 
        p.sariee_product_id !== currentProductId && 
        p.product_categories.some(pc => pc.categories.sariee_category_id === categoryId)
      )
      .slice(0, 4);
    return relatedProducts;
  }

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      product_images!inner(image_url, alt_text, is_primary),
      product_categories!inner(
        category_id,
        categories!inner(sariee_category_id)
      )
    `)
    .eq('is_active', true)
    .neq('sariee_product_id', currentProductId)
    .eq('product_categories.categories.sariee_category_id', categoryId)
    .limit(4);

  if (error) {
    console.warn('Supabase not available, using default related products:', error.message);
    const relatedProducts = defaultProducts
      .filter(p => 
        p.sariee_product_id !== currentProductId && 
        p.product_categories.some(pc => pc.categories.sariee_category_id === categoryId)
      )
      .slice(0, 4);
    return relatedProducts;
  }

  return products || [];
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const primaryCategory = product.product_categories?.[0]?.categories;
  const relatedProducts = primaryCategory 
    ? await getRelatedProducts(primaryCategory.sariee_category_id, id)
    : [];

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <ProductDetail product={product} />
        </Suspense>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <RelatedProducts 
              products={relatedProducts}
              categoryName={primaryCategory?.name || 'Related Products'}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found - Aurealis Cosmetics',
    };
  }

  return {
    title: `${product.name} - Aurealis Cosmetics`,
    description: product.description || product.short_description,
    openGraph: {
      title: product.name,
      description: product.description || product.short_description,
      images: product.product_images?.map(img => ({
        url: img.image_url,
        alt: img.alt_text || product.name,
      })),
    },
  };
}
