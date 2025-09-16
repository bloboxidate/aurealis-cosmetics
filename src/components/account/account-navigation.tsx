'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  UserIcon, 
  ShoppingBagIcon, 
  MapPinIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';

const navigation = [
  { name: 'Dashboard', href: '/account', icon: UserIcon },
  { name: 'Orders', href: '/account/orders', icon: ShoppingBagIcon },
  { name: 'Addresses', href: '/account/addresses', icon: MapPinIcon },
  { name: 'Profile', href: '/account/profile', icon: Cog6ToothIcon },
];

export default function AccountNavigation() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Account</h2>
      </div>

      <nav className="px-4 sm:px-6 py-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-pink-50 text-pink-700 border-r-2 border-pink-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Logout Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </nav>
    </div>
  );
}
