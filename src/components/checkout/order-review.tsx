'use client';

import { Address, PaymentMethod } from './checkout-content';
import { useCart } from '@/contexts/cart-context';
import { formatPrice } from '@/lib/utils';
import { MapPinIcon, CreditCardIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface OrderReviewProps {
  shippingAddress: Address | null;
  billingAddress: Address | null;
  selectedPaymentMethod: PaymentMethod | null;
  orderNotes: string;
  onOrderNotesChange: (notes: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
  isLoading: boolean;
}

export default function OrderReview({
  shippingAddress,
  billingAddress,
  selectedPaymentMethod,
  orderNotes,
  onOrderNotesChange,
  onNext,
  onPrevious,
  canProceed,
  isLoading,
}: OrderReviewProps) {
  const { state } = useCart();

  const calculateTotals = () => {
    const subtotal = state.totalPrice;
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = subtotal * 0.14; // 14% tax
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Review Your Order</h2>
        
        {/* Shipping Address */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2" />
            Shipping Address
          </h3>
          {shippingAddress ? (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{shippingAddress.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {shippingAddress.street}, {shippingAddress.building}
                  </p>
                  <p className="text-sm text-gray-600">
                    Floor {shippingAddress.floor}, Flat {shippingAddress.flat}
                  </p>
                  {shippingAddress.landmark && (
                    <p className="text-sm text-gray-600">Near {shippingAddress.landmark}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">{shippingAddress.phone}</p>
                </div>
                <button
                  type="button"
                  onClick={onPrevious}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No shipping address selected</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <CreditCardIcon className="w-4 h-4 mr-2" />
            Payment Method
          </h3>
          {selectedPaymentMethod ? (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedPaymentMethod.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{selectedPaymentMethod.name}</h4>
                    <p className="text-sm text-gray-500">{selectedPaymentMethod.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onPrevious}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No payment method selected</p>
          )}
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Order Items</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {state.items.map((item) => {
              const primaryImage = item.product.product_images?.find(img => img.is_primary) || 
                                  item.product.product_images?.[0];
              
              return (
                <div key={item.id} className="p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                      {primaryImage ? (
                        <img
                          src={primaryImage.image_url}
                          alt={primaryImage.alt_text || item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      {item.variant && (
                        <p className="text-sm text-gray-500">{item.variant.name}</p>
                      )}
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Notes */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <DocumentTextIcon className="w-4 h-4 mr-2" />
            Order Notes (Optional)
          </h3>
          <textarea
            value={orderNotes}
            onChange={(e) => onOrderNotesChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            placeholder="Any special instructions for your order..."
          />
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({state.totalItems} items)</span>
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
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            required
            className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="/terms" className="text-pink-600 hover:text-pink-700 underline">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-pink-600 hover:text-pink-700 underline">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Back to Payment
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <span>Place Order</span>
          )}
        </button>
      </div>
    </div>
  );
}
