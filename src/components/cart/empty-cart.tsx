'use client';

import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function EmptyCart() {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        {/* Empty Cart Icon */}
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
        </div>

        {/* Message */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md transition-colors"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            Start Shopping
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Popular Categories</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {['Skincare', 'Makeup', 'Fragrance', 'Hair Care'].map((category) => (
              <Link
                key={category}
                href={`/products?category=${category.toLowerCase().replace(' ', '-')}`}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
