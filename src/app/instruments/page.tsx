'use client';

import InstrumentStatus from '@/components/InstrumentStatus';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { instruments } from '@/data/instruments';
import { useAuth } from '@/contexts/AuthContext';
import { isUserAuthorized } from '@/lib/auth';

export default function InstrumentsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </main>
    );
  }

  if (!user || !isUserAuthorized(user.email)) {
    window.location.href = '/';
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex flex-col">
      <Navigation />
      <div className="flex-1">
        <InstrumentStatus initialInstruments={instruments} />
      </div>
      <Footer />
    </main>
  );
}