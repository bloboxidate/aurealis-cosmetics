import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import ProductGrid from '@/components/products/product-grid';
import ProductFilters from '@/components/products/product-filters';
import LoadingSpinner from '@/components/ui/loading-spinner';
import GlobalSearch from '@/components/search/global-search';

interface SearchParams {
  category?: string;
  search?: string;
  sort?: string;
  page?: string;
  price?: string;
}

interface ProductsPageProps {
  searchParams: Promise<SearchParams>;
}

// Default products for when Supabase is not available
const defaultProducts = [
  {
    id: '1',
    sariee_product_id: '1',
    name: 'Hydrating Face Serum',
    description: 'Intensive hydration for all skin types with hyaluronic acid and vitamin C',
    price: 45.99,
    compare_price: 59.99,
    sku: 'SERUM-001',
    brand: 'Aurealis',
    inventory_quantity: 50,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/serum-1.jpg', alt_text: 'Hydrating Face Serum', is_primary: true }
    ],
    product_categories: [
      { categories: { name: 'Skincare', sariee_category_id: 'skincare' } }
    ]
  },
  {
    id: '2',
    sariee_product_id: '2',
    name: 'Matte Lipstick Collection',
    description: 'Long-lasting matte finish in 12 beautiful shades',
    price: 24.99,
    compare_price: null,
    sku: 'LIP-001',
    brand: 'Aurealis',
    inventory_quantity: 30,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/lipstick-1.jpg', alt_text: 'Matte Lipstick Collection', is_primary: true }
    ],
    product_categories: [
      { categories: { name: 'Makeup', sariee_category_id: 'makeup' } }
    ]
  },
  {
    id: '3',
    sariee_product_id: '3',
    name: 'Signature Perfume',
    description: 'Elegant floral fragrance for special occasions',
    price: 89.99,
    compare_price: 120.00,
    sku: 'PERF-001',
    brand: 'Aurealis',
    inventory_quantity: 25,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/perfume-1.jpg', alt_text: 'Signature Perfume', is_primary: true }
    ],
    product_categories: [
      { categories: { name: 'Fragrance', sariee_category_id: 'fragrance' } }
    ]
  },
  {
    id: '4',
    sariee_product_id: '4',
    name: 'Nourishing Hair Mask',
    description: 'Deep conditioning treatment for damaged hair',
    price: 32.99,
    compare_price: null,
    sku: 'HAIR-001',
    brand: 'Aurealis',
    inventory_quantity: 40,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/hair-mask-1.jpg', alt_text: 'Nourishing Hair Mask', is_primary: true }
    ],
    product_categories: [
      { categories: { name: 'Hair Care', sariee_category_id: 'hair-care' } }
    ]
  },
  {
    id: '5',
    sariee_product_id: '5',
    name: 'Vitamin C Brightening Cream',
    description: 'Brighten and even skin tone with powerful vitamin C',
    price: 38.99,
    compare_price: 49.99,
    sku: 'VITC-001',
    brand: 'Aurealis',
    inventory_quantity: 35,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/serum-1.jpg', alt_text: 'Vitamin C Brightening Cream', is_primary: true }
    ],
    product_categories: [
      { categories: { name: 'Skincare', sariee_category_id: 'skincare' } }
    ]
  },
  {
    id: '6',
    sariee_product_id: '6',
    name: 'Luxury Bath Oil',
    description: 'Indulgent bath oil with essential oils for relaxation',
    price: 28.99,
    compare_price: null,
    sku: 'BATH-001',
    brand: 'Aurealis',
    inventory_quantity: 20,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    product_images: [
      { image_url: '/products/hair-mask-1.jpg', alt_text: 'Luxury Bath Oil', is_primary: true }
    ],
    product_categories: [
      { categories: { name: 'Bath & Body', sariee_category_id: 'bath-body' } }
    ]
  }
];

