'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '@/contexts/AuthContext';
import { adults2025 } from '@/data/2025Adults';
import { kidsTeens2025 } from '@/data/2025KidsTeens';
import { coreAdults } from '@/data/CoreAdults';
import { coreTeensKids } from '@/data/CoreTeensKids';

export default function MemberInfo() {
  const [qrCode, setQrCode] = useState<string>('');
  const { user } = useAuth();

  const allMembers = [
    ...adults2025.map(name => ({ name, batch: '2025 Adults' })),
    ...kidsTeens2025.map(name => ({ name, batch: '2025 Kids Teens' })),
    ...coreAdults.map(name => ({ name, batch: 'Core Adults' })),
    ...coreTeensKids.map(name => ({ name, batch: 'Core Teens Kids' }))
  ];

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
    <div className="max-w-md mx-auto p-4">
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