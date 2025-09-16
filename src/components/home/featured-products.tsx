'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inventory: number;
  sku: string;
  is_active: boolean;
}

const defaultProducts = [
  {
    id: '1',
    name: 'Hydrating Face Serum',
    description: 'Intensive hydration for all skin types',
    price: 45.99,
    category: 'skincare',
    images: ['/products/serum-1.jpg'],
    inventory: 50,
    sku: 'SERUM-001',
    is_active: true
  },
  {
    id: '2',
    name: 'Matte Lipstick Collection',
    description: 'Long-lasting matte finish in 12 shades',
    price: 24.99,
    category: 'makeup',
    images: ['/products/lipstick-1.jpg'],
    inventory: 30,
    sku: 'LIP-001',
    is_active: true
  },
  {
    id: '3',
    name: 'Signature Perfume',
    description: 'Elegant floral fragrance for special occasions',
    price: 89.99,
    category: 'fragrance',
    images: ['/products/perfume-1.jpg'],
    inventory: 25,
    sku: 'PERF-001',
    is_active: true
  },
  {
    id: '4',
    name: 'Nourishing Hair Mask',
    description: 'Deep conditioning treatment for damaged hair',
    price: 32.99,
    category: 'hair-care',
    images: ['/products/hair-mask-1.jpg'],
    inventory: 40,
    sku: 'HAIR-001',
    is_active: true
  }
];

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .limit(8)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          setProducts(defaultProducts);
        } else if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error:', error);
        setProducts(defaultProducts);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product: Product) => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', product);
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Discover our bestsellers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-64 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <p className="text-lg text-gray-600">Discover our bestsellers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <Link href={`/product/${product.id}`}>
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={product.images[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''
                      }`} 
                    />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">(4.8)</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </button>
                </div>

                {product.inventory < 10 && product.inventory > 0 && (
                  <p className="text-xs text-orange-600 mt-2">
                    Only {product.inventory} left in stock!
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
