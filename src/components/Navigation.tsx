'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasAttendanceAccess, hasFinanceAccess } from '@/lib/auth';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  console.log('Current pathname:', pathname); // Debug log

  const tabs = [
    { name: 'Instruments', path: '/', icon: '🎵' },
    ...(hasAttendanceAccess(user?.email || null) ? [{ name: 'Attendance', path: '/attendance', icon: '📋' }] : []),
    ...(hasFinanceAccess(user?.email || null) ? [{ name: 'Finance', path: '/finance', icon: '💰' }] : [])
  ];

  // Helper function to check if current path matches tab path
  const isActive = (tabPath: string) => {
    if (tabPath === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname.startsWith(tabPath);
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <img 
              src={process.env.NODE_ENV === 'production' ? '/APTWebsite/images/ATPLogo.png' : '/images/ATPLogo.png'} 
              alt="ATP Logo" 
              className="h-12 w-12" 
            />
            <h1 className="text-xl font-bold text-gray-800">Atlanta Parai Team</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600">Welcome, {user?.displayName}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium transition-all duration-200 text-sm ${
                isActive(tab.path)
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}