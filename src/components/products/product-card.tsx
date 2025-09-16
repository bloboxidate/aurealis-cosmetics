'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, state } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(product.id);

  const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0];
  const category = product.product_categories?.[0]?.categories;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await addToCart(product);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <Link href={`/products/${product.sariee_product_id}`} className="block">
        {/* Product Image */}
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 flex flex-col gap-1">
            {product.is_featured && (
              <span className="bg-pink-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                Featured
              </span>
            )}
            {product.compare_price && product.compare_price > product.price && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium">
                Sale
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1.5 sm:p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors duration-200"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-600" />
            ) : (
              <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4">
          {/* Category */}
          {category && (
            <p className="text-xs text-gray-500 mb-1 truncate">{category.name}</p>
          )}
          
          {/* Product Name */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors text-sm sm:text-base">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.inventory_quantity === 0}
            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-medium rounded-md transition-colors duration-200"
          >
            {state.isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : product.inventory_quantity === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCartIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </>
            )}
          </button>
        </div>
      </Link>
    </div>
  );
}
