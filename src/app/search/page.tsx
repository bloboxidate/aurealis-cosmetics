import { Suspense } from 'react';
import SearchContent from '@/components/search/search-content';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    min_price?: string;
    max_price?: string;
    sort?: string;
    page?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <SearchContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Search Products - Aurealis Cosmetics',
  description: 'Find the perfect cosmetics and beauty products',
};
