import { Suspense } from 'react';
import WishlistContent from '@/components/wishlist/wishlist-content';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <WishlistContent />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'My Wishlist - Aurealis Cosmetics',
  description: 'Your favorite cosmetics and beauty products',
};
