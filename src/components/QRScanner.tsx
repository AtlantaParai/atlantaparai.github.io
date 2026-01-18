'use client';

import { useState, useRef, useEffect } from 'react';
import { GoogleSheetsService } from '@/lib/google-sheets-service';
import { GoogleOAuthService } from '@/lib/google-oauth';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window {
    ZXing: any;
  }
}

export default function QRScanner() {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ZXing) {
      codeReader.current = new window.ZXing.BrowserQRCodeReader();
    }
  }, []);

  const startScanner = async () => {
    console.log('Start scanner clicked');
    setShowScanner(true);
    setScanResult('Initializing camera...');
    setHasScanned(false);
    
    // Wait for modal to render
    setTimeout(async () => {
      console.log('VideoRef after timeout:', !!videoRef.current);
      
      if (!videoRef.current) {
        setScanResult('❌ Video element not ready');
        return;
      }
      
      try {
        await codeReader.current.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result: any, error: any) => {
            if (result && !hasScanned) {
              setHasScanned(true);
              console.log('QR Code scanned:', result.text);
              handleScanResult(result.text);
            }
          }
        );
        
        setScanResult('Camera ready - point at QR code');
      } catch (error) {
        console.error('Camera error:', error);
        setScanResult('❌ Camera access denied');
        setTimeout(() => setShowScanner(false), 3000);
      }
    }, 100);
  };

  const stopScanner = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
    setShowScanner(false);
    setScanResult('');
    setHasScanned(false);
  };

  const handleScanResult = async (data: string) => {
    try {
      const memberData = JSON.parse(data);
      if (!memberData.name || !memberData.batch) {
        setScanResult('❌ Invalid member QR code');
        return;
      }
      
      setScanResult(`Scanned: ${memberData.name} (${memberData.batch})`);
      await markAttendance(memberData.name, memberData.batch);
      
      // Reset hasScanned after 2 seconds to allow next scan
      setTimeout(() => {
        setHasScanned(false);
        setScanResult('Camera ready - point at next QR code');
      }, 2000);
    } catch (error) {
      setScanResult('❌ Invalid QR code format');
    }
  };

  const markAttendance = async (memberName: string, batch: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const accessToken = await GoogleOAuthService.getAccessToken();
      if (!accessToken) {
        console.error('No access token available');
        setScanResult('❌ Authentication required');
        return;
      }

      await GoogleSheetsService.appendAttendanceRecord({
        date: new Date().toISOString().split('T')[0],
        section: batch,
        memberName: memberName,
        status: 'present',
        recordedBy: `QR Scan by ${user.email || 'Unknown'}`
      }, accessToken);

      setScanResult(`✅ ${memberName} marked present!`);
    } catch (error) {
      console.error('Error marking attendance:', error);
      setScanResult('❌ Error marking attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          console.log('QR Scanner button clicked');
          startScanner();
        }}
        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors text-sm"
      >
        📷 Scan QR
      </button>

      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Scan Member QR Code</h3>
              <button
                onClick={stopScanner}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                style={{ maxHeight: '300px' }}
              />
              {loading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            
            {scanResult && (
              <div className={`mt-4 p-3 rounded-lg ${
                scanResult.includes('❌') 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <p className={`text-center font-medium ${
                  scanResult.includes('❌') ? 'text-red-800' : 'text-green-800'
                }`}>{scanResult}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}