'use client';

import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/cart-context';

interface CartIconProps {
  className?: string;
  onClick?: () => void;
}

export default function CartIcon({ className = "w-6 h-6", onClick }: CartIconProps) {
  const { state, toggleCart } = useCart();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      toggleCart(true);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors"
    >
      <ShoppingCartIcon className={className} />
      {state.totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {state.totalItems}
        </span>
      )}
    </button>
  );
}
