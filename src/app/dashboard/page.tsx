'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ReportSummary, MonthlyReport, ComparisonPeriod } from '@/types';
import KPICard from '@/components/KPICard';
import PerformanceChart from '@/components/PerformanceChart';
import QueryTable from '@/components/QueryTable';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const { user, clientProfile } = useAuth();
  const router = useRouter();
  const [reportSummary, setReportSummary] = useState<ReportSummary | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [comparison, setComparison] = useState<ComparisonPeriod>('MoM');

  useEffect(() => {
    if (clientProfile) {
      loadLatestReport();
    }
  }, [clientProfile]);

  const loadLatestReport = async () => {
    if (!clientProfile) return;

    try {
      setLoading(true);

      // Get latest summary
      const summaryQuery = query(
        collection(db, 'reports_summary'),
        where('client_id', '==', clientProfile.clientId),
        orderBy('report_date', 'desc'),
        limit(1)
      );

      const summarySnapshot = await getDocs(summaryQuery);
      if (!summarySnapshot.empty) {
        const summaryData = summarySnapshot.docs[0].data() as ReportSummary;
        summaryData.id = summarySnapshot.docs[0].id;
        setReportSummary(summaryData);

        // Get detailed monthly data
        const monthlyQuery = query(
          collection(db, 'reports_monthly'),
          where('client_id', '==', clientProfile.clientId),
          where('report_id', '==', summaryData.report_id),
          limit(1)
        );

        const monthlySnapshot = await getDocs(monthlyQuery);
        if (!monthlySnapshot.empty) {
          const monthlyData = monthlySnapshot.docs[0].data() as MonthlyReport;
          monthlyData.id = monthlySnapshot.docs[0].id;
          setMonthlyReport(monthlyData);
        }
      }
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-fatcow-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your latest report...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!reportSummary || !monthlyReport) {
    return (
      <ProtectedRoute>
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Reports Available</h2>
          <p className="text-gray-600">
            Your reports will appear here once they're generated.
          </p>
        </div>
      </ProtectedRoute>
    );
  }

  const getChangeValue = (field: 'clicks' | 'impressions' | 'ctr') => {
    if (comparison === 'MoM') {
      return reportSummary[`mom_${field}_change`] || 0;
    }
    return reportSummary[`yoy_${field}_change`] || 0;
  };

  const kpis = [
    {
      title: 'Total Clicks',
      value: reportSummary.total_clicks,
      change: getChangeValue('clicks'),
      changeLabel: comparison,
      icon: '🖱️',
      format: 'number' as const,
    },
    {
      title: 'Total Impressions',
      value: reportSummary.total_impressions,
      change: getChangeValue('impressions'),
      changeLabel: comparison,
      icon: '👁️',
      format: 'number' as const,
    },
    {
      title: 'Average CTR',
      value: reportSummary.average_ctr * 100,
      change: getChangeValue('ctr'),
      changeLabel: comparison,
      icon: '📈',
      format: 'percentage' as const,
    },
    {
      title: 'Average Position',
      value: reportSummary.average_position,
      icon: '🎯',
      format: 'decimal' as const,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-fatcow-navy">
              {new Date(reportSummary.year, reportSummary.month - 1).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })} Report
            </h1>
            <p className="text-gray-600 mt-1">
              Performance overview for {clientProfile.companyName}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
              <button
                onClick={() => setComparison('MoM')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  comparison === 'MoM'
                    ? 'bg-fatcow-green text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Month-over-Month
              </button>
              <button
                onClick={() => setComparison('YoY')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  comparison === 'YoY'
                    ? 'bg-fatcow-green text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Year-over-Year
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <KPICard key={index} kpi={kpi} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart
            data={monthlyReport.daily_data}
            metric="clicks"
            title="Daily Clicks"
          />
          <PerformanceChart
            data={monthlyReport.daily_data}
            metric="impressions"
            title="Daily Impressions"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart
            data={monthlyReport.daily_data}
            metric="ctr"
            title="Click-Through Rate"
          />
          <PerformanceChart
            data={monthlyReport.daily_data}
            metric="position"
            title="Average Position"
          />
        </div>

        {/* Query Table */}
        {monthlyReport.top_queries && monthlyReport.top_queries.length > 0 && (
          <QueryTable queries={monthlyReport.top_queries} title="Top Search Queries" />
        )}
      </div>
    </ProtectedRoute>
  );
}
