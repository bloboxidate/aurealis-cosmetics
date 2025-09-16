'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import { formatPrice } from '@/lib/utils';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function CartItems() {
  const { state, updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Cart Items ({state.totalItems})
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {state.items.map((item) => {
          const primaryImage = item.product.product_images?.find(img => img.is_primary) || 
                              item.product.product_images?.[0];
          
          return (
            <div key={item.id} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <Link href={`/products/${item.product.sariee_product_id}`}>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 relative overflow-hidden rounded-md bg-gray-100">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.image_url}
                          alt={primaryImage.alt_text || item.product.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 640px) 80px, 96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1">
                      <Link 
                        href={`/products/${item.product.sariee_product_id}`}
                        className="text-sm sm:text-base font-medium text-gray-900 hover:text-pink-600 transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      
                      {item.variant && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          {item.variant.name}
                        </p>
                      )}
                      
                      <p className="text-sm sm:text-base font-bold text-gray-900 mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={state.isLoading}
                          className="p-1 sm:p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        
                        <span className="px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={state.isLoading}
                          className="p-1 sm:p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        disabled={state.isLoading}
                        className="p-1 sm:p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="mt-2 sm:mt-3 flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-500">Item Total:</span>
                    <span className="text-sm sm:text-base font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="px-4 sm:px-6 py-3 bg-red-50 border-t border-red-200">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}
    </div>
  );
}
