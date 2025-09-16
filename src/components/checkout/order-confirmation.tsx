'use client';

import Link from 'next/link';
import { CheckCircleIcon, ShoppingBagIcon, HomeIcon } from '@heroicons/react/24/outline';

interface OrderConfirmationProps {
  orderId: string;
}

export default function OrderConfirmation({ orderId }: OrderConfirmationProps) {
  return (
    <div className="text-center py-8">
      <div className="max-w-md mx-auto">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircleIcon className="w-10 h-10 text-green-600" />
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We've received your payment and will start processing your order shortly.
        </p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Order Details</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Order Number:</span>
              <span className="font-medium text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Order Date:</span>
              <span className="font-medium text-gray-900">
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-green-600">Confirmed</span>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-1 text-left">
            <li>• You'll receive an order confirmation email shortly</li>
            <li>• We'll prepare your order for shipping</li>
            <li>• You'll get a tracking number once it ships</li>
            <li>• Expected delivery: 3-5 business days</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-md transition-colors"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            View Order Details
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Need help with your order?</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
            <Link href="/contact" className="text-pink-600 hover:text-pink-700">
              Contact Support
            </Link>
            <span className="hidden sm:inline text-gray-300">•</span>
            <Link href="/faq" className="text-pink-600 hover:text-pink-700">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
