'use client';

import { useEffect, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface AIInsightsProps {
  reportId: string;
}

interface Insight {
  type: 'success' | 'warning' | 'critical' | 'info';
  metric: string;
  message: string;
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  action: string;
  expected_impact: string;
}

interface MetricTrend {
  trend?: string;
  percentage?: number;
  current?: number;
  status: string;
}

interface AIInsightsData {
  overall_analysis: string;
  key_insights: Insight[];
  recommendations: Recommendation[];
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

export default function AIInsights({ reportId }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, [reportId]);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      const functions = getFunctions();
      const getInsights = httpsCallable(functions, 'getAIInsights');
      const result: any = await getInsights({ reportId });

      if (result.data.insights) {
        setInsights(result.data.insights);
      } else {
        setInsights(null);
      }
    } catch (err: any) {
      console.error('Error loading AI insights:', err);
      setError(err.message || 'Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    setGenerating(true);
    setError(null);

    try {
      const functions = getFunctions();
      const generate = httpsCallable(functions, 'generateAIInsights');
      const result: any = await generate({ reportId });

      if (result.data.insights) {
        setInsights(result.data.insights);
      }
    } catch (err: any) {
      console.error('Error generating AI insights:', err);
      setError(err.message || 'Failed to generate AI insights');
    } finally {
      setGenerating(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'critical':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTrendIcon = (status: string) => {
    switch (status) {
      case 'good':
        return '📈';
      case 'bad':
        return '📉';
      default:
        return '➡️';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold text-fatcow-navy mb-2">
            AI-Powered Insights
          </h3>
          <p className="text-gray-600 mb-4">
            Get intelligent recommendations to optimize your SEO performance
          </p>
          <button
            onClick={generateInsights}
            disabled={generating}
            className="bg-fatcow-green text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {generating ? 'Generating Insights...' : 'Generate AI Insights'}
          </button>
          {error && (
            <p className="text-red-600 mt-4 text-sm">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">🤖</span>
              <h3 className="text-2xl font-bold text-fatcow-navy">
                AI-Powered Insights
              </h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {insights.overall_analysis}
            </p>
          </div>
          <button
            onClick={generateInsights}
            disabled={generating}
            className="ml-4 bg-fatcow-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400"
          >
            {generating ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Metric Trends */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-bold text-fatcow-navy mb-4">
          📊 Metric Trends Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(insights.metric_trends).map(([metric, data]) => (
            <div
              key={metric}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 uppercase">
                  {metric}
                </span>
                <span className="text-2xl">{getTrendIcon(data.status)}</span>
              </div>
              {data.percentage !== undefined && (
                <div className={`text-2xl font-bold ${
                  data.percentage > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.percentage > 0 ? '+' : ''}{data.percentage.toFixed(1)}%
                </div>
              )}
              {data.current !== undefined && (
                <div className="text-lg font-semibold text-gray-700">
                  {metric === 'ctr' ? (data.current * 100).toFixed(2) + '%' : data.current.toFixed(1)}
                </div>
              )}
              <div className={`text-xs mt-1 font-medium ${
                data.status === 'good' ? 'text-green-600' : 
                data.status === 'bad' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {data.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      {insights.key_insights && insights.key_insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-bold text-fatcow-navy mb-4">
            💡 Key Insights
          </h4>
          <div className="space-y-3">
            {insights.key_insights.map((insight, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded ${
                  insight.type === 'success' ? 'border-green-500 bg-green-50' :
                  insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  insight.type === 'critical' ? 'border-red-500 bg-red-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getInsightIcon(insight.type)}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">
                      {insight.metric}
                    </div>
                    <p className="text-gray-700">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Priority Actions */}
      {insights.priority_actions && insights.priority_actions.length > 0 && (
        <div className="bg-gradient-to-r from-fatcow-green to-green-600 rounded-lg shadow-md p-6 text-white">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>⚡</span>
            Priority Actions (Do These First!)
          </h4>
          <ol className="space-y-3">
            {insights.priority_actions.map((action, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="font-bold text-xl">{index + 1}.</span>
                <span className="flex-1 pt-0.5">{action}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-bold text-fatcow-navy mb-4">
            🎯 Optimization Recommendations
          </h4>
          <div className="space-y-4">
            {insights.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getPriorityColor(rec.priority)}`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        rec.priority === 'high' ? 'bg-red-200' :
                        rec.priority === 'medium' ? 'bg-yellow-200' :
                        'bg-blue-200'
                      }`}>
                        {rec.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="text-sm font-medium text-gray-600">
                        {rec.category}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {rec.action}
                    </p>
                  </div>
                </div>
                <div className="text-sm mt-2 flex items-center gap-2">
                  <span className="font-medium">Expected Impact:</span>
                  <span className="text-gray-700">{rec.expected_impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predictions */}
      {insights.predictions && (
        <div className="bg-gradient-to-r from-fatcow-blue to-blue-700 rounded-lg shadow-md p-6 text-white">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🔮</span>
            Next Month Predictions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm opacity-90 mb-1">Expected Clicks</div>
              <div className="text-3xl font-bold">
                {insights.predictions.next_month_clicks.toLocaleString()}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm opacity-90 mb-1">Expected Impressions</div>
              <div className="text-3xl font-bold">
                {insights.predictions.next_month_impressions.toLocaleString()}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-sm opacity-90 mb-1">Expected CTR</div>
              <div className="text-3xl font-bold">
                {(insights.predictions.expected_ctr * 100).toFixed(2)}%
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm opacity-90">
            Confidence Level: <span className="font-semibold">{insights.predictions.confidence.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
