import { Suspense } from 'react';
import { CartProvider } from '@/contexts/cart-context';
import CartContent from '@/components/cart/cart-content';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function CartPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Review your items before checkout
            </p>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <CartContent />
          </Suspense>
        </div>
      </div>
    </CartProvider>
  );
}

export const metadata = {
  title: 'Shopping Cart - Aurealis Cosmetics',
  description: 'Review your selected products and proceed to checkout',
};
