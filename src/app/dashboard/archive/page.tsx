'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ReportSummary } from '@/types';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ArchivePage() {
  const { clientProfile } = useAuth();
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    if (clientProfile) {
      loadReports();
    }
  }, [clientProfile, selectedYear]);

  const loadReports = async () => {
    if (!clientProfile) return;

    try {
      setLoading(true);

      const reportsQuery = query(
        collection(db, 'reports_summary'),
        where('client_id', '==', clientProfile.clientId),
        where('year', '==', selectedYear),
        orderBy('report_date', 'desc')
      );

      const snapshot = await getDocs(reportsQuery);
      const reportsData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      } as ReportSummary));

      setReports(reportsData);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 5; year--) {
      years.push(year);
    }
    return years;
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-fatcow-navy">Report Archive</h1>
            <p className="text-gray-600 mt-1">Browse historical reports</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fatcow-green focus:border-transparent outline-none"
            >
              {getAvailableYears().map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-fatcow-green mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading reports...</p>
            </div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <span className="text-3xl">📁</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Reports Found</h2>
            <p className="text-gray-600">
              No reports available for {selectedYear}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/dashboard/report/${report.report_id}`}
                className="card hover:shadow-xl transition-shadow duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-fatcow-navy">
                    {new Date(report.year, report.month - 1).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </h3>
                  <span className="text-2xl">📊</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Clicks</span>
                    <span className="font-semibold text-gray-900">
                      {report.total_clicks.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Impressions</span>
                    <span className="font-semibold text-gray-900">
                      {report.total_impressions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CTR</span>
                    <span className="font-semibold text-gray-900">
                      {(report.average_ctr * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-sm text-fatcow-green font-medium">
                    View Report →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
