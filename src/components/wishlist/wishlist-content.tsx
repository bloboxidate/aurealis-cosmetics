'use client';

import { useWishlist } from '@/contexts/wishlist-context';
import WishlistItems from '@/components/wishlist/wishlist-items';
import EmptyWishlist from '@/components/wishlist/empty-wishlist';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function WishlistContent() {
  const { items, isLoading, error } = useWishlist();

  if (isLoading) {
    return <LoadingSpinner className="py-12" />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          My Wishlist
        </h1>
        <p className="text-gray-600">
          {items.length > 0 
            ? `${items.length} ${items.length === 1 ? 'item' : 'items'} in your wishlist`
            : 'No items in your wishlist yet'
          }
        </p>
      </div>

      {/* Wishlist Items */}
      {items.length > 0 ? (
        <WishlistItems items={items} />
      ) : (
        <EmptyWishlist />
      )}
    </div>
  );
}
