import { createClient } from '@supabase/supabase-js'

// Supabase configuration - use environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Log configuration status (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Supabase Configuration:')
  console.log('  URL:', supabaseUrl)
  console.log('  Key exists:', !!supabaseAnonKey)
  console.log('  Key length:', supabaseAnonKey?.length || 0)
}

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Create Supabase client for client-side operations (SSR compatible)
export const createClientComponentClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  })
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          phone_code: string | null;
          birth_date: string | null;
          is_verified: boolean;
          company_id: string | null;
          sariee_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          phone_code?: string | null;
          birth_date?: string | null;
          is_verified?: boolean;
          company_id?: string | null;
          sariee_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          phone_code?: string | null;
          birth_date?: string | null;
          is_verified?: boolean;
          company_id?: string | null;
          sariee_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          middle_name: string | null;
          email: string;
          phone: string | null;
          phone_code: string | null;
          birth_date: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name?: string | null;
          last_name?: string | null;
          middle_name?: string | null;
          email: string;
          phone?: string | null;
          phone_code?: string | null;
          birth_date?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          middle_name?: string | null;
          email?: string;
          phone?: string | null;
          phone_code?: string | null;
          birth_date?: string | null;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          sariee_product_id: string;
          name: string;
          description: string | null;
          short_description: string | null;
          price: number;
          compare_price: number | null;
          cost_price: number | null;
          sku: string | null;
          barcode: string | null;
          inventory_quantity: number;
          min_inventory_level: number;
          max_inventory_level: number | null;
          weight: number | null;
          dimensions: any | null;
          is_active: boolean;
          is_featured: boolean;
          is_digital: boolean;
          requires_shipping: boolean;
          tax_rate: number;
          seo_title: string | null;
          seo_description: string | null;
          meta_keywords: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sariee_product_id: string;
          name: string;
          description?: string | null;
          short_description?: string | null;
          price: number;
          compare_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          barcode?: string | null;
          inventory_quantity?: number;
          min_inventory_level?: number;
          max_inventory_level?: number | null;
          weight?: number | null;
          dimensions?: any | null;
          is_active?: boolean;
          is_featured?: boolean;
          is_digital?: boolean;
          requires_shipping?: boolean;
          tax_rate?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          meta_keywords?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sariee_product_id?: string;
          name?: string;
          description?: string | null;
          short_description?: string | null;
          price?: number;
          compare_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          barcode?: string | null;
          inventory_quantity?: number;
          min_inventory_level?: number;
          max_inventory_level?: number | null;
          weight?: number | null;
          dimensions?: any | null;
          is_active?: boolean;
          is_featured?: boolean;
          is_digital?: boolean;
          requires_shipping?: boolean;
          tax_rate?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          meta_keywords?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          sariee_category_id: string;
          name: string;
          description: string | null;
          parent_id: string | null;
          image_url: string | null;
          is_featured: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sariee_category_id: string;
          name: string;
          description?: string | null;
          parent_id?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sariee_category_id?: string;
          name?: string;
          description?: string | null;
          parent_id?: string | null;
          image_url?: string | null;
          is_featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity: number;
          price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
          price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          sariee_order_id: string | null;
          status: string;
          payment_status: string;
          payment_method: string | null;
          subtotal: number;
          tax_amount: number;
          shipping_amount: number;
          discount_amount: number;
          total_amount: number;
          currency: string;
          shipping_address: any;
          billing_address: any | null;
          notes: string | null;
          tracking_number: string | null;
          shipped_at: string | null;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id: string;
          sariee_order_id?: string | null;
          status?: string;
          payment_status?: string;
          payment_method?: string | null;
          subtotal: number;
          tax_amount?: number;
          shipping_amount?: number;
          discount_amount?: number;
          total_amount: number;
          currency?: string;
          shipping_address: any;
          billing_address?: any | null;
          notes?: string | null;
          tracking_number?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          sariee_order_id?: string | null;
          status?: string;
          payment_status?: string;
          payment_method?: string | null;
          subtotal?: number;
          tax_amount?: number;
          shipping_amount?: number;
          discount_amount?: number;
          total_amount?: number;
          currency?: string;
          shipping_address?: any;
          billing_address?: any | null;
          notes?: string | null;
          tracking_number?: string | null;
          shipped_at?: string | null;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity: number;
          price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
          price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
      user_addresses: {
        Row: {
          id: string;
          user_id: string;
          sariee_address_id: string | null;
          name: string;
          street: string;
          building: string | null;
          floor: string | null;
          flat: string | null;
          landmark: string | null;
          city: string;
          state: string | null;
          country: string;
          postal_code: string | null;
          phone: string | null;
          latitude: number | null;
          longitude: number | null;
          is_default: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sariee_address_id?: string | null;
          name: string;
          street: string;
          building?: string | null;
          floor?: string | null;
          flat?: string | null;
          landmark?: string | null;
          city: string;
          state?: string | null;
          country?: string;
          postal_code?: string | null;
          phone?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_default?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sariee_address_id?: string | null;
          name?: string;
          street?: string;
          building?: string | null;
          floor?: string | null;
          flat?: string | null;
          landmark?: string | null;
          city?: string;
          state?: string | null;
          country?: string;
          postal_code?: string | null;
          phone?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          is_default?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Export types for use in components
export type User = Database['public']['Tables']['users']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type CartItem = Database['public']['Tables']['cart_items']['Row']
export type WishlistItem = Database['public']['Tables']['wishlist_items']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type UserAddress = Database['public']['Tables']['user_addresses']['Row']