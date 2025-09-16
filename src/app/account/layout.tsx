import { Suspense } from 'react';
import AccountNavigation from '@/components/account/account-navigation';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your account settings and view your orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Account Navigation */}
          <div className="lg:col-span-1">
            <AccountNavigation />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'My Account - Aurealis Cosmetics',
  description: 'Manage your account settings, view orders, and track your purchases',
};
