'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  MapPinIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CheckIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface Address {
  id: string;
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

export default function AddressManagement() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      // Load addresses from Supabase
      const { data: addressesData, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message || 'Failed to load addresses');
      }

      if (addressesData) {
        setAddresses(addressesData);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setError('Failed to load addresses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
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
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const addressData = {
        is_default: formData.is_default ? 1 : 0,
        name: formData.name,
        street: formData.street,
        building: formData.building,
        floor: formData.floor,
        flat: formData.flat,
        landmark: formData.landmark || '',
        phone: formData.phone,
        city_id: formData.city_id,
      };

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      if (editingAddress) {
        // Update existing address
        const { error } = await supabase
          .from('user_addresses')
          .update({
            name: formData.name,
            street: formData.street,
            building: formData.building,
            floor: formData.floor,
            flat: formData.flat,
            landmark: formData.landmark || '',
            phone: formData.phone,
            city_id: formData.city_id,
            is_default: formData.is_default,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingAddress.id)
          .eq('user_id', user.id);

        if (error) {
          throw new Error(error.message || 'Failed to update address');
        }

        setSuccess('Address updated successfully!');
        await loadAddresses();
        resetForm();
      } else {
        // Add new address
        const { error } = await supabase
          .from('user_addresses')
          .insert({
            user_id: user.id,
            name: formData.name,
            street: formData.street,
            building: formData.building,
            floor: formData.floor,
            flat: formData.flat,
            landmark: formData.landmark || '',
            phone: formData.phone,
            city_id: formData.city_id,
            is_default: formData.is_default,
            created_at: new Date().toISOString(),
          });

        if (error) {
          throw new Error(error.message || 'Failed to add address');
        }

        setSuccess('Address added successfully!');
        await loadAddresses();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving address:', error);
      setError('Failed to save address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      name: address.name,
      street: address.street,
      building: address.building,
      floor: address.floor,
      flat: address.flat,
      landmark: address.landmark || '',
      phone: address.phone,
      city_id: address.city_id,
      is_default: address.is_default,
    });
    setEditingAddress(address.id);
    setShowAddForm(true);
  };

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      // Note: Sariee API might not have a delete endpoint
      // In that case, we would need to implement a different approach
      // For now, we'll show an error message
      setError('Address deletion is not available. Please contact support.');
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Failed to delete address. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner className="py-12" />;
  }

  if (error && addresses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadAddresses}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Address Management</h2>
          <p className="text-gray-600 mt-1">
            Manage your shipping and billing addresses
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Address
        </button>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Add/Edit Address Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Address Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Address Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Home, Office, etc."
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="+201234567890"
                />
              </div>

              {/* Street */}
              <div className="sm:col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="123 Main Street"
                />
              </div>

              {/* Building */}
              <div>
                <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                  Building *
                </label>
                <input
                  type="text"
                  id="building"
                  name="building"
                  required
                  value={formData.building}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Building A"
                />
              </div>

              {/* Floor */}
              <div>
                <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                  Floor *
                </label>
                <input
                  type="text"
                  id="floor"
                  name="floor"
                  required
                  value={formData.floor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="5"
                />
              </div>

              {/* Flat */}
              <div>
                <label htmlFor="flat" className="block text-sm font-medium text-gray-700 mb-1">
                  Flat/Apartment *
                </label>
                <input
                  type="text"
                  id="flat"
                  name="flat"
                  required
                  value={formData.flat}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="12"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city_id" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <select
                  id="city_id"
                  name="city_id"
                  required
                  value={formData.city_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Select City</option>
                  <option value="cairo">Cairo</option>
                  <option value="giza">Giza</option>
                  <option value="alexandria">Alexandria</option>
                  <option value="sharm_el_sheikh">Sharm El Sheikh</option>
                </select>
              </div>

              {/* Landmark */}
              <div className="sm:col-span-2">
                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Near City Mall"
                />
              </div>
            </div>

            {/* Default Address */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_default"
                name="is_default"
                checked={formData.is_default}
                onChange={handleInputChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                Set as default address
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-4 h-4" />
                    <span>{editingAddress ? 'Update Address' : 'Add Address'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Saved Addresses</h3>
        </div>

        {addresses.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {addresses.map((address) => (
              <div key={address.id} className="p-4 sm:p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <MapPinIcon className="w-6 h-6 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{address.name}</h4>
                        {address.is_default && (
                          <span className="px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{address.street}, {address.building}</p>
                        <p>Floor {address.floor}, Flat {address.flat}</p>
                        {address.landmark && (
                          <p>Near {address.landmark}</p>
                        )}
                        <p>{address.city_id}</p>
                        <p>{address.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="p-2 text-gray-400 hover:text-pink-600 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-gray-500 mb-6">
              Add your first address to make checkout faster
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
