import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * Simple health check function
 * Can be used to verify Cloud Functions are working
 */
export const healthCheck = functions.https.onRequest(async (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'fatcowdigital Reports API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Fetch GSC Data for all clients
 * Scheduled to run daily at 2 AM EST
 */
export const fetchGSCData = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    console.log('Starting GSC data fetch for all clients...');

    try {
      const clientsSnapshot = await db
        .collection('clients')
        .where('gsc_property_url', '!=', null)
        .get();

      let successCount = 0;
      let errorCount = 0;

      for (const clientDoc of clientsSnapshot.docs) {
        const client = clientDoc.data();
        try {
          await fetchClientGSCData(client.clientId, client);
          successCount++;
        } catch (error) {
          console.error(`Error fetching GSC data for ${client.clientId}:`, error);
          errorCount++;
        }
      }

      console.log(`GSC data fetch completed. Success: ${successCount}, Errors: ${errorCount}`);
      return null;
    } catch (error) {
      console.error('Error in fetchGSCData:', error);
      throw error;
    }
  });

/**
 * Fetch GSC data for a specific client (manual trigger)
 */
export const manualFetchGSCData = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const clientDoc = await db.collection('clients').doc(context.auth.uid).get();
    
    if (!clientDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Client not found');
    }

    const client = clientDoc.data();
    await fetchClientGSCData(client!.clientId, client);

    return { success: true, message: 'GSC data refreshed successfully' };
  } catch (error: any) {
    console.error('Error in manualFetchGSCData:', error);
    throw new functions.https.HttpsError('internal', error.message || 'Failed to fetch GSC data');
  }
});

/**
 * Generate AI insights for a client's report
 */
export const generateAIInsights = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { reportId } = data;

  if (!reportId) {
    throw new functions.https.HttpsError('invalid-argument', 'reportId is required');
  }

  try {
    const clientDoc = await db.collection('clients').doc(context.auth.uid).get();
    
    if (!clientDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Client not found');
    }

    const client = clientDoc.data();
    const clientId = client!.clientId;

    // Get report data
    const reportSnapshot = await db
      .collection('reports_summary')
      .where('client_id', '==', clientId)
      .where('report_id', '==', reportId)
      .limit(1)
      .get();

    if (reportSnapshot.empty) {
      throw new functions.https.HttpsError('not-found', 'Report not found');
    }

    const reportData = reportSnapshot.docs[0].data();

    // Get detailed monthly data
    const monthlySnapshot = await db
      .collection('reports_monthly')
      .where('client_id', '==', clientId)
      .where('report_id', '==', reportId)
      .limit(1)
      .get();

    const monthlyData = monthlySnapshot.empty ? null : monthlySnapshot.docs[0].data();

    // Generate insights using AI analysis
    const insights = await analyzeMetricsWithAI(reportData, monthlyData);

    // Store the insights
    await db.collection('ai_insights').add({
      client_id: clientId,
      report_id: reportId,
      generated_at: admin.firestore.Timestamp.now(),
      insights: insights,
      version: '1.0',
    });

    return { success: true, insights };
  } catch (error: any) {
    console.error('Error generating AI insights:', error);
    throw new functions.https.HttpsError('internal', error.message || 'Failed to generate AI insights');
  }
});

/**
 * Get AI insights for a specific report
 */
export const getAIInsights = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { reportId } = data;

  if (!reportId) {
    throw new functions.https.HttpsError('invalid-argument', 'reportId is required');
  }

  try {
    const clientDoc = await db.collection('clients').doc(context.auth.uid).get();
    
    if (!clientDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Client not found');
    }

    const client = clientDoc.data();
    const clientId = client!.clientId;

    const insightsSnapshot = await db
      .collection('ai_insights')
      .where('client_id', '==', clientId)
      .where('report_id', '==', reportId)
      .orderBy('generated_at', 'desc')
      .limit(1)
      .get();

    if (insightsSnapshot.empty) {
      return { insights: null, message: 'No AI insights available. Click "Generate Insights" to create them.' };
    }

    const insightsData = insightsSnapshot.docs[0].data();

    return {
      insights: insightsData.insights,
      generated_at: insightsData.generated_at,
    };
  } catch (error: any) {
    console.error('Error getting AI insights:', error);
    throw new functions.https.HttpsError('internal', error.message || 'Failed to fetch AI insights');
  }
});

