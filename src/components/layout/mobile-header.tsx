'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, ShoppingCartIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import MobileSearch from '@/components/ui/mobile-search';

export default function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-bold text-pink-600">Aurealis</span>
          </Link>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <MobileSearch className="hidden sm:block" />
            
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors">
              <ShoppingCartIcon className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User */}
            <Link href="/login" className="p-2 text-gray-600 hover:text-pink-600 transition-colors">
              <UserIcon className="w-6 h-6" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search (visible on small screens) */}
        <div className="sm:hidden pb-4">
          <MobileSearch />
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <nav className="px-4 py-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-pink-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
