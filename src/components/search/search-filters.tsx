'use client';

import { useState, useEffect } from 'react';
import sarieeApi from '@/lib/sariee-api';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface SearchFiltersProps {
  currentCategory: string;
  currentMinPrice: string;
  currentMaxPrice: string;
  currentSort: string;
  onFilterChange: (params: Record<string, string | null>) => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function SearchFilters({
  currentCategory,
  currentMinPrice,
  currentMaxPrice,
  currentSort,
  onFilterChange,
}: SearchFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await sarieeApi.getCategories();
      if (response.status && response.data) {
        // Convert Sariee categories to our format
        const categoriesData: Category[] = response.data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
        }));
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortOptions = [
    { value: 'created_at', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'price', label: 'Price Low to High' },
    { value: 'popularity', label: 'Most Popular' },
  ];

  const priceRanges = [
    { value: '0-50', label: 'Under 50 EGP' },
    { value: '50-100', label: '50 - 100 EGP' },
    { value: '100-200', label: '100 - 200 EGP' },
    { value: '200-500', label: '200 - 500 EGP' },
    { value: '500+', label: '500+ EGP' },
  ];

  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({ category: categoryId || null });
  };

  const handlePriceRangeChange = (range: string) => {
    if (range === '') {
      onFilterChange({ min_price: null, max_price: null });
    } else {
      const [min, max] = range.split('-');
      onFilterChange({
        min_price: min || null,
        max_price: max || null,
      });
    }
  };

  const handleSortChange = (sort: string) => {
    onFilterChange({ sort });
  };

  const clearAllFilters = () => {
    onFilterChange({
      category: null,
      min_price: null,
      max_price: null,
      sort: 'created_at',
    });
  };

  const hasActiveFilters = currentCategory || currentMinPrice || currentMaxPrice || currentSort !== 'created_at';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <span className="font-medium text-gray-900">Filters</span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 sm:p-6 space-y-6">
          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pb-4 border-b border-gray-200">
              <button
                onClick={clearAllFilters}
                className="text-sm text-pink-600 hover:text-pink-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Sort */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Sort by</h3>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
            <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex items-center py-2">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={!currentCategory}
                    onChange={() => handleCategoryChange('')}
                    className="mr-3 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">All Categories</span>
                </label>
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center py-2">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={currentCategory === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      className="mr-3 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
            <div className="space-y-2">
              <label className="flex items-center py-2">
                <input
                  type="radio"
                  name="price"
                  value=""
                  checked={!currentMinPrice && !currentMaxPrice}
                  onChange={() => handlePriceRangeChange('')}
                  className="mr-3 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">All Prices</span>
              </label>
              {priceRanges.map((range) => (
                <label key={range.value} className="flex items-center py-2">
                  <input
                    type="radio"
                    name="price"
                    value={range.value}
                    checked={
                      (range.value === '500+' && currentMinPrice === '500') ||
                      (range.value !== '500+' && 
                       currentMinPrice === range.value.split('-')[0] && 
                       currentMaxPrice === range.value.split('-')[1])
                    }
                    onChange={() => handlePriceRangeChange(range.value)}
                    className="mr-3 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Price Range */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Custom Price Range</h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={currentMinPrice}
                onChange={(e) => onFilterChange({ min_price: e.target.value || null })}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={currentMaxPrice}
                onChange={(e) => onFilterChange({ max_price: e.target.value || null })}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
