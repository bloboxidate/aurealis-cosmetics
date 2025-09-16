// Supabase-Sariee Sync Utilities
// This file handles syncing data between Supabase and Sariee API

import { supabase } from './supabase';
import sarieeApi from './sariee-api';

interface SyncResult {
  success: boolean;
  synced: number;
  errors: string[];
}

export class SupabaseSarieeSync {
  // Sync products from Sariee to Supabase
  static async syncProducts(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      synced: 0,
      errors: []
    };

    try {
      // Get all products from Sariee
      const response = await sarieeApi.getAllProducts({ 
        type: 'unseperated', 
        per_page: 100 
      });

      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch products from Sariee');
      }

      const sarieeProducts = response.data;

      for (const sarieeProduct of sarieeProducts) {
        try {
          // Check if product already exists
          const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('sariee_product_id', sarieeProduct.id)
            .single();

          const productData = {
            sariee_product_id: sarieeProduct.id,
            name: sarieeProduct.barcodes[0]?.name || 'Unnamed Product',
            description: sarieeProduct.barcodes[0]?.description || '',
            price: sarieeProduct.barcodes[0]?.price || 0,
            sku: sarieeProduct.barcodes[0]?.sku || '',
            barcode: sarieeProduct.barcodes[0]?.barcode || '',
            inventory_quantity: sarieeProduct.total_quantity || 0,
            is_active: sarieeProduct.status,
            is_featured: false, // Will be determined by Sariee data
            updated_at: new Date().toISOString()
          };

          if (existingProduct) {
            // Update existing product
            const { error } = await supabase
              .from('products')
              .update(productData)
              .eq('sariee_product_id', sarieeProduct.id);

            if (error) {
              result.errors.push(`Failed to update product ${sarieeProduct.id}: ${error.message}`);
            } else {
              result.synced++;
            }
          } else {
            // Insert new product
            const { error } = await supabase
              .from('products')
              .insert(productData);

            if (error) {
              result.errors.push(`Failed to insert product ${sarieeProduct.id}: ${error.message}`);
            } else {
              result.synced++;
            }
          }

          // Sync product images
          if (sarieeProduct.barcodes[0]?.files?.length > 0) {
            await this.syncProductImages(sarieeProduct.id, sarieeProduct.barcodes[0].files);
          }

          // Sync product categories
          if (sarieeProduct.categories?.length > 0) {
            await this.syncProductCategories(sarieeProduct.id, sarieeProduct.categories);
          }

        } catch (error) {
          result.errors.push(`Error processing product ${sarieeProduct.id}: ${error}`);
        }
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to sync products: ${error}`);
    }

    return result;
  }

  // Sync categories from Sariee to Supabase
  static async syncCategories(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      synced: 0,
      errors: []
    };

    try {
      const response = await sarieeApi.getCategories({ per_page: 100 });

      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch categories from Sariee');
      }

      const sarieeCategories = response.data;

      for (const sarieeCategory of sarieeCategories) {
        try {
          const { data: existingCategory } = await supabase
            .from('categories')
            .select('id')
            .eq('sariee_category_id', sarieeCategory.id)
            .single();

          const categoryData = {
            sariee_category_id: sarieeCategory.id,
            name: sarieeCategory.name,
            is_featured: sarieeCategory.is_featured,
            is_active: true,
            updated_at: new Date().toISOString()
          };

          if (existingCategory) {
            const { error } = await supabase
              .from('categories')
              .update(categoryData)
              .eq('sariee_category_id', sarieeCategory.id);

            if (error) {
              result.errors.push(`Failed to update category ${sarieeCategory.id}: ${error.message}`);
            } else {
              result.synced++;
            }
          } else {
            const { error } = await supabase
              .from('categories')
              .insert(categoryData);

            if (error) {
              result.errors.push(`Failed to insert category ${sarieeCategory.id}: ${error.message}`);
            } else {
              result.synced++;
            }
          }

        } catch (error) {
          result.errors.push(`Error processing category ${sarieeCategory.id}: ${error}`);
        }
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to sync categories: ${error}`);
    }

    return result;
  }

  // Sync product images
  private static async syncProductImages(sarieeProductId: string, files: any[]): Promise<void> {
    try {
      // Get the product ID from Supabase
      const { data: product } = await supabase
        .from('products')
        .select('id')
        .eq('sariee_product_id', sarieeProductId)
        .single();

      if (!product) return;

      // Delete existing images
      await supabase
        .from('product_images')
        .delete()
        .eq('product_id', product.id);

      // Insert new images
      const imageData = files.map((file, index) => ({
        product_id: product.id,
        image_url: file.src,
        alt_text: file.alt || '',
        sort_order: index,
        is_primary: index === 0
      }));

      await supabase
        .from('product_images')
        .insert(imageData);

    } catch (error) {
      console.error('Error syncing product images:', error);
    }
  }

  // Sync product categories
  private static async syncProductCategories(sarieeProductId: string, categories: any[]): Promise<void> {
    try {
      // Get the product ID from Supabase
      const { data: product } = await supabase
        .from('products')
        .select('id')
        .eq('sariee_product_id', sarieeProductId)
        .single();

      if (!product) return;

      // Delete existing category relationships
      await supabase
        .from('product_categories')
        .delete()
        .eq('product_id', product.id);

      // Insert new category relationships
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('sariee_category_id', category.id)
          .single();

        if (categoryData) {
          await supabase
            .from('product_categories')
            .insert({
              product_id: product.id,
              category_id: categoryData.id,
              is_primary: i === 0
            });
        }
      }

    } catch (error) {
      console.error('Error syncing product categories:', error);
    }
  }

  // Sync user data from Sariee to Supabase
  static async syncUserData(userId: string): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      synced: 0,
      errors: []
    };

    try {
      // Get user profile from Sariee
      const response = await sarieeApi.getUserProfile();

      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch user profile from Sariee');
      }

      const sarieeUser = response.data.user;

      // Update user in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          sariee_user_id: sarieeUser.id,
          first_name: sarieeUser.first_name,
          last_name: sarieeUser.last_name,
          phone: sarieeUser.phone,
          is_verified: sarieeUser.is_verified === 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        result.errors.push(`Failed to update user: ${error.message}`);
      } else {
        result.synced++;
      }

      // Sync user addresses
      const addressesResponse = await sarieeApi.getAddresses();
      if (addressesResponse.status) {
        await this.syncUserAddresses(userId, addressesResponse.data);
      }

    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to sync user data: ${error}`);
    }

    return result;
  }

  // Sync user addresses
  private static async syncUserAddresses(userId: string, addresses: any[]): Promise<void> {
    try {
      // Delete existing addresses
      await supabase
        .from('user_addresses')
        .delete()
        .eq('user_id', userId);

      // Insert new addresses
      const addressData = addresses.map(address => ({
        user_id: userId,
        sariee_address_id: address.id,
        name: address.name,
        street: address.street,
        building: address.building,
        floor: address.floor,
        flat: address.flat,
        landmark: address.landmark,
        city: address.city,
        phone: address.phone,
        is_default: address.is_default === 1,
        is_active: true
      }));

      await supabase
        .from('user_addresses')
        .insert(addressData);

    } catch (error) {
      console.error('Error syncing user addresses:', error);
    }
  }

  // Full sync - sync all data
  static async fullSync(): Promise<{
    products: SyncResult;
    categories: SyncResult;
  }> {
    console.log('Starting full sync with Sariee...');

    const [productsResult, categoriesResult] = await Promise.all([
      this.syncCategories(),
      this.syncProducts()
    ]);

    console.log('Full sync completed:', {
      categories: categoriesResult,
      products: productsResult
    });

    return {
      products: productsResult,
      categories: categoriesResult
    };
  }
}
