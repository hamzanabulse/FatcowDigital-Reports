'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, clientProfile, signOut } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-fatcow-light">
      {/* Navigation */}
      <nav className="bg-fatcow-navy shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-fatcow-green rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">F</span>
                </div>
                <span className="ml-3 text-white text-xl font-bold">
                  fatcowdigital
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                <Link
                  href="/dashboard"
                  className="text-white hover:text-fatcow-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/archive"
                  className="text-gray-300 hover:text-fatcow-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Archive
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              {/* User Info & Sign Out */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {clientProfile?.companyName || user?.email}
                  </p>
                  {clientProfile?.contactName && (
                    <p className="text-xs text-gray-400">{clientProfile.contactName}</p>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium bg-fatcow-blue hover:bg-blue-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white hover:text-fatcow-green p-2"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-fatcow-blue">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/archive"
                className="text-gray-300 block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700"
              >
                Archive
              </Link>
              <div className="border-t border-gray-700 mt-2 pt-2">
                <p className="text-white px-3 py-2 text-sm font-medium">
                  {clientProfile?.companyName || user?.email}
                </p>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-gray-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            © 2025 fatcowdigital. All rights reserved. | Secure Reports Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
