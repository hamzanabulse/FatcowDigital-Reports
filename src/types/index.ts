// Client Profile
export interface ClientProfile {
  clientId: string;
  email: string;
  companyName: string;
  contactName: string;
  createdAt: Date;
  lastReportDate?: string;
}

// Monthly Report Summary
export interface ReportSummary {
  id: string;
  client_id: string;
  report_id: string; // e.g., "2025-10"
  report_date: Date;
  year: number;
  month: number;
  
  // KPIs
  total_clicks: number;
  total_impressions: number;
  average_ctr: number;
  average_position: number;
  
  // Comparisons
  mom_clicks_change?: number;
  mom_impressions_change?: number;
  mom_ctr_change?: number;
  yoy_clicks_change?: number;
  yoy_impressions_change?: number;
  yoy_ctr_change?: number;
}

// Monthly Detailed Data
export interface MonthlyReport {
  id: string;
  client_id: string;
  report_id: string;
  year: number;
  month: number;
  
  // Daily breakdown
  daily_data: DailyData[];
  
  // Device breakdown
  device_data: DeviceData[];
  
  // Top queries
  top_queries: QueryData[];
}

export interface DailyData {
  date: string; // ISO date string
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface DeviceData {
  device: 'desktop' | 'mobile' | 'tablet';
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface QueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// Annual Report
export interface AnnualReport {
  id: string;
  client_id: string;
  year: number;
  
  // Monthly summaries for the year
  monthly_summaries: MonthlyAnnualSummary[];
  
  // Year-over-year comparison
  yoy_comparison?: {
    clicks_change: number;
    impressions_change: number;
    ctr_change: number;
  };
  
  // Top 50 queries for the year
  top_queries_current: QueryData[];
  top_queries_previous?: QueryData[];
}

export interface MonthlyAnnualSummary {
  month: number;
  month_name: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// Comparison types
export type ComparisonPeriod = 'MoM' | 'YoY';

export interface KPICard {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon?: string;
  format?: 'number' | 'percentage' | 'decimal';
}
