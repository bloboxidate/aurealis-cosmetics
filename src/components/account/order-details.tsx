'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  CreditCardIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface OrderDetailsProps {
  orderId: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  product_image?: string;
  product_id?: string;
}

interface OrderDetails {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  shipping_address: {
    name: string;
    street: string;
    building: string;
    floor: string;
    flat: string;
    landmark?: string;
    phone: string;
    city: string;
  };
  billing_address?: {
    name: string;
    street: string;
    building: string;
    floor: string;
    flat: string;
    landmark?: string;
    phone: string;
    city: string;
  };
  payment_method: string;
  tracking_number?: string;
  notes?: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }

      // Load order details from Sariee API
        const { data: orderData, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(
              *,
              product:products(name, product_images(image_url))
            ),
            shipping_address:user_addresses(*)
          `)
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single();
      if (error) {
        throw new Error(error.message || 'Order not found');
      }

      if (orderData) {
        // Convert Supabase order format to our format
        const order: OrderDetails = {
          id: orderData.id,
          status: orderData.status,
          total: orderData.total_amount,
          subtotal: orderData.total_amount, // Assuming no separate subtotal field
          shipping: 0, // Assuming no separate shipping field
          tax: 0, // Assuming no separate tax field
          created_at: orderData.created_at,
          updated_at: orderData.updated_at,
          items: orderData.order_items?.map((item: any) => ({
            id: item.id,
            product_name: item.product?.name || 'Product',
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            product_image: item.product?.product_images?.[0]?.image_url,
            product_id: item.product_id,
          })) || [],
          shipping_address: {
            name: orderData.shipping_address?.name || '',
            street: orderData.shipping_address?.street || '',
            building: orderData.shipping_address?.building || '',
            floor: orderData.shipping_address?.floor || '',
            flat: orderData.shipping_address?.flat || '',
            landmark: orderData.shipping_address?.landmark || '',
            phone: orderData.shipping_address?.phone || '',
            city: orderData.shipping_address?.city_id || '',
          },
          billing_address: undefined, // Assuming no separate billing address
          payment_method: orderData.payment_method || 'Unknown',
          tracking_number: orderData.tracking_number,
          notes: orderData.notes,
        };
        
        setOrder(order);
      }
    } catch (error) {
      console.error('Error loading order details:', error);
      setError('Failed to load order details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'shipped':
      case 'in_transit':
        return <TruckIcon className="w-6 h-6 text-blue-500" />;
      case 'processing':
      case 'pending':
        return <ClockIcon className="w-6 h-6 text-yellow-500" />;
      case 'cancelled':
      case 'failed':
        return <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <ClockIcon className="w-6 h-6 text-gray-500" />;
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
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100';
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
            onClick={loadOrderDetails}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <p className="text-gray-500">Order not found</p>
          <Link
            href="/account/orders"
            className="mt-4 inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/account/orders"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Orders
        </Link>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getOrderStatusIcon(order.status)}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.id}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
              {order.status}
            </span>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>

        {/* Tracking Number */}
        {order.tracking_number && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <TruckIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Tracking Number:</span>
              <span className="text-sm text-blue-700 font-mono">{order.tracking_number}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 sm:p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
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
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Price: {formatPrice(item.price)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.total)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary & Details */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatPrice(order.tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2" />
              Shipping Address
            </h2>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">{order.shipping_address.name}</p>
              <p>{order.shipping_address.street}</p>
              <p>{order.shipping_address.building}, Floor {order.shipping_address.floor}, Flat {order.shipping_address.flat}</p>
              {order.shipping_address.landmark && (
                <p>Near {order.shipping_address.landmark}</p>
              )}
              <p>{order.shipping_address.city}</p>
              <p className="mt-2">{order.shipping_address.phone}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CreditCardIcon className="w-5 h-5 mr-2" />
              Payment Information
            </h2>
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">Payment Method</p>
              <p className="capitalize">{order.payment_method}</p>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Notes</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