async function getProducts(searchParams: SearchParams) {
  const { category, search, sort = 'created_at', page = '1', price } = searchParams;
  const pageNumber = parseInt(page);
  const itemsPerPage = 12;
  const offset = (pageNumber - 1) * itemsPerPage;

  // Check if Supabase is properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    // Use default products if Supabase is not configured
    let filteredProducts = [...defaultProducts];
    
    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.product_categories.some(pc => pc.categories.sariee_category_id === category)
      );
    }
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Price range filtering
    if (price) {
      const [minPrice, maxPrice] = price.split('-').map(p => p === '+' ? Infinity : parseFloat(p));
      filteredProducts = filteredProducts.filter(p => {
        if (maxPrice === Infinity) {
          return p.price >= minPrice;
        }
        return p.price >= minPrice && p.price <= maxPrice;
      });
    }
    
    // Sorting
    switch (sort) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
        filteredProducts.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
      default:
        // Keep original order
        break;
    }
    
    const totalCount = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(offset, offset + itemsPerPage);
    
    return {
      products: paginatedProducts,
      totalCount,
      totalPages: Math.ceil(totalCount / itemsPerPage),
      currentPage: pageNumber
    };
  }

  let query = supabase
    .from('products')
    .select(`
      *,
      product_images!inner(image_url, alt_text, is_primary),
      product_categories!inner(
        category_id,
        categories!inner(name, sariee_category_id)
      )
    `)
    .eq('is_active', true);

  // Filter by category
  if (category) {
    query = query.eq('product_categories.categories.sariee_category_id', category);
  }

  // Search functionality
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Price range filtering
  if (price) {
    const [minPrice, maxPrice] = price.split('-').map(p => p === '+' ? null : parseFloat(p));
    if (maxPrice === null) {
      // Handle "100+" case
      query = query.gte('price', minPrice);
    } else {
      query = query.gte('price', minPrice).lte('price', maxPrice);
    }
  }

  // Sorting
  switch (sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'name':
      query = query.order('name', { ascending: true });
      break;
    case 'featured':
      query = query.order('is_featured', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  // Pagination
  query = query.range(offset, offset + itemsPerPage - 1);

  const { data: products, error, count } = await query;

  if (error) {
    console.warn('Supabase not available, using default products:', error.message);
    return {
      products: defaultProducts.slice(0, itemsPerPage),
      totalCount: defaultProducts.length,
      totalPages: Math.ceil(defaultProducts.length / itemsPerPage),
      currentPage: pageNumber
    };
  }

  return {
    products: products || [],
    totalCount: count || 0,
    totalPages: Math.ceil((count || 0) / itemsPerPage),
    currentPage: pageNumber
  };
}

const defaultCategories = [
  {
    id: '1',
    sariee_category_id: 'skincare',
    name: 'Skincare',
    description: 'Nourish and protect your skin',
    image_url: '/categories/skincare.jpg',
    is_active: true,
    sort_order: 1
  },
  {
    id: '2',
    sariee_category_id: 'makeup',
    name: 'Makeup',
    description: 'Enhance your natural beauty',
    image_url: '/categories/makeup.jpg',
    is_active: true,
    sort_order: 2
  },
  {
    id: '3',
    sariee_category_id: 'fragrance',
    name: 'Fragrance',
    description: 'Signature scents for every occasion',
    image_url: '/categories/fragrance.jpg',
    is_active: true,
    sort_order: 3
  },
  {
    id: '4',
    sariee_category_id: 'hair-care',
    name: 'Hair Care',
    description: 'Healthy, beautiful hair starts here',
    image_url: '/categories/hair-care.jpg',
    is_active: true,
    sort_order: 4
  },
  {
    id: '5',
    sariee_category_id: 'bath-body',
    name: 'Bath & Body',
    description: 'Pamper yourself with luxury',
    image_url: '/categories/bath-body.jpg',
    is_active: true,
    sort_order: 5
  },
  {
    id: '6',
    sariee_category_id: 'tools',
    name: 'Tools & Accessories',
    description: 'Everything you need for perfect application',
    image_url: '/categories/tools.jpg',
    is_active: true,
    sort_order: 6
  }
];

async function getCategories() {
  // Check if Supabase is properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    return defaultCategories;
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.warn('Supabase not available, using default categories:', error.message);
    return defaultCategories;
  }

  return categories || defaultCategories;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const [productsData, categories] = await Promise.all([
    getProducts(resolvedSearchParams),
    getCategories()
  ]);

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {resolvedSearchParams.category 
              ? categories.find(c => c.sariee_category_id === resolvedSearchParams.category)?.name || 'Products'
              : 'All Products'
            }
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {resolvedSearchParams.search 
              ? `Search results for "${resolvedSearchParams.search}"`
              : `Showing ${productsData.products.length} of ${productsData.totalCount} products`
            }
          </p>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden mb-4">
          <GlobalSearch className="w-full max-w-sm" />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <ProductFilters 
              categories={categories}
              currentCategory={resolvedSearchParams.category}
              currentSearch={resolvedSearchParams.search}
              currentSort={resolvedSearchParams.sort}
              currentPriceRange={resolvedSearchParams.price}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 order-1 lg:order-2">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductGrid 
                products={productsData.products}
                totalPages={productsData.totalPages}
                currentPage={productsData.currentPage}
                searchParams={resolvedSearchParams as Record<string, string | undefined>}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Products - Aurealis Cosmetics',
  description: 'Discover our premium collection of cosmetics and skincare products',
};
