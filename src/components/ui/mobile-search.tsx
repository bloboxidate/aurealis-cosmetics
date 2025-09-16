'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MobileSearchProps {
  placeholder?: string;
  className?: string;
}

export default function MobileSearch({ 
  placeholder = "Search products...", 
  className = "" 
}: MobileSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const params = new URLSearchParams(searchParams);
      params.set('search', searchTerm.trim());
      params.delete('page'); // Reset to first page
      router.push(`/products?${params.toString()}`);
    }
    setIsOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Mobile Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-gray-500">
          <MagnifyingGlassIcon className="w-5 h-5" />
          <span className="text-sm">
            {searchParams.get('search') || placeholder}
          </span>
        </div>
        {searchParams.get('search') && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearSearch();
            }}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <XMarkIcon className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </button>

      {/* Mobile Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md mt-16">
            <form onSubmit={handleSearch} className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 text-lg border-none outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
