import { Metadata } from 'next';
import AboutContent from '@/components/static/about-content';

export const metadata: Metadata = {
  title: 'About Us - Aurealis Cosmetics',
  description: 'Learn about Aurealis Cosmetics - your trusted partner in premium beauty and skincare products. Discover our story, mission, and commitment to quality.',
  keywords: 'about aurealis, cosmetics company, beauty brand, skincare, makeup, premium cosmetics',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AboutContent />
    </div>
  );
}
