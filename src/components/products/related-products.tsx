'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

interface RelatedProductsProps {
  products: Product[];
  categoryName: string;
}

export default function RelatedProducts({ products, categoryName }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          More from {categoryName}
        </h2>
        <Link
          href={`/products?category=${products[0]?.product_categories?.[0]?.categories?.sariee_category_id}`}
          className="text-pink-600 hover:text-pink-700 font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0];
          
          return (
            <Link
              key={product.id}
              href={`/products/${product.sariee_product_id}`}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Product Image */}
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                {primaryImage ? (
                  <Image
                    src={primaryImage.image_url}
                    alt={primaryImage.alt_text || product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.compare_price)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
