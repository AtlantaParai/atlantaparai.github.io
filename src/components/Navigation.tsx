'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasAttendanceAccess, hasFinanceAccess } from '@/lib/auth';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    ...(user ? [{ name: 'Member Info', path: '/member-info' }] : []),
    { name: 'Instruments', path: '/instruments' },
    ...(hasAttendanceAccess(user?.email || null) ? [{ name: 'Attendance', path: '/attendance' }] : []),
    ...(hasFinanceAccess(user?.email || null) ? [{ name: 'Finance', path: '/finance' }] : [])
  ];

  const isActive = (itemPath: string) => {
    if (itemPath === '/') {
      return pathname === '/' || pathname === '';
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-4">
              <img 
                src="/images/ATPLogo.png" 
                alt="ATP Logo" 
                className="h-16 w-16 object-contain rounded-full bg-blue-600 p-1 cursor-pointer" 
              />
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-white">Atlanta Parai Team</h1>
                <p className="text-blue-100 text-xs md:text-sm">Preserving Tamil Culture</p>
              </div>
            </a>
          </div>
          
          {/* User Info and Logout */}
          <div className="flex items-center gap-4">
            <span className="text-xs md:text-sm text-blue-100">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-2 md:px-4 py-2 rounded-lg transition-all text-xs md:text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <div className="bg-gray-600 mt-2">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-all text-sm rounded-t-xl ${
                  isActive(item.path)
                    ? 'text-gray-700 bg-white shadow-md'
                    : 'text-white hover:text-gray-100 hover:bg-white hover:bg-opacity-20'
                }`}
              >
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}