/**
 * Helper: Fetch GSC data for a specific client
 */
async function fetchClientGSCData(clientId: string, client: any) {
  // TODO: Implement actual GSC API integration
  // For now, this is a placeholder that generates sample data
  
  const gscPropertyUrl = client.gsc_property_url;
  
  if (!gscPropertyUrl) {
    throw new Error('GSC property URL not configured for client');
  }

  console.log(`Fetching GSC data for ${clientId} from ${gscPropertyUrl}`);

  // Generate sample data (replace with actual GSC API call)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  const currentMonth = endDate.getMonth() + 1;
  const currentYear = endDate.getFullYear();
  const reportId = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  // Generate daily data
  const dailyData = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const baseClicks = Math.floor(Math.random() * 100) + 50;
    const baseImpressions = baseClicks * (Math.floor(Math.random() * 10) + 15);
    
    dailyData.push({
      date: date.toISOString().split('T')[0],
      clicks: baseClicks,
      impressions: baseImpressions,
      ctr: baseClicks / baseImpressions,
      position: Math.random() * 10 + 5,
    });
  }

  const totalClicks = dailyData.reduce((sum, day) => sum + day.clicks, 0);
  const totalImpressions = dailyData.reduce((sum, day) => sum + day.impressions, 0);
  const avgCTR = totalClicks / totalImpressions;
  const avgPosition = dailyData.reduce((sum, day) => sum + day.position, 0) / dailyData.length;

  // Get previous period data
  const previousData = await getPreviousPeriodData(clientId, reportId);

  // Store summary
  await db.collection('reports_summary').add({
    client_id: clientId,
    report_id: reportId,
    year: currentYear,
    month: currentMonth,
    total_clicks: totalClicks,
    total_impressions: totalImpressions,
    average_ctr: avgCTR,
    average_position: avgPosition,
    report_date: admin.firestore.Timestamp.fromDate(endDate),
    mom_clicks_change: previousData.mom_change,
    yoy_clicks_change: previousData.yoy_change,
    data_source: 'gsc_api',
    last_updated: admin.firestore.Timestamp.now(),
  });

  // Store detailed data
  await db.collection('reports_monthly').add({
    client_id: clientId,
    report_id: reportId,
    year: currentYear,
    month: currentMonth,
    daily_data: dailyData,
    device_data: [
      { device: 'desktop', clicks: Math.floor(totalClicks * 0.6), impressions: Math.floor(totalImpressions * 0.6) },
      { device: 'mobile', clicks: Math.floor(totalClicks * 0.35), impressions: Math.floor(totalImpressions * 0.35) },
      { device: 'tablet', clicks: Math.floor(totalClicks * 0.05), impressions: Math.floor(totalImpressions * 0.05) },
    ],
    top_queries: [],
    last_updated: admin.firestore.Timestamp.now(),
  });

  console.log(`Stored GSC data for ${clientId}`);
}

/**
 * Helper: Get previous period comparison data
 */
async function getPreviousPeriodData(clientId: string, currentReportId: string) {
  const [year, month] = currentReportId.split('-').map(Number);
  
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevMonthYear = month === 1 ? year - 1 : year;
  const prevMonthId = `${prevMonthYear}-${String(prevMonth).padStart(2, '0')}`;
  const prevYearId = `${year - 1}-${String(month).padStart(2, '0')}`;

  let mom_change = null;
  let yoy_change = null;

  try {
    const momSnap = await db
      .collection('reports_summary')
      .where('client_id', '==', clientId)
      .where('report_id', '==', prevMonthId)
      .limit(1)
      .get();

    if (!momSnap.empty) {
      // prevData would be used for actual comparison calculation
      // const prevData = momSnap.docs[0].data();
      mom_change = Math.random() * 20 - 10; // Sample data - replace with actual calculation
    }

    const yoySnap = await db
      .collection('reports_summary')
      .where('client_id', '==', clientId)
      .where('report_id', '==', prevYearId)
      .limit(1)
      .get();

    if (!yoySnap.empty) {
      // prevYearData would be used for actual YoY comparison
      yoy_change = Math.random() * 30 - 15; // Sample data - replace with actual calculation
    }
  } catch (error) {
    console.error('Error getting previous period data:', error);
  }

  return { mom_change, yoy_change };
}

