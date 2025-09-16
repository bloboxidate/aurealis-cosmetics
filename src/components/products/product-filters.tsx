'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/supabase';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ProductFiltersProps {
  categories: Category[];
  currentCategory?: string;
  currentSearch?: string;
  currentSort?: string;
}

export default function ProductFilters({ 
  categories, 
  currentCategory, 
  currentSearch, 
  currentSort 
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'created_at', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: 'featured', label: 'Featured First' },
  ];

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/products');
  };

  const hasActiveFilters = currentCategory || currentSearch || currentSort;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      {/* Mobile Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
        >
          <span className="font-medium text-sm sm:text-base">Filters</span>
          <ChevronDownIcon className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} lg:block space-y-4 sm:space-y-6`}>
        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="mb-6">
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700"
            >
              <XMarkIcon className="w-4 h-4" />
              Clear all filters
            </button>
          </div>
        )}

        {/* Sort */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Sort by</h3>
          <select
            value={currentSort || 'created_at'}
            onChange={(e) => updateFilters('sort', e.target.value)}
            className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Categories</h3>
          <div className="space-y-1 sm:space-y-2">
            <label className="flex items-center py-1 sm:py-2">
              <input
                type="radio"
                name="category"
                value=""
                checked={!currentCategory}
                onChange={() => updateFilters('category', null)}
                className="mr-2 sm:mr-3 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-xs sm:text-sm text-gray-700">All Categories</span>
            </label>
            {categories.map((category) => (
              <label key={category.id} className="flex items-center py-1 sm:py-2">
                <input
                  type="radio"
                  name="category"
                  value={category.sariee_category_id}
                  checked={currentCategory === category.sariee_category_id}
                  onChange={() => updateFilters('category', category.sariee_category_id)}
                  className="mr-2 sm:mr-3 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-xs sm:text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Price Range</h3>
          <div className="space-y-1 sm:space-y-2">
            <label className="flex items-center py-1 sm:py-2">
              <input
                type="radio"
                name="price"
                value=""
                className="mr-2 sm:mr-3 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-xs sm:text-sm text-gray-700">All Prices</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="0-100"
                className="mr-3 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">Under 100 EGP</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="100-300"
                className="mr-3 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">100 - 300 EGP</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="300-500"
                className="mr-3 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">300 - 500 EGP</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="price"
                value="500+"
                className="mr-3 text-pink-600 focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">Over 500 EGP</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
