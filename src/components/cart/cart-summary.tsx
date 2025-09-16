'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import { formatPrice } from '@/lib/utils';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function CartSummary() {
  const { state } = useCart();

  // Calculate totals
  const subtotal = state.totalPrice;
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500 EGP
  const tax = subtotal * 0.14; // 14% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      </div>

      <div className="px-4 sm:px-6 py-4 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({state.totalItems} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (14%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        {/* Free Shipping Notice */}
        {shipping > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-700">
              Add {formatPrice(500 - subtotal)} more for free shipping!
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md transition-colors"
        >
          <ShoppingBagIcon className="w-5 h-5" />
          Proceed to Checkout
        </Link>

        {/* Continue Shopping */}
        <Link
          href="/products"
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors"
        >
          Continue Shopping
        </Link>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 text-center pt-2">
          <p>🔒 Secure checkout with SSL encryption</p>
        </div>
      </div>
    </div>
  );
}
