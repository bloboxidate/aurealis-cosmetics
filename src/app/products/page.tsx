import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import ProductGrid from '@/components/products/product-grid';
import ProductFilters from '@/components/products/product-filters';
import LoadingSpinner from '@/components/ui/loading-spinner';
import MobileSearch from '@/components/ui/mobile-search';

interface SearchParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
}

interface ProductsPageProps {
  searchParams: SearchParams;
}

async function getProducts(searchParams: SearchParams) {
  const { category, search, sort = 'created_at', page = '1' } = searchParams;
  const pageNumber = parseInt(page);
  const itemsPerPage = 12;
  const offset = (pageNumber - 1) * itemsPerPage;

  let query = supabase
    .from('products')
    .select(`
      *,
      product_images!inner(image_url, alt_text, is_primary),
      product_categories!inner(
        category_id,
        categories!inner(name, sariee_category_id)
      )
    `)
    .eq('is_active', true);

  // Filter by category
  if (category) {
    query = query.eq('product_categories.categories.sariee_category_id', category);
  }

  // Search functionality
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Sorting
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'featured':
      query = query.order('is_featured', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  // Pagination
  query = query.range(offset, offset + itemsPerPage - 1);

  const { data: products, error, count } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalCount: 0 };
  }

  return {
    products: products || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / itemsPerPage),
    currentPage: pageNumber
  };
}

async function getCategories() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories || [];
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [productsData, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories()
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {searchParams.category 
              ? categories.find(c => c.sariee_category_id === searchParams.category)?.name || 'Products'
              : 'All Products'
            }
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {searchParams.search 
              ? `Search results for "${searchParams.search}"`
              : `Showing ${productsData.products.length} of ${productsData.totalCount} products`
            }
          </p>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden mb-4">
          <MobileSearch />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <ProductFilters 
              categories={categories}
              currentCategory={searchParams.category}
              currentSearch={searchParams.search}
              currentSort={searchParams.sort}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 order-1 lg:order-2">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductGrid 
                products={productsData.products}
                totalPages={productsData.totalPages}
                currentPage={productsData.currentPage}
                searchParams={searchParams}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Products - Aurealis Cosmetics',
  description: 'Discover our premium collection of cosmetics and skincare products',
};
