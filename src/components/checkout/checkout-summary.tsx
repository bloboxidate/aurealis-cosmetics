'use client';

import { CartItem } from '@/contexts/cart-context';
import { Address, PaymentMethod } from './checkout-content';
import { formatPrice } from '@/lib/utils';
import { MapPinIcon, CreditCardIcon, TruckIcon } from '@heroicons/react/24/outline';

interface CheckoutSummaryProps {
  items: CartItem[];
  shippingAddress: Address | null;
  selectedPaymentMethod: PaymentMethod | null;
}

export default function CheckoutSummary({
  items,
  shippingAddress,
  selectedPaymentMethod,
}: CheckoutSummaryProps) {
  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.14; // 14% tax
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  };

  const totals = calculateTotals();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
      </div>

      <div className="px-4 sm:px-6 py-4 space-y-4">
        {/* Items Count */}
        <div className="text-sm text-gray-600">
          {totalItems} {totalItems === 1 ? 'item' : 'items'} in your order
        </div>

        {/* Shipping Address Preview */}
        {shippingAddress && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <MapPinIcon className="w-4 h-4 mr-2" />
              Shipping to
            </h3>
            <div className="text-sm text-gray-600">
              <p className="font-medium">{shippingAddress.name}</p>
              <p className="truncate">
                {shippingAddress.street}, {shippingAddress.building}
              </p>
              <p>Floor {shippingAddress.floor}, Flat {shippingAddress.flat}</p>
            </div>
          </div>
        )}

        {/* Payment Method Preview */}
        {selectedPaymentMethod && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <CreditCardIcon className="w-4 h-4 mr-2" />
              Payment Method
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="text-lg">{selectedPaymentMethod.icon}</span>
              <span>{selectedPaymentMethod.name}</span>
            </div>
          </div>
        )}

        {/* Shipping Info */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <TruckIcon className="w-4 h-4 mr-2" />
            Delivery
          </h3>
          <div className="text-sm text-gray-600">
            <p>Standard Delivery</p>
            <p>3-5 business days</p>
            {totals.shipping === 0 && (
              <p className="text-green-600 font-medium">Free shipping!</p>
            )}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">{formatPrice(totals.subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">
              {totals.shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                formatPrice(totals.shipping)
              )}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (14%)</span>
            <span className="font-medium">{formatPrice(totals.tax)}</span>
          </div>
          
          {/* Free Shipping Notice */}
          {totals.shipping > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
              <p className="text-xs text-blue-700">
                Add {formatPrice(500 - totals.subtotal)} more for free shipping!
              </p>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatPrice(totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure checkout with SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
