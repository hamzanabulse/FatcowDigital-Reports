'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user, clientProfile } = useAuth();
  const [gscConnected, setGscConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Simulate GSC connect (replace with real OAuth flow)
  const handleConnectGSC = async () => {
    setLoading(true);
    setTimeout(() => {
      setGscConnected(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-fatcow-navy mb-6">Settings</h1>
      <div className="bg-white rounded-xl shadow-fatcow p-6 animate-fade-in-up">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <span className="text-2xl">🔗</span>
          Connect Google Search Console
        </h2>
        <p className="text-gray-600 mb-4">Link your Google account to enable automatic SEO reporting and AI insights.</p>
        <button
          onClick={handleConnectGSC}
          disabled={gscConnected || loading}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-fatcow-blue/50
            ${gscConnected ? 'bg-green-500 cursor-not-allowed' : 'bg-fatcow-blue hover:bg-fatcow-purple'}
            ${loading ? 'animate-pulse' : ''}
          `}
        >
          {gscConnected ? 'Connected!' : loading ? 'Connecting...' : 'Connect Google Account'}
        </button>
        {gscConnected && (
          <div className="mt-4 text-green-600 font-semibold animate-bounce-slow">✔ Your account is connected!</div>
        )}
      </div>
    </div>
  );
}
