'use client';

import { useCart } from '@/contexts/cart-context';
import CartItems from './cart-items';
import CartSummary from './cart-summary';
import EmptyCart from './empty-cart';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function CartContent() {
  const { state } = useCart();

  if (state.isLoading) {
    return <LoadingSpinner className="py-12" />;
  }

  if (state.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <CartItems />
      </div>

      {/* Cart Summary */}
      <div className="lg:col-span-1">
        <CartSummary />
      </div>
    </div>
  );
}
