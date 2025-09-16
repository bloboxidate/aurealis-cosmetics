'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import { useWishlist } from '@/contexts/wishlist-context';
import { useCart } from '@/contexts/cart-context';
import { HeartIcon, ShoppingCartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface WishlistItemsProps {
  items: Product[];
}

export default function WishlistItems({ items }: WishlistItemsProps) {
  const { removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  const handleRemoveFromWishlist = async (productId: string) => {
    setLoadingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromWishlist(productId);
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToCart = async (product: Product) => {
    setLoadingItems(prev => new Set(prev).add(product.id));
    try {
      await addToCart(product, 1);
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }
  };

  const getProductImage = (product: Product) => {
    const primaryImage = product.product_images?.find(img => img.is_primary);
    return primaryImage?.image_url || product.product_images?.[0]?.image_url || '/placeholder-product.jpg';
  };

  const getProductPrice = (product: Product) => {
    const variant = product.product_variants?.[0];
    return variant?.price || product.price;
  };

  const getComparePrice = (product: Product) => {
    const variant = product.product_variants?.[0];
    return variant ? null : product.compare_price;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {items.map((product) => {
          const isLoading = loadingItems.has(product.id);
          const price = getProductPrice(product);
          const comparePrice = getComparePrice(product);
          const imageUrl = getProductImage(product);

          return (
            <div key={product.id} className="group relative">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                </Link>

                {/* Wishlist Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  disabled={isLoading}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  title="Remove from wishlist"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <HeartSolidIcon className="w-5 h-5 text-pink-600" />
                  )}
                </button>

                {/* Quick Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isLoading}
                      className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                      title="Add to cart"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ShoppingCartIcon className="w-5 h-5 text-gray-700" />
                      )}
                    </button>
                    <Link
                      href={`/products/${product.id}`}
                      className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                      title="View product"
                    >
                      <EyeIcon className="w-5 h-5 text-gray-700" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2 hover:text-pink-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Category */}
                {product.product_categories?.[0] && (
                  <p className="text-xs text-gray-500 mt-1">
                    {product.product_categories[0].categories.name}
                  </p>
                )}

                {/* Price */}
                <div className="mt-2 flex items-center space-x-2">
                  <span className="text-sm sm:text-base font-semibold text-gray-900">
                    {price.toFixed(2)} EGP
                  </span>
                  {comparePrice && comparePrice > price && (
                    <span className="text-xs text-gray-500 line-through">
                      {comparePrice.toFixed(2)} EGP
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                {product.inventory_quantity <= 0 && (
                  <p className="text-xs text-red-600 mt-1">Out of stock</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
