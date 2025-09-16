import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Link from 'next/link';

// Default categories for when Supabase is not available
const defaultCategories = [
  {
    id: '1',
    sariee_category_id: 'skincare',
    name: 'Skincare',
    description: 'Nourish and protect your skin with our premium skincare collection',
    image_url: '/categories/skincare.jpg',
    is_active: true,
    sort_order: 1
  },
  {
    id: '2',
    sariee_category_id: 'makeup',
    name: 'Makeup',
    description: 'Enhance your natural beauty with our professional makeup line',
    image_url: '/categories/makeup.jpg',
    is_active: true,
    sort_order: 2
  },
  {
    id: '3',
    sariee_category_id: 'fragrance',
    name: 'Fragrance',
    description: 'Signature scents for every occasion and mood',
    image_url: '/categories/fragrance.jpg',
    is_active: true,
    sort_order: 3
  },
  {
    id: '4',
    sariee_category_id: 'hair-care',
    name: 'Hair Care',
    description: 'Healthy, beautiful hair starts with the right care routine',
    image_url: '/categories/hair-care.jpg',
    is_active: true,
    sort_order: 4
  },
  {
    id: '5',
    sariee_category_id: 'bath-body',
    name: 'Bath & Body',
    description: 'Pamper yourself with our luxurious bath and body products',
    image_url: '/categories/bath-body.jpg',
    is_active: true,
    sort_order: 5
  },
  {
    id: '6',
    sariee_category_id: 'tools',
    name: 'Tools & Accessories',
    description: 'Everything you need for perfect application and styling',
    image_url: '/categories/tools.jpg',
    is_active: true,
    sort_order: 6
  }
];

async function getCategories() {
  // Check if Supabase is properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    return defaultCategories;
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.warn('Supabase not available, using default categories:', error.message);
    return defaultCategories;
  }

  return categories || defaultCategories;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections of premium cosmetics and skincare products
          </p>
        </div>

        {/* Categories Grid */}
        <Suspense fallback={<LoadingSpinner className="py-12" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.sariee_category_id}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  {/* Category Image */}
                  <div className="aspect-square relative">
                    <div 
                      className="w-full h-full bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundImage: `url(${category.image_url || '/placeholder-category.jpg'})`
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-200" />
                    
                    {/* Category Name Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-2xl sm:text-3xl font-bold text-white text-center px-4">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  {/* Category Description */}
                  <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                    
                    {/* Shop Now Button */}
                    <div className="mt-4">
                      <span className="inline-flex items-center text-pink-600 font-medium group-hover:text-pink-700 transition-colors">
                        Shop {category.name}
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Suspense>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Browse our complete product catalog or use our search feature to find exactly what you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors"
              >
                View All Products
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Search Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Categories - Aurealis Cosmetics',
  description: 'Browse our premium cosmetics and skincare products by category',
};
