import { Metadata } from 'next';
import PrivacyContent from '@/components/static/privacy-content';

export const metadata: Metadata = {
  title: 'Privacy Policy - Aurealis Cosmetics',
  description: 'Learn how Aurealis Cosmetics collects, uses, and protects your personal information. Read our comprehensive privacy policy.',
  keywords: 'privacy policy, data protection, personal information, aurealis cosmetics, GDPR',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PrivacyContent />
    </div>
  );
}