/**
 * Helper: Analyze metrics with AI
 */
async function analyzeMetricsWithAI(reportData: any, monthlyData: any) {
  // Rule-based analysis (replace with actual AI API call)
  const analysis: any = {
    overall_analysis: '',
    key_insights: [],
    recommendations: [],
    predictions: {},
    priority_actions: [],
    metric_trends: {},
  };

  // Overall analysis
  const clickChange = reportData.mom_clicks_change || 0;
  if (clickChange > 5) {
    analysis.overall_analysis = `Strong performance this period with ${clickChange.toFixed(1)}% increase in clicks. Your SEO efforts are paying off.`;
  } else if (clickChange < -5) {
    analysis.overall_analysis = `Declining performance with ${Math.abs(clickChange).toFixed(1)}% decrease in clicks. Immediate action needed to reverse this trend.`;
  } else {
    analysis.overall_analysis = `Stable performance with minimal change (${clickChange.toFixed(1)}%). Focus on optimization opportunities to drive growth.`;
  }

  // Key insights
  if (reportData.average_ctr < 0.02) {
    analysis.key_insights.push({
      type: 'warning',
      metric: 'CTR',
      message: 'Your CTR is below industry average. Improve meta descriptions and titles to increase click-through rates.',
    });
  }

  if (reportData.average_position > 10) {
    analysis.key_insights.push({
      type: 'critical',
      metric: 'Position',
      message: 'Average position is beyond page 1. Focus on improving content quality and building backlinks.',
    });
  }

  if (clickChange > 10) {
    analysis.key_insights.push({
      type: 'success',
      metric: 'Clicks',
      message: 'Exceptional growth in organic clicks. Your recent SEO changes are working well.',
    });
  }

  // Recommendations
  analysis.recommendations = [
    {
      priority: 'high',
      category: 'Content',
      action: 'Optimize meta titles and descriptions for top-performing queries',
      expected_impact: 'Increase CTR by 15-25%',
    },
    {
      priority: 'high',
      category: 'Technical SEO',
      action: 'Improve page load speed to under 2 seconds',
      expected_impact: 'Better rankings and user experience',
    },
    {
      priority: 'medium',
      category: 'Content',
      action: 'Create comprehensive content for high-impression, low-click queries',
      expected_impact: 'Capture more traffic from existing visibility',
    },
    {
      priority: 'medium',
      category: 'Link Building',
      action: 'Build 5-10 quality backlinks from relevant industry sites',
      expected_impact: 'Improve domain authority and rankings',
    },
    {
      priority: 'low',
      category: 'User Experience',
      action: 'Add schema markup to enhance SERP appearance',
      expected_impact: 'Increase CTR by 5-10%',
    },
  ];

  // Predictions
  analysis.predictions = {
    next_month_clicks: Math.round(reportData.total_clicks * 1.15),
    next_month_impressions: Math.round(reportData.total_impressions * 1.08),
    expected_ctr: reportData.average_ctr * 1.05,
    confidence: 'medium',
  };

  // Priority actions
  analysis.priority_actions = [
    'Review and optimize meta titles for top 20 pages',
    'Improve page speed scores to 90+ on Google PageSpeed Insights',
    'Create new content targeting high-potential keywords',
  ];

  // Metric trends
  analysis.metric_trends = {
    clicks: {
      trend: clickChange > 0 ? 'increasing' : 'decreasing',
      percentage: clickChange,
      status: clickChange > 5 ? 'good' : clickChange < -5 ? 'bad' : 'neutral',
    },
    impressions: {
      trend: 'increasing',
      percentage: 8.5,
      status: 'good',
    },
    ctr: {
      current: reportData.average_ctr,
      status: reportData.average_ctr > 0.03 ? 'good' : 'needs_improvement',
    },
    position: {
      current: reportData.average_position,
      status: reportData.average_position < 10 ? 'good' : 'needs_improvement',
    },
  };

  return analysis;
}
