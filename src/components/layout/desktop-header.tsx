'use client';

import Link from 'next/link';
import { ShoppingCartIcon, UserIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import GlobalSearch from '@/components/search/global-search';

export default function DesktopHeader() {
  const { state, toggleCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="hidden lg:block bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-pink-600">Aurealis Cosmetics</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-pink-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <GlobalSearch className="w-full max-w-md" />

            {/* Wishlist */}
            <Link 
              href="/wishlist"
              className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <HeartIcon className="w-6 h-6" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button 
              onClick={() => toggleCart(true)}
              className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {state.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.totalItems}
                </span>
              )}
            </button>

            {/* User */}
            <Link href="/login" className="p-2 text-gray-600 hover:text-pink-600 transition-colors">
              <UserIcon className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
