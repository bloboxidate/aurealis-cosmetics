import { Metadata } from 'next';
import ContactContent from '@/components/static/contact-content';

export const metadata: Metadata = {
  title: 'Contact Us - Aurealis Cosmetics',
  description: 'Get in touch with Aurealis Cosmetics. We\'re here to help with product questions, orders, and beauty advice. Contact our customer service team today.',
  keywords: 'contact aurealis, customer service, beauty consultation, product support, order help',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ContactContent />
    </div>
  );
}
