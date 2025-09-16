'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, state } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(product.id);

  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) || [];
  const variants = product.product_variants?.filter(v => v.is_active) || [];
  const category = product.product_categories?.[0]?.categories;

  const currentPrice = selectedVariant 
    ? variants.find(v => v.id === selectedVariant)?.price || product.price
    : product.price;

  const currentInventory = selectedVariant
    ? variants.find(v => v.id === selectedVariant)?.inventory_quantity || product.inventory_quantity
    : product.inventory_quantity;

  const handleAddToCart = async () => {
    const variant = variants.find(v => v.id === selectedVariant);
    await addToCart(product, quantity, variant);
  };

  const handleWishlist = async () => {
    if (isWishlisted) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
        {/* Product Images */}
        <div className="space-y-3 sm:space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage].image_url}
                alt={images[selectedImage].alt_text || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-1.5 sm:gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded border-2 ${
                    selectedImage === index ? 'border-pink-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image.image_url}
                    alt={image.alt_text || product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4 sm:space-y-6">
          {/* Category */}
          {category && (
            <p className="text-sm text-pink-600 font-medium">{category.name}</p>
          )}

          {/* Product Name */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Price */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {formatPrice(currentPrice)}
            </span>
            <div className="flex items-center gap-2 sm:gap-3">
              {product.compare_price && product.compare_price > currentPrice && (
                <span className="text-lg sm:text-xl text-gray-500 line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
              {product.compare_price && product.compare_price > currentPrice && (
                <span className="bg-red-100 text-red-800 text-xs sm:text-sm font-medium px-2 py-1 rounded">
                  Save {formatPrice(product.compare_price - currentPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="prose prose-sm text-gray-600">
              <p>{product.description}</p>
            </div>
          )}

          {/* Variants */}
          {variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">Options</h3>
              <div className="flex flex-wrap gap-2">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`px-3 sm:px-4 py-2 border rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      selectedVariant === variant.id
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {variant.name}
                    {variant.price !== product.price && (
                      <span className="ml-1 text-xs">
                        ({formatPrice(variant.price)})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">Quantity</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 text-sm sm:text-base"
              >
                -
              </button>
              <span className="w-12 sm:w-16 text-center font-medium text-sm sm:text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(currentInventory, quantity + 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50 text-sm sm:text-base"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500">
              {currentInventory} available
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={state.isLoading || currentInventory === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm sm:text-base font-medium rounded-md transition-colors"
            >
              {state.isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : currentInventory === 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingCartIcon className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
            
            <button
              onClick={handleWishlist}
              className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors sm:w-auto w-full"
            >
            {isWishlisted ? (
              <HeartSolidIcon className="w-5 h-5 text-pink-600" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600" />
            )}
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900">SKU:</span>
                <span className="ml-2 text-gray-600">{product.sku || 'N/A'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900">Weight:</span>
                <span className="ml-2 text-gray-600">
                  {product.weight ? `${product.weight}g` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
