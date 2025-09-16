// Sariee API Integration for Aurealis Cosmetics
// Based on actual Sariee API documentation

import { validateSarieeResponse, handleSarieeError, SarieeApiError } from './sariee-error-handler';
import { sarieeDebugger } from './sariee-debug';

interface SarieeConfig {
  baseUrl: string;
  timeout?: number;
}

interface SarieeResponse<T = any> {
  status: boolean;
  internal_code: number;
  code: number;
  message: string;
  data: T;
  _meta?: {
    pagination?: {
      current_page: number;
      from: number;
      last_page: number;
      path: string;
      per_page: number;
      to: number;
      total: number;
      has_more: boolean;
    };
    filter?: Array<{
      name: string;
      title: string;
      type: string;
      operator: string;
      value_example: any;
    }>;
    options?: Record<string, any>;
  };
}

interface User {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email_verified_at: string | null;
  birth_date: string | null;
  phone: string;
  email: string;
  is_verified: number;
  company_id: string;
  remember_token: string | null;
  full_name: string;
}

interface LoginResponse {
  user: User;
  access_token: string;
  token: {
    name: string;
    abilities: string[];
    expires_at: string;
    tokenable_id: string;
    tokenable_type: string;
    updated_at: string;
    created_at: string;
    id: number;
  };
}

interface Product {
  id: string;
  company_id: string;
  total_quantity: number;
  status: boolean;
  is_same_price: number;
  is_same_size: number;
  is_simple: number;
  is_same_image: number;
  mpn: string | null;
  country_id: string | null;
  hs_code: string | null;
  model_info: string | null;
  is_shippable: number;
  type: 'physical' | 'digital';
  tax_value: number;
  material: string | null;
  code: number;
  barcodes_count: number | null;
  categories_count: number | null;
  chat_conversations_count: number | null;
  updated_at_formatted: string;
  created_at_formatted: string;
  barcodes: Array<{
    id: string;
    name: string;
    brief: string | null;
    description: string;
    category: string;
    files: Array<{
      id: string;
      sorting: number;
      src: string;
      thumbnails: Array<{
        src: string;
        width: string;
        height: string;
        quality: string;
      }>;
    }>;
    barcode: string;
    barcode_name: string;
    serial: string;
    gtin: string;
    sku: string;
    quantity: number;
    length: number | null;
    url_path: string;
    height: number | null;
    width: number | null;
    weight: number | null;
    price: number;
    creation_date: string;
    last_update: string;
  }>;
  categories: Array<{
    id: string;
    type: string;
    name: string;
    status: number;
    is_featured: boolean;
    parent_id: string | null;
    image: {
      id: string;
      sorting: number;
      src: string;
      thumbnails: Array<{
        src: string;
        width: string;
        height: string;
        quality: string;
      }>;
    };
    products_count: number | null;
    ar: {
      name: string;
      creation_date: string;
      last_update: string;
    };
    en: {
      name: string;
      creation_date: string;
      last_update: string;
    };
    creation_date: string;
    last_update: string;
  }>;
}

interface Category {
  id: string;
  name: string;
  is_featured: boolean;
}

class SarieeApiClient {
  private config: SarieeConfig;
  private accessToken: string | null = null;

