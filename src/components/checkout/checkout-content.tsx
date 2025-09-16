'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import CheckoutSteps from './checkout-steps';
import ShippingForm from './shipping-form';
import PaymentForm from './payment-form';
import OrderReview from './order-review';
import OrderConfirmation from './order-confirmation';
import CheckoutSummary from './checkout-summary';
import EmptyCart from '@/components/cart/empty-cart';
import LoadingSpinner from '@/components/ui/loading-spinner';

export type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';

interface Address {
  id?: string;
  name: string;
  street: string;
  building: string;
  floor: string;
  flat: string;
  landmark?: string;
  phone: string;
  city_id: string;
  is_default: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'cash' | 'bank_transfer';
  description: string;
  icon: string;
}

export default function CheckoutContent() {
  const { state } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  if (state.isLoading) {
    return <LoadingSpinner className="py-12" />;
  }

  if (state.items.length === 0) {
    return <EmptyCart />;
  }

  const handleNextStep = () => {
    switch (currentStep) {
      case 'shipping':
        if (shippingAddress) {
          setCurrentStep('payment');
        }
        break;
      case 'payment':
        if (selectedPaymentMethod) {
          setCurrentStep('review');
        }
        break;
      case 'review':
        handlePlaceOrder();
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'payment':
        setCurrentStep('shipping');
        break;
      case 'review':
        setCurrentStep('payment');
        break;
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement order placement with Sariee API
      // This will include:
      // 1. Create order in Sariee
      // 2. Process payment with Stripe
      // 3. Update inventory
      // 4. Send confirmation email
      
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockOrderId = `ORD-${Date.now()}`;
      setOrderId(mockOrderId);
      setCurrentStep('confirmation');
    } catch (err) {
      setError('Failed to place order. Please try again.');
      console.error('Order placement error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'shipping':
        return !!shippingAddress;
      case 'payment':
        return !!selectedPaymentMethod;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Main Checkout Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Progress Steps */}
          <CheckoutSteps 
            currentStep={currentStep} 
            onStepClick={setCurrentStep}
          />

          {/* Error Message */}
          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step Content */}
          <div className="p-6">
            {currentStep === 'shipping' && (
              <ShippingForm
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                onShippingAddressChange={setShippingAddress}
                onBillingAddressChange={setBillingAddress}
                onNext={handleNextStep}
                onPrevious={handlePreviousStep}
                canProceed={canProceed()}
              />
            )}

            {currentStep === 'payment' && (
              <PaymentForm
                selectedPaymentMethod={selectedPaymentMethod}
                onPaymentMethodChange={setSelectedPaymentMethod}
                onNext={handleNextStep}
                onPrevious={handlePreviousStep}
                canProceed={canProceed()}
              />
            )}

            {currentStep === 'review' && (
              <OrderReview
                shippingAddress={shippingAddress}
                billingAddress={billingAddress}
                selectedPaymentMethod={selectedPaymentMethod}
                orderNotes={orderNotes}
                onOrderNotesChange={setOrderNotes}
                onNext={handleNextStep}
                onPrevious={handlePreviousStep}
                canProceed={canProceed()}
                isLoading={isLoading}
              />
            )}

            {currentStep === 'confirmation' && orderId && (
              <OrderConfirmation orderId={orderId} />
            )}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <CheckoutSummary 
          items={state.items}
          shippingAddress={shippingAddress}
          selectedPaymentMethod={selectedPaymentMethod}
        />
      </div>
    </div>
  );
}
