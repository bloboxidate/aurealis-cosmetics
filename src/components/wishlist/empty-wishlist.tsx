import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/outline';

export default function EmptyWishlist() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <HeartIcon className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
        Your wishlist is empty
      </h3>
      
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Start adding products you love to your wishlist. You can save items for later and easily find them when you're ready to purchase.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/products"
          className="px-6 py-3 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors font-medium"
        >
          Browse Products
        </Link>
        
        <Link
          href="/"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
