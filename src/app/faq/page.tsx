import { Metadata } from 'next';
import FAQContent from '@/components/static/faq-content';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Aurealis Cosmetics',
  description: 'Find answers to common questions about Aurealis Cosmetics products, shipping, returns, and more.',
  keywords: 'FAQ, frequently asked questions, help, support, aurealis cosmetics',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FAQContent />
    </div>
  );
}
