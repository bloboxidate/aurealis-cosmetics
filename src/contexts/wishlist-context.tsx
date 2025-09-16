'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import sarieeApi from '@/lib/sariee-api';
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
        // Load from Sariee API for authenticated users
        const response = await sarieeApi.getWishlist();
        
        if (response.status && response.data) {
          // Convert Sariee products to our format
          const products: Product[] = response.data.map((sarieeProduct: any) => ({
            id: sarieeProduct.id,
            sariee_product_id: sarieeProduct.id,
            name: sarieeProduct.name || 'Product',
            description: sarieeProduct.description || '',
            price: sarieeProduct.price || 0,
            compare_price: sarieeProduct.compare_price,
            sku: sarieeProduct.sku || '',
            inventory_quantity: sarieeProduct.inventory_quantity || 0,
            is_featured: sarieeProduct.is_featured || false,
            is_active: sarieeProduct.is_active !== false,
            created_at: sarieeProduct.created_at || new Date().toISOString(),
            updated_at: sarieeProduct.updated_at || new Date().toISOString(),
            // Map Sariee product images
            product_images: sarieeProduct.images?.map((img: any, index: number) => ({
              id: img.id || `img_${index}`,
              product_id: sarieeProduct.id,
              image_url: img.src || img.url,
              alt_text: img.alt || sarieeProduct.name,
              is_primary: index === 0,
              sort_order: index,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })) || [],
            // Map Sariee categories
            product_categories: sarieeProduct.categories?.map((cat: any) => ({
              id: `pc_${cat.id}`,
              product_id: sarieeProduct.id,
              category_id: cat.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              categories: {
                id: cat.id,
                name: cat.name,
                slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
                description: cat.description || '',
                image_url: cat.image?.src || null,
                is_featured: cat.is_featured || false,
                is_active: cat.is_active !== false,
                sort_order: cat.sort_order || 0,
                created_at: cat.created_at || new Date().toISOString(),
                updated_at: cat.updated_at || new Date().toISOString(),
              },
            })) || [],
            // Map Sariee variants
            product_variants: sarieeProduct.variants?.map((variant: any) => ({
              id: variant.id,
              product_id: sarieeProduct.id,
              name: variant.name || 'Default',
              sku: variant.sku || '',
              price: variant.price || sarieeProduct.price,
              inventory_quantity: variant.inventory_quantity || 0,
              is_active: variant.is_active !== false,
              created_at: variant.created_at || new Date().toISOString(),
              updated_at: variant.updated_at || new Date().toISOString(),
            })) || [],
          }));
          
          dispatch({ type: 'SET_WISHLIST', payload: products });
        } else {
          throw new Error(response.message || 'Failed to load wishlist');
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
        // Add to Sariee API for authenticated users
        const response = await sarieeApi.addToWishlist(product.id);
        
        if (response.status) {
          dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
        } else {
          throw new Error(response.message || 'Failed to add to wishlist');
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
        // Remove from Sariee API for authenticated users
        const response = await sarieeApi.removeFromWishlist(productId);
        
        if (response.status) {
          dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
        } else {
          throw new Error(response.message || 'Failed to remove from wishlist');
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
        // Clear from Sariee API for authenticated users
        const response = await sarieeApi.clearWishlist();
        
        if (response.status) {
          dispatch({ type: 'CLEAR_WISHLIST' });
        } else {
          throw new Error(response.message || 'Failed to clear wishlist');
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
