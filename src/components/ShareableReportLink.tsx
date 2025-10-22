'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function ShareableReportLink() {
  const { user, clientProfile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!user || !clientProfile) return null;

  // Generate unique, permanent URL for this client
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareableUrl = `${baseUrl}/report/${clientProfile.clientId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareableUrl)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-fatcow-blue to-fatcow-purple rounded-xl shadow-fatcow-lg p-6 text-white animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
            <span>🔗</span>
            Your Permanent Report Link
          </h3>
          <p className="text-sm text-white/80">
            Share this link with your team or bookmark it for quick access
          </p>
        </div>
        <button
          onClick={() => setShowQR(!showQR)}
          className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
          title="Show QR Code"
        >
          <span className="text-2xl">📱</span>
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/10 rounded-lg px-4 py-3 font-mono text-sm break-all">
            {shareableUrl}
          </div>
          <button
            onClick={copyToClipboard}
            className="flex-shrink-0 bg-white text-fatcow-blue px-4 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            {copied ? (
              <span className="flex items-center gap-2">
                <span>✓</span>
                Copied!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>📋</span>
                Copy
              </span>
            )}
          </button>
        </div>
      </div>

      {showQR && (
        <div className="bg-white rounded-lg p-4 text-center animate-scale-in">
          <p className="text-fatcow-navy font-semibold mb-3">
            Scan QR Code to open report on mobile
          </p>
          <div className="inline-block p-4 bg-white rounded-lg shadow-lg">
            <img 
              src={qrCodeUrl} 
              alt="QR Code for Report" 
              className="w-48 h-48"
            />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Scan with your phone's camera
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-white/70">
        <div className="flex items-center gap-1">
          <span>🔒</span>
          <span>Secure & Private</span>
        </div>
        <div className="flex items-center gap-1">
          <span>♾️</span>
          <span>Permanent Link</span>
        </div>
        <div className="flex items-center gap-1">
          <span>📊</span>
          <span>Always Updated</span>
        </div>
      </div>
    </div>
  );
}
