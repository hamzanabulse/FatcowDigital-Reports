// Client Profile
export interface ClientProfile {
  clientId: string;
  email: string;
  companyName: string;
  contactName: string;
  createdAt: Date;
  lastReportDate?: string;
  gsc_property_url?: string; // Google Search Console property URL
  gsc_refresh_token?: string; // OAuth refresh token for GSC API
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

// AI Insights
export interface AIInsight {
  type: 'success' | 'warning' | 'critical' | 'info';
  metric: string;
  message: string;
}

export interface AIRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  action: string;
  expected_impact: string;
}

export interface MetricTrend {
  trend?: string;
  percentage?: number;
  current?: number;
  status: 'good' | 'bad' | 'neutral' | 'needs_improvement';
}

export interface AIInsightsData {
  overall_analysis: string;
  key_insights: AIInsight[];
  recommendations: AIRecommendation[];
  predictions: {
    next_month_clicks: number;
    next_month_impressions: number;
    expected_ctr: number;
    confidence: string;
  };
  priority_actions: string[];
  metric_trends: {
    clicks: MetricTrend;
    impressions: MetricTrend;
    ctr: MetricTrend;
    position: MetricTrend;
  };
}
