'use client';

import FinanceTracker from '@/components/FinanceTracker';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function FinancePage() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src={process.env.NODE_ENV === 'production' ? '/APTWebsite/images/ATPLogo.png' : '/images/ATPLogo.png'} alt="ATP Logo" className="h-16 w-16" />
            <h1 className="text-3xl font-bold">Atlanta Parai Team</h1>
          </div>
          <p className="text-gray-600 mb-6">Continue to access the finance system</p>
          <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Continue with Site
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navigation />
      <FinanceTracker />
    </main>
  );
}