  constructor(config: SarieeConfig) {
    this.config = {
      timeout: 10000,
      ...config
    };
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<SarieeResponse<T>> {
    const startTime = Date.now();
    const url = `${this.config.baseUrl}${endpoint}`;
    
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      // Only add Content-Type for requests with body
      if (options.body && !(options.headers as Record<string, string>)?.['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      if (this.accessToken) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
      }

      // Log request
      sarieeDebugger.logRequest(
        options.method || 'GET', 
        url, 
        options.body ? JSON.parse(options.body as string) : undefined
      );

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        signal: AbortSignal.timeout(this.config.timeout!),
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        sarieeDebugger.logError(url, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        }, duration);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Log response
      sarieeDebugger.logResponse(url, data, duration);
      
      // Validate response structure
      if (!validateSarieeResponse(data)) {
        sarieeDebugger.logError(url, 'Invalid response format from Sariee API', duration);
        throw new Error('Invalid response format from Sariee API');
      }

      // Check if response indicates an error
      if (!data.status) {
        sarieeDebugger.logError(url, data, duration);
        handleSarieeError(data);
      }

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      sarieeDebugger.logError(url, error, duration);
      throw error;
    }
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<SarieeResponse<LoginResponse>> {
    const response = await this.makeRequest<LoginResponse>('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password 
      }),
    });

    if (response.status && response.data.access_token) {
      this.accessToken = response.data.access_token;
      // Store token in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('sariee_access_token', response.data.access_token);
        localStorage.setItem('sariee_user', JSON.stringify(response.data.user));
      }
    }

    return response;
  }

  async register(userData: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    phone_code: string;
    password: string;
    password_confirm: string;
  }): Promise<SarieeResponse<LoginResponse>> {
    const response = await this.makeRequest<LoginResponse>('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.status && response.data.access_token) {
      this.accessToken = response.data.access_token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sariee_access_token', response.data.access_token);
        localStorage.setItem('sariee_user', JSON.stringify(response.data.user));
      }
    }

    return response;
  }

  async forgetPassword(email: string): Promise<SarieeResponse<string>> {
    return this.makeRequest<string>('/forget-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(resetToken: string, password: string, passwordConfirm: string): Promise<SarieeResponse<any>> {
    return this.makeRequest('/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reset_token: resetToken,
        password,
        password_confirm: passwordConfirm,
      }),
    });
  }

  // User Management APIs
  async getUserProfile(): Promise<SarieeResponse<{ user: User }>> {
    return this.makeRequest<{ user: User }>('/user/profile', {
      method: 'GET',
    });
  }

  async updateProfile(profileData: {
    email: string;
    phone: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
  }): Promise<SarieeResponse<any>> {
    return this.makeRequest('/user/change-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(password: string, passwordConfirm: string): Promise<SarieeResponse<any>> {
    return this.makeRequest('/user/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        password_confirm: passwordConfirm,
      }),
    });
  }

  // Address Management APIs
  async addAddress(addressData: {
    is_default: number;
    name: string;
    street: string;
    building: string;
    floor: string;
    flat: string;
    landmark?: string;
    latitude?: string;
    longitude?: string;
    phone: string;
    comment?: string;
    city_id: string;
  }): Promise<SarieeResponse<any>> {
    return this.makeRequest('/user/store-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });
  }

  async updateAddress(addressId: string, addressData: {
    is_default: number;
    name: string;
    street: string;
    building: string;
    floor: string;
    flat: string;
    landmark?: string;
    latitude?: string;
    longitude?: string;
    phone: string;
    comment?: string;
    city_id: string;
  }): Promise<SarieeResponse<any>> {
    return this.makeRequest('/user/update-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_address_id: addressId,
        ...addressData,
      }),
    });
  }

  async getAddresses(): Promise<SarieeResponse<any[]>> {
    return this.makeRequest<any[]>('/user/list-address', {
      method: 'GET',
    });
  }

  // Order Management APIs
  async getUserOrders(): Promise<SarieeResponse<any[]>> {
    return this.makeRequest<any[]>('/user/orders', {
      method: 'GET',
    });
  }

  async getSingleOrder(orderId: string): Promise<SarieeResponse<any>> {
    return this.makeRequest<any>(`/profile/orders/show?order_id=${orderId}`, {
      method: 'GET',
    });
  }

  // Product APIs
  async getAllProducts(params?: {
    type?: 'seperated' | 'unseperated';
    per_page?: number;
    page?: number;
    filter?: Array<{
      name: string;
      value: string;
    }>;
  }): Promise<SarieeResponse<Product[]>> {
    let endpoint = '/all-products';
    const queryParams = new URLSearchParams();

    if (params?.type) queryParams.append('type', params.type);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    
    if (params?.filter) {
      params.filter.forEach((filter, index) => {
        queryParams.append(`filter[${index}][name]`, filter.name);
        queryParams.append(`filter[${index}][value]`, filter.value);
      });
    }

    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }

    return this.makeRequest<Product[]>(endpoint, {
      method: 'GET',
    });
  }

  async getFeaturedProducts(type: 'seperated' | 'unseperated' = 'unseperated'): Promise<SarieeResponse<Product[]>> {
    return this.makeRequest<Product[]>(`/featured-products?type=${type}`, {
      method: 'GET',
    });
  }

  async getSingleProduct(productId: string): Promise<SarieeResponse<Product>> {
    return this.makeRequest<Product>(`/single-product?product_id=${productId}`, {
      method: 'GET',
    });
  }

  async getRelatedProducts(categoryId: string, type: 'seperated' | 'unseperated' = 'unseperated'): Promise<SarieeResponse<Product[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('type', type);
    queryParams.append('filter[0][name]', 'product_category_pivots.product_category_id');
    queryParams.append('filter[0][value]', categoryId);

    return this.makeRequest<Product[]>(`/all-products?${queryParams.toString()}`, {
      method: 'GET',
    });
  }

  // Search Products
  async searchProducts(params: {
    query?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    sort?: 'name' | 'price' | 'created_at' | 'popularity';
    sort_direction?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
    type?: 'seperated' | 'unseperated';
  }): Promise<SarieeResponse<Product[]>> {
    let endpoint = '/all-products';
    const queryParams = new URLSearchParams();

    // Add basic parameters
    if (params.type) queryParams.append('type', params.type);
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.page) queryParams.append('page', params.page.toString());

    // Build filters array
    const filters: Array<{ name: string; value: string }> = [];

    // Search query filter
    if (params.query) {
      filters.push({
        name: 'name',
        value: params.query
      });
    }

    // Category filter
    if (params.category) {
      filters.push({
        name: 'product_category_pivots.product_category_id',
        value: params.category
      });
    }

    // Price range filters
    if (params.min_price !== undefined) {
      filters.push({
        name: 'price',
        value: `>=${params.min_price}`
      });
    }
    if (params.max_price !== undefined) {
      filters.push({
        name: 'price',
        value: `<=${params.max_price}`
      });
    }

    // Add filters to query params
    filters.forEach((filter, index) => {
      queryParams.append(`filter[${index}][name]`, filter.name);
      queryParams.append(`filter[${index}][value]`, filter.value);
    });

    // Add sorting
    if (params.sort) {
      queryParams.append('sort', params.sort);
      if (params.sort_direction) {
        queryParams.append('sort_direction', params.sort_direction);
      }
    }

    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }

    return this.makeRequest<Product[]>(endpoint, {
      method: 'GET',
    });
  }

  // Category APIs
  async getCategories(params?: {
    per_page?: number;
    page?: number;
    filter?: Array<{
      name: string;
      value: string;
    }>;
  }): Promise<SarieeResponse<Category[]>> {
    let endpoint = '/list-categories';
    const queryParams = new URLSearchParams();

    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    
    if (params?.filter) {
      params.filter.forEach((filter, index) => {
        queryParams.append(`filter[${index}][name]`, filter.name);
        queryParams.append(`filter[${index}][value]`, filter.value);
      });
    }

    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }

    return this.makeRequest<Category[]>(endpoint, {
      method: 'GET',
    });
  }

  // Cart APIs
  async getCart(): Promise<SarieeResponse<any>> {
    return this.makeRequest<any>('/cart/get-cart', {
      method: 'GET',
    });
  }

  async removeFromCart(productId: string, productBarcodeId?: string): Promise<SarieeResponse<any>> {
    return this.makeRequest('/cart/add-update-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        quantity: 0, // Setting quantity to 0 removes the item
        product_barcode_id: productBarcodeId,
      }),
    });
  }

  async addToCart(cartData: {
    product_id: string;
    quantity: number;
    product_barcode_id?: string;
  }): Promise<SarieeResponse<any>> {
    return this.makeRequest('/cart/add-update-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartData),
    });
  }

  async addPromocode(promocode: string): Promise<SarieeResponse<any>> {
    return this.makeRequest('/cart/add-promocode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ promocode }),
    });
  }

  // Checkout APIs
  async getAvailablePaymentMethods(): Promise<SarieeResponse<any>> {
    return this.makeRequest('/cart/available-payment-methods', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async checkout(checkoutData: {
    payment_method: string;
    shipping_address_id: string;
    billing_address_id?: string;
    notes?: string;
  }): Promise<SarieeResponse<any>> {
    return this.makeRequest('/cart/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });
  }

  // Token Management
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearToken() {
    this.accessToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sariee_access_token');
      localStorage.removeItem('sariee_user');
    }
  }

  // Initialize from localStorage
  initializeFromStorage() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('sariee_access_token');
      if (token) {
        this.accessToken = token;
      }
    }
  }
}

// Initialize Sariee API client
const sarieeApi = new SarieeApiClient({
  baseUrl: process.env.NEXT_PUBLIC_SARIEE_API_URL || 'https://api.sariee.com/api/company/public/v2',
});

// Initialize token from localStorage if available
sarieeApi.initializeFromStorage();

export default sarieeApi;
export { SarieeApiClient, type SarieeResponse, type User, type Product, type Category, type LoginResponse };
