'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
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
      const searchQuery = {
        query: urlSearchParams.get('q') || undefined,
        category: urlSearchParams.get('category') || undefined,
        min_price: urlSearchParams.get('min_price') ? parseFloat(urlSearchParams.get('min_price')!) : undefined,
        max_price: urlSearchParams.get('max_price') ? parseFloat(urlSearchParams.get('max_price')!) : undefined,
        sort: (urlSearchParams.get('sort') as 'name' | 'price' | 'created_at' | 'popularity') || 'created_at',
        sort_direction: 'desc' as 'asc' | 'desc',
        per_page: 12,
        page: urlSearchParams.get('page') ? parseInt(urlSearchParams.get('page')!) : 1,
      };

      // Build Supabase query
      let query = supabase
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
        .eq('is_active', true);

      // Apply search filters
      if (searchQuery.query) {
        query = query.or(`name.ilike.%${searchQuery.query}%,description.ilike.%${searchQuery.query}%`);
      }

      if (searchQuery.category) {
        query = query.eq('product_categories.categories.slug', searchQuery.category);
      }

      if (searchQuery.min_price !== undefined) {
        query = query.gte('price', searchQuery.min_price);
      }

      if (searchQuery.max_price !== undefined) {
        query = query.lte('price', searchQuery.max_price);
      }

      // Apply sorting
      const sortField = searchQuery.sort === 'name' ? 'name' : 
                       searchQuery.sort === 'price' ? 'price' : 'created_at';
      query = query.order(sortField, { ascending: searchQuery.sort_direction === 'asc' });

      // Apply pagination
      const from = (searchQuery.page - 1) * searchQuery.per_page;
      const to = from + searchQuery.per_page - 1;
      query = query.range(from, to);

      const { data: products, error, count } = await query;

      if (error) {
        throw new Error(error.message || 'Failed to search products');
      }

      // Calculate pagination info
      const totalCount = count || 0;
      const currentPage = searchQuery.page;
      const totalPages = Math.ceil(totalCount / searchQuery.per_page);

      setResults({
        products: products || [],
        totalCount,
        currentPage,
        totalPages,
      });
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
              searchParams={searchParams}
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
