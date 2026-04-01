'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleOAuthService } from '@/lib/google-oauth';
import { MembersSheetsService } from '@/lib/members-sheets-service';

export default function MemberInfo() {
  const [qrCode, setQrCode] = useState<string>('');
  const [allMembers, setAllMembers] = useState<{name: string; batch: string}[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const accessToken = await GoogleOAuthService.getAccessToken();
      if (!accessToken) return;

      const sheets = [
        { id: process.env.NEXT_PUBLIC_FINANCE_CORE_ADULTS_SHEET_ID || '', tab: 'Adult Core Team', batch: 'Core Adults' },
        { id: process.env.NEXT_PUBLIC_FINANCE_CORE_TEENS_KIDS_SHEET_ID || '', tab: 'APT Core Teens', batch: 'Core Teens Kids' },
      ];

      const members: {name: string; batch: string}[] = [];
      for (const { id, tab, batch } of sheets) {
        if (!id) continue;
        const names = await MembersSheetsService.getMemberNamesFromSheet(id, accessToken, tab);
        members.push(...names.map(name => ({ name, batch })));
      }
      setAllMembers(members);
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  };

  useEffect(() => {
    if (user?.name) {
      const member = allMembers.find(m => m.name.toLowerCase() === user.name.toLowerCase());
      if (member) {
        generateQRCode(member);
      }
    }
  }, [user]);

  const generateQRCode = async (member: { name: string; batch: string }) => {
    const qrData = JSON.stringify({
      name: member.name,
      batch: member.batch
    });
    
    try {
      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCode(qrCodeUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const member = allMembers.find(m => m.name.toLowerCase() === user?.name?.toLowerCase());

  if (!member) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-600">Member not found in the system.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 pt-8" style={{ minHeight: '50vh' }}>
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h2>
        <p className="text-gray-600 mb-2">{member.batch}</p>
        <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
        
        {qrCode ? (
          <div className="flex justify-center">
            <img
              src={qrCode}
              alt={`QR Code for ${member.name}`}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}