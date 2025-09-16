import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductDetail from '@/components/products/product-detail';
import RelatedProducts from '@/components/products/related-products';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Suspense } from 'react';

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(productId: string) {
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
    return null;
  }

  return product;
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
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
    console.error('Error fetching related products:', error);
    return [];
  }

  return products || [];
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const primaryCategory = product.product_categories?.[0]?.categories;
  const relatedProducts = primaryCategory 
    ? await getRelatedProducts(primaryCategory.sariee_category_id, params.id)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
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
  const product = await getProduct(params.id);

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
