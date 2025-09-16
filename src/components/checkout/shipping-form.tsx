'use client';

import { useState, useEffect } from 'react';
import { Address } from './checkout-content';
import { useCart } from '@/contexts/cart-context';
import { supabase } from '@/lib/supabase';
import sarieeApi from '@/lib/sariee-api';
import { formatPrice } from '@/lib/utils';
import { MapPinIcon, UserIcon, PhoneIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface ShippingFormProps {
  shippingAddress: Address | null;
  billingAddress: Address | null;
  onShippingAddressChange: (address: Address) => void;
  onBillingAddressChange: (address: Address) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

export default function ShippingForm({
  shippingAddress,
  billingAddress,
  onShippingAddressChange,
  onBillingAddressChange,
  onNext,
  onPrevious,
  canProceed,
}: ShippingFormProps) {
  const { state } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: '',
    street: '',
    building: '',
    floor: '',
    flat: '',
    landmark: '',
    phone: '',
    city_id: '',
    is_default: false,
  });

  // Load user addresses
  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Load addresses from Sariee API
        const response = await sarieeApi.getAddresses();
        if (response.status && response.data) {
          // Convert Sariee address format to our format
          const sarieeAddresses: Address[] = response.data.map((addr: any) => ({
            id: addr.id,
            name: addr.name,
            street: addr.street,
            building: addr.building,
            floor: addr.floor,
            flat: addr.flat,
            landmark: addr.landmark,
            phone: addr.phone,
            city_id: addr.city_id,
            is_default: addr.is_default === 1,
          }));
          
          setAddresses(sarieeAddresses);
          
          // Set default address
          const defaultAddr = sarieeAddresses.find(addr => addr.is_default);
          if (defaultAddr && !shippingAddress) {
            onShippingAddressChange(defaultAddr);
          }
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (address: Address) => {
    onShippingAddressChange(address);
    if (useSameAddress) {
      onBillingAddressChange(address);
    }
  };

  const handleNewAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      // Save address to Sariee API
      const addressData = {
        is_default: newAddress.is_default ? 1 : 0,
        name: newAddress.name!,
        street: newAddress.street!,
        building: newAddress.building!,
        floor: newAddress.floor!,
        flat: newAddress.flat!,
        landmark: newAddress.landmark || '',
        phone: newAddress.phone!,
        city_id: newAddress.city_id!,
      };
      
      const response = await sarieeApi.addAddress(addressData);
      if (response.status && response.data) {
        const savedAddress: Address = {
          id: response.data.id,
          name: response.data.name,
          street: response.data.street,
          building: response.data.building,
          floor: response.data.floor,
          flat: response.data.flat,
          landmark: response.data.landmark,
          phone: response.data.phone,
          city_id: response.data.city_id,
          is_default: response.data.is_default === 1,
        };
        
        setAddresses((prev: Address[]) => [...prev, savedAddress]);
        onShippingAddressChange(savedAddress);
        
        if (useSameAddress) {
          onBillingAddressChange(savedAddress);
        }
        
        setShowNewAddressForm(false);
        setNewAddress({
          name: '',
          street: '',
          building: '',
          floor: '',
          flat: '',
          landmark: '',
          phone: '',
          city_id: '',
          is_default: false,
        });
      } else {
        throw new Error(response.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateShipping = () => {
    // Free shipping over 500 EGP
    return state.totalPrice > 500 ? 0 : 50;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
        
        {/* Existing Addresses */}
        {addresses.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-gray-700">Select Address</h3>
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  shippingAddress?.id === address.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAddressSelect(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{address.name}</h4>
                        {address.is_default && (
                          <span className="px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {address.street}, {address.building}, Floor {address.floor}, Flat {address.flat}
                      </p>
                      {address.landmark && (
                        <p className="text-xs text-gray-500 mt-1">Near {address.landmark}</p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="shipping-address"
                      checked={shippingAddress?.id === address.id}
                      onChange={() => handleAddressSelect(address)}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Address Button */}
        <button
          type="button"
          onClick={() => setShowNewAddressForm(!showNewAddressForm)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-pink-500 hover:text-pink-600 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <MapPinIcon className="w-5 h-5" />
            <span>Add New Address</span>
          </div>
        </button>

        {/* New Address Form */}
        {showNewAddressForm && (
          <form onSubmit={handleNewAddressSubmit} className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-4">New Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.name || ''}
                  onChange={(e) => setNewAddress((prev: Partial<Address>) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Home, Office, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newAddress.phone || ''}
                  onChange={(e) => setNewAddress((prev: Partial<Address>) => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="+201234567890"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.street || ''}
                  onChange={(e) => setNewAddress((prev: Partial<Address>) => ({ ...prev, street: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="123 Main Street"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Building *
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.building || ''}
                  onChange={(e) => setNewAddress((prev: Partial<Address>) => ({ ...prev, building: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Building A"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor *
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.floor || ''}
                  onChange={(e) => setNewAddress((prev: Partial<Address>) => ({ ...prev, floor: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Flat/Apartment *
                </label>
                <input
                  type="text"
                  required
                  value={newAddress.flat || ''}
                  onChange={(e) => setNewAddress((prev: Partial<Address>) => ({ ...prev, flat: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={newAddress.landmark || ''}
                  onChange={(e) => setNewAddress((prev: Partial<Address>) => ({ ...prev, landmark: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Near City Mall"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <select
                  required
                  value={newAddress.city_id || ''}
                  onChange={(e) => setNewAddress((prev: Partial<Address>) => ({ ...prev, city_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Select City</option>
                  <option value="cairo">Cairo</option>
                  <option value="giza">Giza</option>
                  <option value="alexandria">Alexandria</option>
                  <option value="sharm_el_sheikh">Sharm El Sheikh</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="default-address"
                checked={newAddress.is_default || false}
                onChange={(e) => setNewAddress((prev: Partial<Address>) => ({ ...prev, is_default: e.target.checked }))}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="default-address" className="ml-2 text-sm text-gray-700">
                Set as default address
              </label>
            </div>
            
            <div className="mt-4 flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewAddressForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Billing Address */}
        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="same-billing"
              checked={useSameAddress}
              onChange={(e) => {
                setUseSameAddress(e.target.checked);
                if (e.target.checked && shippingAddress) {
                  onBillingAddressChange(shippingAddress);
                }
              }}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="same-billing" className="ml-2 text-sm text-gray-700">
              Use same address for billing
            </label>
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Shipping Options</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                name="shipping-option"
                defaultChecked
                className="text-pink-600 focus:ring-pink-500"
              />
              <div>
                <p className="font-medium text-gray-900">Standard Delivery</p>
                <p className="text-sm text-gray-500">3-5 business days</p>
              </div>
            </div>
            <span className="font-medium text-gray-900">
              {calculateShipping() === 0 ? 'Free' : formatPrice(calculateShipping())}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
