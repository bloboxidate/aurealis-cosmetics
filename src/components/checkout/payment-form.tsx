'use client';

import { useState, useEffect } from 'react';
import { PaymentMethod } from './checkout-content';
import sarieeApi from '@/lib/sariee-api';
import { CreditCardIcon, BanknotesIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

interface PaymentFormProps {
  selectedPaymentMethod: PaymentMethod | null;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    type: 'card',
    description: 'Pay securely with your card',
    icon: '💳',
  },
  {
    id: 'cash',
    name: 'Cash on Delivery',
    type: 'cash',
    description: 'Pay when your order arrives',
    icon: '💰',
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    type: 'bank_transfer',
    description: 'Direct bank transfer',
    icon: '🏦',
  },
];

export default function PaymentForm({
  selectedPaymentMethod,
  onPaymentMethodChange,
  onNext,
  onPrevious,
  canProceed,
}: PaymentFormProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultPaymentMethods);
  const [isLoading, setIsLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  // Load available payment methods from Sariee API
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const response = await sarieeApi.getAvailablePaymentMethods();
      if (response.status && response.data) {
        // Convert Sariee payment methods to our format
        const sarieeMethods: PaymentMethod[] = response.data.map((method: any) => ({
          id: method.id || method.name?.toLowerCase().replace(/\s+/g, '_'),
          name: method.name || method.title,
          type: method.type || 'card',
          description: method.description || method.name,
          icon: method.icon || '💳',
        }));
        setPaymentMethods(sarieeMethods);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      // Fall back to default methods
      setPaymentMethods(defaultPaymentMethods);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    onPaymentMethodChange(method);
  };

  const handleCardInputChange = (field: string, value: string) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
        
        {/* Payment Method Selection */}
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPaymentMethod?.id === method.id
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handlePaymentMethodSelect(method)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={selectedPaymentMethod?.id === method.id}
                    onChange={() => handlePaymentMethodSelect(method)}
                    className="text-pink-600 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Card Details Form */}
        {selectedPaymentMethod?.type === 'card' && (
          <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Card Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  required
                  value={cardDetails.number}
                  onChange={(e) => handleCardInputChange('number', formatCardNumber(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  required
                  value={cardDetails.expiry}
                  onChange={(e) => handleCardInputChange('expiry', formatExpiry(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <input
                  type="text"
                  required
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  required
                  value={cardDetails.name}
                  onChange={(e) => handleCardInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            {/* Security Notice */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-blue-700">
                    <strong>Secure Payment:</strong> Your payment information is encrypted and secure. 
                    We use industry-standard SSL encryption to protect your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cash on Delivery Notice */}
        {selectedPaymentMethod?.type === 'cash' && (
          <div className="mt-6 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                <BanknotesIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Cash on Delivery</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You will pay the delivery person when your order arrives. 
                  Please have the exact amount ready.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bank Transfer Notice */}
        {selectedPaymentMethod?.type === 'bank_transfer' && (
          <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0">
                <BuildingLibraryIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Bank Transfer</h3>
                <p className="text-sm text-blue-700 mt-1">
                  You will receive bank transfer details after placing your order. 
                  Please complete the transfer within 24 hours.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back to Shipping
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Order
        </button>
      </div>
    </div>
  );
}
