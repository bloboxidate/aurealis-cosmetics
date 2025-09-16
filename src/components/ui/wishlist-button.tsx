'use client';

import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useWishlist } from '@/contexts/wishlist-context';
import { Product } from '@/lib/supabase';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function WishlistButton({ 
  product, 
  size = 'md', 
  showText = false,
  className = '' 
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleToggleWishlist = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`
        relative flex items-center justify-center rounded-full transition-all duration-200
        ${inWishlist 
          ? 'bg-pink-100 text-pink-600 hover:bg-pink-200' 
          : 'bg-white text-gray-400 hover:text-pink-600 hover:bg-pink-50'
        }
        ${buttonSizeClasses[size]}
        ${className}
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-sm hover:shadow-md
      `}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isLoading ? (
        <div className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full animate-spin`} />
      ) : inWishlist ? (
        <HeartSolidIcon className={sizeClasses[size]} />
      ) : (
        <HeartIcon className={sizeClasses[size]} />
      )}
      
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {inWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
