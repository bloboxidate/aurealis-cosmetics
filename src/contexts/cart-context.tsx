'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import sarieeApi from '@/lib/sariee-api';
import { Product, ProductVariant } from '@/lib/supabase';

interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  product: Product;
  variant?: ProductVariant;
  added_at: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART'; payload: boolean }
  | { type: 'SYNC_WITH_SARIEE'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        item => item.product_id === action.payload.product_id && 
        item.variant_id === action.payload.variant_id
      );
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };
      } else {
        const newItems = [...state.items, action.payload];
        return {
          ...state,
          items: newItems,
          totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };
      }
    
    case 'UPDATE_ITEM':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: action.payload };
    
    case 'SYNC_WITH_SARIEE':
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: (isOpen: boolean) => void;
  syncWithSariee: () => Promise<void>;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('aurealis_cart', JSON.stringify(state.items));
    } else {
      localStorage.removeItem('aurealis_cart');
    }
  }, [state.items]);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Try to load from localStorage first
      const localCart = localStorage.getItem('aurealis_cart');
      if (localCart) {
        const items = JSON.parse(localCart);
        dispatch({ type: 'SET_ITEMS', payload: items });
      }
      
      // If user is authenticated, try to sync with Sariee
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await syncWithSariee();
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // User is authenticated - use Sariee API
        const response = await sarieeApi.addToCart({
          product_id: product.sariee_product_id,
          quantity,
          product_barcode_id: variant?.sariee_barcode_id,
        });

        if (response.status) {
          // Refresh cart from Sariee
          await syncWithSariee();
        } else {
          throw new Error(response.message || 'Failed to add item to cart');
        }
      } else {
        // User not authenticated - use local storage
        const cartItem: CartItem = {
          id: `${product.id}-${variant?.id || 'default'}`,
          product_id: product.id,
          variant_id: variant?.id,
          quantity,
          price: variant?.price || product.price,
          product,
          variant,
          added_at: new Date().toISOString(),
        };

        dispatch({ type: 'ADD_ITEM', payload: cartItem });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // User is authenticated - use Sariee API
        const item = state.items.find(item => item.id === itemId);
        if (item) {
          const response = await sarieeApi.addToCart({
            product_id: item.product.sariee_product_id,
            quantity,
            product_barcode_id: item.variant?.sariee_barcode_id,
          });

          if (response.status) {
            await syncWithSariee();
          } else {
            throw new Error(response.message || 'Failed to update cart item');
          }
        }
      } else {
        // User not authenticated - use local storage
        dispatch({ type: 'UPDATE_ITEM', payload: { id: itemId, quantity } });
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update cart item' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // User is authenticated - use Sariee API
        const item = state.items.find(item => item.id === itemId);
        if (item) {
          // Set quantity to 0 to remove from Sariee cart
          const response = await sarieeApi.addToCart({
            product_id: item.product.sariee_product_id,
            quantity: 0,
            product_barcode_id: item.variant?.sariee_barcode_id,
          });

          if (response.status) {
            await syncWithSariee();
          } else {
            throw new Error(response.message || 'Failed to remove cart item');
          }
        }
      } else {
        // User not authenticated - use local storage
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove cart item' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // User is authenticated - clear Sariee cart
        // We'll need to implement a clear cart API call or remove items individually
        // For now, we'll clear locally and sync
        dispatch({ type: 'CLEAR_CART' });
        await syncWithSariee();
      } else {
        // User not authenticated - clear local storage
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const syncWithSariee = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const response = await sarieeApi.getCart();
      if (response.status && response.data) {
        // Convert Sariee cart items to our format
        const cartItems: CartItem[] = response.data.items?.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price,
          product: item.product,
          variant: item.variant,
          added_at: item.created_at,
        })) || [];

        dispatch({ type: 'SYNC_WITH_SARIEE', payload: cartItems });
      }
    } catch (error) {
      console.error('Error syncing with Sariee:', error);
      // Don't show error to user, just log it
    }
  };

  const toggleCart = (isOpen: boolean) => {
    dispatch({ type: 'TOGGLE_CART', payload: isOpen });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleCart,
        syncWithSariee,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
