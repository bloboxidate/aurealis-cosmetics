'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import sarieeApi from '@/lib/sariee-api';
import { Product } from '@/lib/supabase';
import ProductGrid from '@/components/products/product-grid';
import SearchFilters from '@/components/search/search-filters';
import SearchHeader from '@/components/search/search-header';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface SearchContentProps {
  searchParams: {
    q?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
    sort?: string;
    page?: string;
  };
}

interface SearchResults {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export default function SearchContent({ searchParams }: SearchContentProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const [results, setResults] = useState<SearchResults>({
    products: [],
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    performSearch();
  }, [searchParams]);

  const performSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare search parameters
      const searchParams = {
        query: urlSearchParams.get('q') || undefined,
        category: urlSearchParams.get('category') || undefined,
        min_price: urlSearchParams.get('min_price') ? parseFloat(urlSearchParams.get('min_price')!) : undefined,
        max_price: urlSearchParams.get('max_price') ? parseFloat(urlSearchParams.get('max_price')!) : undefined,
        sort: (urlSearchParams.get('sort') as 'name' | 'price' | 'created_at' | 'popularity') || 'created_at',
        sort_direction: 'desc' as 'asc' | 'desc',
        per_page: 12,
        page: urlSearchParams.get('page') ? parseInt(urlSearchParams.get('page')!) : 1,
        type: 'unseperated' as 'seperated' | 'unseperated',
      };

      // Call Sariee API search
      const response = await sarieeApi.searchProducts(searchParams);
      
      if (response.status && response.data) {
        // Convert Sariee products to our format
        const products: Product[] = response.data.map((sarieeProduct: any) => ({
          id: sarieeProduct.id,
          sariee_product_id: sarieeProduct.id,
          name: sarieeProduct.name || 'Product',
          description: sarieeProduct.description || '',
          price: sarieeProduct.price || 0,
          compare_price: sarieeProduct.compare_price,
          sku: sarieeProduct.sku || '',
          inventory_quantity: sarieeProduct.inventory_quantity || 0,
          is_featured: sarieeProduct.is_featured || false,
          is_active: sarieeProduct.is_active !== false,
          created_at: sarieeProduct.created_at || new Date().toISOString(),
          updated_at: sarieeProduct.updated_at || new Date().toISOString(),
          // Map Sariee product images
          product_images: sarieeProduct.images?.map((img: any, index: number) => ({
            id: img.id || `img_${index}`,
            product_id: sarieeProduct.id,
            image_url: img.src || img.url,
            alt_text: img.alt || sarieeProduct.name,
            is_primary: index === 0,
            sort_order: index,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })) || [],
          // Map Sariee categories
          product_categories: sarieeProduct.categories?.map((cat: any) => ({
            id: `pc_${cat.id}`,
            product_id: sarieeProduct.id,
            category_id: cat.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categories: {
              id: cat.id,
              name: cat.name,
              slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
              description: cat.description || '',
              image_url: cat.image?.src || null,
              is_featured: cat.is_featured || false,
              is_active: cat.is_active !== false,
              sort_order: cat.sort_order || 0,
              created_at: cat.created_at || new Date().toISOString(),
              updated_at: cat.updated_at || new Date().toISOString(),
            },
          })) || [],
          // Map Sariee variants
          product_variants: sarieeProduct.variants?.map((variant: any) => ({
            id: variant.id,
            product_id: sarieeProduct.id,
            name: variant.name || 'Default',
            sku: variant.sku || '',
            price: variant.price || sarieeProduct.price,
            inventory_quantity: variant.inventory_quantity || 0,
            is_active: variant.is_active !== false,
            created_at: variant.created_at || new Date().toISOString(),
            updated_at: variant.updated_at || new Date().toISOString(),
          })) || [],
        }));

        // Calculate pagination info
        const totalCount = response._meta?.pagination?.total || products.length;
        const currentPage = response._meta?.pagination?.current_page || 1;
        const totalPages = response._meta?.pagination?.last_page || 1;

        setResults({
          products,
          totalCount,
          currentPage,
          totalPages,
        });
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSearchParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(urlSearchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    // Reset to page 1 when changing search parameters
    if (Object.keys(newParams).some(key => key !== 'page')) {
      params.delete('page');
    }

    router.push(`/search?${params.toString()}`);
  };

  if (isLoading) {
    return <LoadingSpinner className="py-12" />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={performSearch}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <SearchHeader 
        searchQuery={urlSearchParams.get('q') || ''}
        totalResults={results.totalCount}
        onSearch={(query) => updateSearchParams({ q: query })}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Search Filters */}
        <div className="lg:col-span-1">
          <SearchFilters
            currentCategory={urlSearchParams.get('category') || ''}
            currentMinPrice={urlSearchParams.get('min_price') || ''}
            currentMaxPrice={urlSearchParams.get('max_price') || ''}
            currentSort={urlSearchParams.get('sort') || 'created_at'}
            onFilterChange={updateSearchParams}
          />
        </div>

        {/* Search Results */}
        <div className="lg:col-span-3">
          {results.products.length > 0 ? (
            <ProductGrid 
              products={results.products}
              totalPages={results.totalPages}
              currentPage={results.currentPage}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search criteria or browse our categories
              </p>
              <button
                onClick={() => updateSearchParams({ q: null, category: null, min_price: null, max_price: null })}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
