import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductGrid from '@/components/products/product-grid';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Suspense } from 'react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !category) {
      return null;
    }

    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function getCategoryProducts(categoryId: string) {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images(*),
        product_categories(
          *,
          categories(*)
        ),
        product_variants(*)
      `)
      .eq('product_categories.category_id', categoryId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    notFound();
  }

  const products = await getCategoryProducts(category.id);

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 max-w-3xl">
              {category.description}
            </p>
          )}
        </div>

        {/* Products Grid */}
        <Suspense fallback={<LoadingSpinner className="py-12" />}>
          <ProductGrid 
            products={products} 
            totalPages={1}
            currentPage={1}
            searchParams={{}}
          />
        </Suspense>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found - Aurealis Cosmetics',
    };
  }

  return {
    title: `${category.name} - Aurealis Cosmetics`,
    description: category.description || `Shop ${category.name} products at Aurealis Cosmetics`,
  };
}
