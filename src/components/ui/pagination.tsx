'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

export default function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  const searchParamsObj = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParamsObj);
    params.set('page', page.toString());
    return `/products?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center space-x-1 overflow-x-auto">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 whitespace-nowrap"
        >
          <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Link>
      ) : (
        <span className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed whitespace-nowrap">
          <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex space-x-1 min-w-0">
        {getVisiblePages().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-sm font-medium text-gray-500"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isCurrentPage = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={createPageUrl(pageNum)}
              className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap ${
                isCurrentPage
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 whitespace-nowrap"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
        </Link>
      ) : (
        <span className="flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-300 bg-gray-100 border border-gray-200 rounded-md cursor-not-allowed whitespace-nowrap">
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
        </span>
      )}
    </nav>
  );
}
