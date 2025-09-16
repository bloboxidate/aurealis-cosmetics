import { Suspense } from 'react';
import { CartProvider } from '@/contexts/cart-context';
import CheckoutContent from '@/components/checkout/checkout-content';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function CheckoutPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Complete your order securely
            </p>
          </div>

          <Suspense fallback={<LoadingSpinner />}>
            <CheckoutContent />
          </Suspense>
        </div>
      </div>
    </CartProvider>
  );
}

export const metadata = {
  title: 'Checkout - Aurealis Cosmetics',
  description: 'Complete your order securely with our checkout process',
};
