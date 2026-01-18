'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleOAuthService } from '@/lib/google-oauth';
import { FinanceSheetsService } from '@/lib/finance-sheets-service';
import { adults2025 } from '@/data/2025Adults';
import { kidsTeens2025 } from '@/data/2025KidsTeens';
import { coreAdults } from '@/data/CoreAdults';
import { coreTeensKids } from '@/data/CoreTeensKids';
import FinanceQRScanner from '@/components/FinanceQRScanner';

interface Member {
  id: string;
  name: string;
}

interface PaymentRecord {
  memberName: string;
  status: string;
}

export default function FinanceTracker() {
  const [selectedSection, setSelectedSection] = useState('2025 Adults');
  const [paymentStatus, setPaymentStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [oauthReady, setOauthReady] = useState(false);
  const [oauthInitialized, setOauthInitialized] = useState(false);
  const { user } = useAuth();

  const sections = {
    '2025 Adults': adults2025.map((name, index) => ({ id: `2025adults-${index + 1}`, name })),
    '2025 Kids Teens': kidsTeens2025.map((name, index) => ({ id: `2025kidsteens-${index + 1}`, name })),
    'Core Adults': coreAdults.map((name, index) => ({ id: `coreadults-${index + 1}`, name })),
    'Core Teens Kids': coreTeensKids.map((name, index) => ({ id: `coreteenskids-${index + 1}`, name })),
  };

  useEffect(() => {
    if (!oauthInitialized) {
      setOauthInitialized(true);
      GoogleOAuthService.initialize().then(async () => {
        setOauthReady(true);
        // Trigger OAuth flow immediately if no token exists
        await GoogleOAuthService.getAccessToken();
      });
    }
  }, []);

  useEffect(() => {
    if (oauthReady) {
      loadPaymentStatus();
      
      // Pull-to-refresh functionality
      let startY = 0;
      let isRefreshing = false;
      
      const handleTouchStart = (e: TouchEvent) => {
        startY = e.touches[0].clientY;
      };
      
      const handleTouchMove = (e: TouchEvent) => {
        if (window.scrollY === 0 && !isRefreshing) {
          const currentY = e.touches[0].clientY;
          const pullDistance = currentY - startY;
          
          if (pullDistance > 100) {
            isRefreshing = true;
            loadPaymentStatus();
            setTimeout(() => { isRefreshing = false; }, 1000);
          }
        }
      };
      
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
      
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [selectedSection, oauthReady]);

  // Reload data when tab becomes visible/focused
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && oauthReady) {
        loadPaymentStatus();
      }
    };

    const handleFocus = () => {
      if (oauthReady) {
        loadPaymentStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [oauthReady]);

  const loadPaymentStatus = async () => {
    try {
      setLoading(true);
      const accessToken = await GoogleOAuthService.getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }
      
      const records = await FinanceSheetsService.getPaymentStatus(selectedSection, accessToken);
      const statusMap: Record<string, string> = {};
      records.forEach((record: PaymentRecord) => {
        statusMap[record.memberName] = record.status;
      });
      setPaymentStatus(statusMap);
    } catch (error) {
      console.error('Error loading payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentStatus = async (member: Member) => {
    if (!user) return;

    try {
      const accessToken = await GoogleOAuthService.getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      const currentStatus = paymentStatus[member.name];
      const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid';
      
      await FinanceSheetsService.updatePaymentStatus({
        memberName: member.name,
        section: selectedSection,
        status: newStatus,
        updatedBy: user.email || 'Unknown'
      }, accessToken);

      setPaymentStatus(prev => ({
        ...prev,
        [member.name]: newStatus
      }));
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const getFilteredMembers = () => {
    return sections[selectedSection as keyof typeof sections] || [];
  };

  const getStatusCounts = () => {
    const sectionMembers = getFilteredMembers();
    const paid = sectionMembers.filter(member => 
      paymentStatus[member.name] === 'paid'
    ).length;
    const unpaid = sectionMembers.length - paid;
    return { paid, unpaid };
  };

  const resetPaymentStatus = () => {
    setPaymentStatus({});
  };

  const counts = getStatusCounts();

  return (
    <div className="max-w-6xl mx-auto p-4">
      {loading && (
        <div className="text-center mb-2">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-lg p-3 mb-2">
        {/* Section Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(sections).map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-2 py-2 rounded-lg transition-colors text-xs leading-tight text-center ${
                selectedSection === section
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Counts and Reset Button */}
      <div className="bg-white rounded-lg shadow-lg p-2 mb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FinanceQRScanner />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <span className="text-green-600 font-semibold">Paid: {counts.paid}</span>
              <span className="text-red-600 font-semibold">Unpaid: {counts.unpaid}</span>
            </div>
            <button
              onClick={resetPaymentStatus}
              disabled={user?.email !== 'ipan85@gmail.com'}
              className={`px-2 py-1 rounded-lg transition-colors text-sm ${
                user?.email !== 'ipan85@gmail.com'
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Unpaid Members */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-bold text-red-600 mb-2 text-center">Unpaid</h2>
          <div className="space-y-2">
            {getFilteredMembers()
              .filter(member => paymentStatus[member.name] !== 'paid')
              .map((member) => (
                <button
                  key={member.id}
                  onClick={() => togglePaymentStatus(member)}
                  className="w-full flex justify-between items-center p-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm"
                >
                  <span className="text-red-800">{member.name}</span>
                  <span className="text-red-600">❌</span>
                </button>
              ))}
          </div>
        </div>

        {/* Paid Members */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-bold text-green-600 mb-2 text-center">Paid</h2>
          <div className="space-y-2">
            {getFilteredMembers()
              .filter(member => paymentStatus[member.name] === 'paid')
              .map((member) => (
                <button
                  key={member.id}
                  onClick={() => togglePaymentStatus(member)}
                  disabled={paymentStatus[member.name] === 'paid' && user?.email !== 'ipan85@gmail.com'}
                  className={`w-full flex justify-between items-center p-2 border border-green-200 rounded-lg transition-colors text-sm ${
                    paymentStatus[member.name] === 'paid' && user?.email !== 'ipan85@gmail.com'
                      ? 'bg-gray-100 cursor-not-allowed opacity-50'
                      : 'bg-green-50 hover:bg-green-100'
                  }`}
                >
                  <span className={`font-semibold ${
                    paymentStatus[member.name] === 'paid' && user?.email !== 'ipan85@gmail.com'
                      ? 'text-gray-500'
                      : 'text-green-800'
                  }`}>{member.name}</span>
                  <span className={paymentStatus[member.name] === 'paid' && user?.email !== 'ipan85@gmail.com' ? 'text-gray-400' : 'text-green-600'}>✅</span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}