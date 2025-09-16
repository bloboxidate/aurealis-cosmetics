'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

const defaultCategories = [
  {
    id: 'skincare',
    name: 'Skincare',
    description: 'Nourish and protect your skin',
    image_url: '/categories/skincare.jpg',
    is_active: true
  },
  {
    id: 'makeup',
    name: 'Makeup',
    description: 'Enhance your natural beauty',
    image_url: '/categories/makeup.jpg',
    is_active: true
  },
  {
    id: 'fragrance',
    name: 'Fragrance',
    description: 'Signature scents for every occasion',
    image_url: '/categories/fragrance.jpg',
    is_active: true
  },
  {
    id: 'hair-care',
    name: 'Hair Care',
    description: 'Healthy, beautiful hair starts here',
    image_url: '/categories/hair-care.jpg',
    is_active: true
  },
  {
    id: 'bath-body',
    name: 'Bath & Body',
    description: 'Pamper yourself with luxury',
    image_url: '/categories/bath-body.jpg',
    is_active: true
  },
  {
    id: 'tools-accessories',
    name: 'Tools & Accessories',
    description: 'Everything you need for perfect application',
    image_url: '/categories/tools.jpg',
    is_active: true
  }
];

export function Categories() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Check if Supabase is properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
          // Use default categories if Supabase is not configured
          setCategories(defaultCategories);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (error) {
          console.warn('Supabase not available, using default categories:', error.message);
          setCategories(defaultCategories);
        } else if (data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.warn('Error connecting to Supabase, using default categories:', error);
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Discover our curated collections</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-32 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600">Discover our curated collections</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="aspect-square">
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `url(${category.image_url || '/placeholder-category.jpg'})`
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-200" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
