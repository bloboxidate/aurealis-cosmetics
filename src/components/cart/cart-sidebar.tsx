'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import { formatPrice } from '@/lib/utils';
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function CartSidebar() {
  const { state, toggleCart, removeFromCart, updateQuantity } = useCart();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <Transition.Root show={state.isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => toggleCart(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Shopping Cart ({state.totalItems})
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => toggleCart(false)}
                          >
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="mt-8">
                        {state.items.length === 0 ? (
                          <div className="text-center py-8">
                            <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Your cart is empty</p>
                          </div>
                        ) : (
                          <div className="flow-root">
                            <ul className="-my-6 divide-y divide-gray-200">
                              {state.items.map((item) => {
                                const primaryImage = item.product.product_images?.find(img => img.is_primary) || 
                                                    item.product.product_images?.[0];
                                
                                return (
                                  <li key={item.id} className="flex py-6">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      {primaryImage ? (
                                        <Image
                                          src={primaryImage.image_url}
                                          alt={primaryImage.alt_text || item.product.name}
                                          width={64}
                                          height={64}
                                          className="h-full w-full object-cover object-center"
                                        />
                                      ) : (
                                        <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>

                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>
                                            <Link 
                                              href={`/products/${item.product.sariee_product_id}`}
                                              className="hover:text-pink-600 transition-colors"
                                            >
                                              {item.product.name}
                                            </Link>
                                          </h3>
                                          <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
                                        </div>
                                        
                                        {item.variant && (
                                          <p className="mt-1 text-sm text-gray-500">{item.variant.name}</p>
                                        )}
                                        
                                        <p className="mt-1 text-sm text-gray-500">{formatPrice(item.price)} each</p>
                                      </div>
                                      
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <div className="flex items-center border border-gray-300 rounded">
                                          <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            disabled={state.isLoading}
                                            className="p-1 hover:bg-gray-50 disabled:opacity-50"
                                          >
                                            <span className="sr-only">Decrease quantity</span>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                            </svg>
                                          </button>
                                          
                                          <span className="px-2 py-1 text-sm font-medium min-w-[2rem] text-center">
                                            {item.quantity}
                                          </span>
                                          
                                          <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            disabled={state.isLoading}
                                            className="p-1 hover:bg-gray-50 disabled:opacity-50"
                                          >
                                            <span className="sr-only">Increase quantity</span>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                          </button>
                                        </div>

                                        <div className="flex">
                                          <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id)}
                                            disabled={state.isLoading}
                                            className="font-medium text-pink-600 hover:text-pink-500 disabled:opacity-50"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    {state.items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                          <p>Subtotal</p>
                          <p>{formatPrice(state.totalPrice)}</p>
                        </div>
                        
                        <p className="mt-0.5 text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>
                        
                        <div className="mt-6 space-y-3">
                          <Link
                            href="/cart"
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-pink-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-pink-700"
                            onClick={() => toggleCart(false)}
                          >
                            View Cart
                          </Link>
                          
                          <Link
                            href="/checkout"
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-pink-600 shadow-sm ring-1 ring-inset ring-pink-600 hover:bg-pink-50"
                            onClick={() => toggleCart(false)}
                          >
                            Checkout
                          </Link>
                        </div>
                        
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or{' '}
                            <button
                              type="button"
                              className="font-medium text-pink-600 hover:text-pink-500"
                              onClick={() => toggleCart(false)}
                            >
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
