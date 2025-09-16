import { Metadata } from 'next';
import ShippingReturnsContent from '@/components/static/shipping-returns-content';

export const metadata: Metadata = {
  title: 'Shipping & Returns - Aurealis Cosmetics',
  description: 'Learn about our shipping options, delivery times, and return policy. Free shipping on orders over $75.',
  keywords: 'shipping, returns, delivery, free shipping, return policy, aurealis cosmetics',
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ShippingReturnsContent />
    </div>
  );
}
