'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleSheetsService } from '@/lib/google-sheets-service';
import { GoogleOAuthService } from '@/lib/google-oauth';
import { adults2025 } from '@/data/2025Adults';
import { kidsTeens2025 } from '@/data/2025KidsTeens';
import { coreAdults } from '@/data/CoreAdults';
import { coreTeensKids } from '@/data/CoreTeensKids';

interface Member {
  id: string;
  name: string;
}

interface AttendanceRecord {
  memberName: string;
  status: string;
}

export default function AttendanceTracker() {
  const [selectedSection, setSelectedSection] = useState('2025 Adults');
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [oauthReady, setOauthReady] = useState(false);
  const { user } = useAuth();

  const sections = {
    '2025 Adults': adults2025.map((name, index) => ({ id: `2025adults-${index + 1}`, name })),
    '2025 Kids Teens': kidsTeens2025.map((name, index) => ({ id: `2025kidsteens-${index + 1}`, name })),
    'Core Adults': coreAdults.map((name, index) => ({ id: `coreadults-${index + 1}`, name })),
    'Core Teens Kids': coreTeensKids.map((name, index) => ({ id: `coreteenskids-${index + 1}`, name })),
  };

  useEffect(() => {
    GoogleOAuthService.initialize().then(() => {
      setOauthReady(true);
    });
  }, []);

  useEffect(() => {
    if (oauthReady) {
      loadTodayAttendance();
    }
  }, [selectedSection, oauthReady]);

  // Reload data when tab becomes visible/focused
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && oauthReady) {
        loadTodayAttendance();
      }
    };

    const handleFocus = () => {
      if (oauthReady) {
        loadTodayAttendance();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [oauthReady]);

  const loadTodayAttendance = async () => {
    try {
      setLoading(true);
      const accessToken = await GoogleOAuthService.getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }
      
      const records = await GoogleSheetsService.getTodayAttendance(selectedSection, accessToken);
      const statusMap: Record<string, string> = {};
      records.forEach((record: AttendanceRecord) => {
        statusMap[record.memberName] = record.status;
      });
      setAttendanceStatus(statusMap);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (member: Member) => {
    if (!user) return;

    try {
      const accessToken = await GoogleOAuthService.getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        return;
      }

      const currentStatus = attendanceStatus[member.name];
      const newStatus = currentStatus === 'present' ? 'absent' : 'present';
      
      await GoogleSheetsService.appendAttendanceRecord({
        date: new Date().toISOString().split('T')[0],
        section: selectedSection,
        memberName: member.name,
        status: newStatus,
        recordedBy: user.email || 'Unknown'
      }, accessToken);

      setAttendanceStatus(prev => ({
        ...prev,
        [member.name]: newStatus
      }));
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const getFilteredMembers = () => {
    return sections[selectedSection as keyof typeof sections] || [];
  };

  const getStatusCounts = () => {
    const sectionMembers = getFilteredMembers();
    const present = sectionMembers.filter(member => 
      attendanceStatus[member.name] === 'present'
    ).length;
    const absent = sectionMembers.length - present;
    return { present, absent };
  };

  const resetAttendance = () => {
    setAttendanceStatus({});
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
      <div className="bg-white rounded-lg shadow-md p-3 mb-2">
        {/* Section Tabs */}
        <div className="grid grid-cols-4 gap-2">
          {Object.keys(sections).map((section) => (
            <button
              key={section}
              onClick={() => setSelectedSection(section)}
              className={`px-2 py-2 rounded-lg transition-colors text-xs leading-tight text-center ${
                selectedSection === section
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      </div>

      {/* Counts and Reset Button */}
      <div className="bg-white rounded-lg shadow-md p-2 mb-2">
        <div className="flex justify-end items-center">
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <span className="text-green-600 font-semibold">Present: {counts.present}</span>
              <span className="text-red-600 font-semibold">Absent: {counts.absent}</span>
            </div>
            <button
              onClick={resetAttendance}
              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg transition-colors text-sm"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Absent Members */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold text-red-600 mb-2 text-center">Absent</h2>
          <div className="space-y-2">
            {getFilteredMembers()
              .filter(member => attendanceStatus[member.name] !== 'present')
              .map((member) => (
                <button
                  key={member.id}
                  onClick={() => toggleAttendance(member)}
                  className="w-full flex justify-between items-center p-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm"
                >
                  <span className="text-red-800">{member.name}</span>
                  <span className="text-red-600">❌</span>
                </button>
              ))}
          </div>
        </div>

        {/* Present Members */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-bold text-green-600 mb-2 text-center">Present</h2>
          <div className="space-y-2">
            {getFilteredMembers()
              .filter(member => attendanceStatus[member.name] === 'present')
              .map((member) => (
                <button
                  key={member.id}
                  onClick={() => toggleAttendance(member)}
                  className="w-full flex justify-between items-center p-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm"
                >
                  <span className="text-green-800 font-semibold">{member.name}</span>
                  <span className="text-green-600">✅</span>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}