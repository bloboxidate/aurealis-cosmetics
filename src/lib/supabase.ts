import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const createClientComponentClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

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
          id: string
          name: string
          description: string | null
          parent_id: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          address: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          } | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          address?: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          } | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          address?: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          } | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          shipping_address: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          }
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: string
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount: number
          shipping_address: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          }
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: string
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total_amount?: number
          shipping_address?: {
            street: string
            city: string
            state: string
            zip_code: string
            country: string
          }
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          customer_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          product_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Type aliases for easier use
export type User = Database['public']['Tables']['users']['Row'];
export type Product = Database['public']['Tables']['products']['Row'] & {
  product_images?: Database['public']['Tables']['product_images']['Row'][];
  product_categories?: (Database['public']['Tables']['product_categories']['Row'] & {
    categories?: Database['public']['Tables']['categories']['Row'];
  })[];
  product_variants?: Database['public']['Tables']['product_variants']['Row'][];
};
export type Category = Database['public']['Tables']['categories']['Row'];
export type ProductImage = Database['public']['Tables']['product_images']['Row'];
export type ProductCategory = Database['public']['Tables']['product_categories']['Row'];
export type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
