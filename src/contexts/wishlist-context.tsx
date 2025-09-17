'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/supabase';

// Types
interface WishlistState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
}

type WishlistAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WISHLIST'; payload: Product[] }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'CLEAR_WISHLIST' };

interface WishlistContextType extends WishlistState {
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loadWishlist: () => Promise<void>;
}

// Initial state
const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

// Reducer
function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_WISHLIST':
      return { ...state, items: action.payload, isLoading: false, error: null };
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        items: [...state.items, action.payload],
        error: null,
      };
    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        error: null,
      };
    case 'CLEAR_WISHLIST':
      return { ...state, items: [], error: null };
    default:
      return state;
  }
}

// Context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Provider
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  // Using the supabase client directly

  // Load wishlist on mount and when user changes
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Load from Supabase for authenticated users
        const { data: wishlistItems, error } = await supabase
          .from('wishlist_items')
          .select(`
            *,
            product:products(*)
          `)
          .eq('user_id', user.id);
        
        if (error) {
          dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to load wishlist' });
        } else {
          const products: Product[] = wishlistItems?.map(item => item.product).filter(Boolean) || [];
          dispatch({ type: 'SET_WISHLIST', payload: products });
        }
      } else {
        // Load from localStorage for guest users
        const savedWishlist = localStorage.getItem('aurealis-wishlist');
        if (savedWishlist) {
          try {
            const products = JSON.parse(savedWishlist);
            dispatch({ type: 'SET_WISHLIST', payload: products });
          } catch (error) {
            console.error('Error parsing saved wishlist:', error);
            dispatch({ type: 'SET_WISHLIST', payload: [] });
          }
        } else {
          dispatch({ type: 'SET_WISHLIST', payload: [] });
        }
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load wishlist' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToWishlist = async (product: Product) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Add to Supabase for authenticated users
        const { error } = await supabase
          .from('wishlist_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            created_at: new Date().toISOString(),
          });
        
        if (error) {
          throw new Error(error.message || 'Failed to add to wishlist');
        } else {
          dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
        }
      } else {
        // Add to localStorage for guest users
        const updatedItems = [...state.items, product];
        dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
        localStorage.setItem('aurealis-wishlist', JSON.stringify(updatedItems));
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add to wishlist' });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Remove from Supabase for authenticated users
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
        
        if (error) {
          throw new Error(error.message || 'Failed to remove from wishlist');
        } else {
          dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
        }
      } else {
        // Remove from localStorage for guest users
        const updatedItems = state.items.filter(item => item.id !== productId);
        dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
        localStorage.setItem('aurealis-wishlist', JSON.stringify(updatedItems));
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove from wishlist' });
    }
  };

  const clearWishlist = async () => {
    try {
      dispatch({ type: 'SET_ERROR', payload: null });

      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Clear from Supabase for authenticated users
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id);
        
        if (error) {
          throw new Error(error.message || 'Failed to clear wishlist');
        } else {
          dispatch({ type: 'CLEAR_WISHLIST' });
        }
      } else {
        // Clear from localStorage for guest users
        dispatch({ type: 'CLEAR_WISHLIST' });
        localStorage.removeItem('aurealis-wishlist');
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear wishlist' });
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return state.items.some(item => item.id === productId);
  };

  const value: WishlistContextType = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    loadWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

// Hook
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
