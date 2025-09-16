'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import sarieeApi from '@/lib/sariee-api';
import { formatPrice } from '@/lib/utils';
import { 
  ShoppingBagIcon, 
  MapPinIcon, 
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon 
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  full_name: string;
}

interface OrderSummary {
  id: string;
  status: string;
  total: number;
  created_at: string;
  items_count: number;
}

interface AddressSummary {
  id: string;
  name: string;
  is_default: boolean;
}

export default function AccountDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([]);
  const [addresses, setAddresses] = useState<AddressSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        window.location.href = '/login';
        return;
      }

      // Load user profile from Sariee
      const profileResponse = await sarieeApi.getUserProfile();
      if (profileResponse.status && profileResponse.data) {
        setUser(profileResponse.data.user);
      }

      // Load recent orders
      const ordersResponse = await sarieeApi.getUserOrders();
      if (ordersResponse.status && ordersResponse.data) {
        const recentOrdersData = ordersResponse.data.slice(0, 5).map((order: any) => ({
          id: order.id,
          status: order.status,
          total: order.total || order.amount,
          created_at: order.created_at,
          items_count: order.items?.length || 0,
        }));
        setRecentOrders(recentOrdersData);
      }

      // Load addresses
      const addressesResponse = await sarieeApi.getAddresses();
      if (addressesResponse.status && addressesResponse.data) {
        const addressesData = addressesResponse.data.map((addr: any) => ({
          id: addr.id,
          name: addr.name,
          is_default: addr.is_default === 1,
        }));
        setAddresses(addressesData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'shipped':
      case 'in_transit':
        return <TruckIcon className="w-5 h-5 text-blue-500" />;
      case 'processing':
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipped':
      case 'in_transit':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return <LoadingSpinner className="py-12" />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
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
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.first_name || 'Customer'}!
            </h2>
            <p className="text-gray-600">
              {user?.email || 'Manage your account and track your orders'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBagIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-lg font-semibold text-gray-900">{recentOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPinIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Saved Addresses</p>
              <p className="text-lg font-semibold text-gray-900">{addresses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Account Status</p>
              <p className="text-lg font-semibold text-gray-900">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Link
              href="/account/orders"
              className="text-sm text-pink-600 hover:text-pink-700 font-medium"
            >
              View All
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div key={order.id} className="px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getOrderStatusIcon(order.status)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 sm:px-6 py-8 text-center">
              <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/account/orders"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingBagIcon className="w-6 h-6 text-pink-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">View Orders</p>
              <p className="text-sm text-gray-500">Track your purchases</p>
            </div>
          </Link>

          <Link
            href="/account/addresses"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MapPinIcon className="w-6 h-6 text-pink-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Manage Addresses</p>
              <p className="text-sm text-gray-500">Update shipping info</p>
            </div>
          </Link>

          <Link
            href="/account/profile"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserIcon className="w-6 h-6 text-pink-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Edit Profile</p>
              <p className="text-sm text-gray-500">Update your information</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
