'use client';

import MemberInfo from '@/components/MemberInfo';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function MemberInfoPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </main>
    );
  }

  if (!user) {
    const basePath = process.env.NODE_ENV === 'production' ? '/APTWebsite' : '';
    window.location.href = basePath + '/';
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex flex-col">
      <Navigation />
      <div className="flex-1">
        <MemberInfo />
      </div>
      <Footer />
    </main>
  );
}