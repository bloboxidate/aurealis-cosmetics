import { Metadata } from 'next';
import TermsContent from '@/components/static/terms-content';

export const metadata: Metadata = {
  title: 'Terms of Service - Aurealis Cosmetics',
  description: 'Read our Terms of Service to understand the terms and conditions for using Aurealis Cosmetics website and services.',
  keywords: 'terms of service, terms and conditions, legal, aurealis cosmetics',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TermsContent />
    </div>
  );
}
