/**
 * Sample Script for Creating Test Client and Sample Data
 * 
 * This script demonstrates how to:
 * 1. Create a test client account
 * 2. Generate sample report data
 * 
 * Run with Firebase Admin SDK
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
// In production, use service account key
admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

/**
 * Create a test client account
 */
async function createTestClient() {
  try {
    // 1. Create Firebase Auth user
    const userRecord = await auth.createUser({
      email: 'demo@example.com',
      password: 'DemoPassword123!',
      displayName: 'Demo Client',
      emailVerified: true,
    });

    console.log('✅ Created Auth user:', userRecord.uid);

    // 2. Create client profile in Firestore
    await db.collection('clients').doc(userRecord.uid).set({
      clientId: 'demo_client_001',
      email: 'demo@example.com',
      companyName: 'Demo Company Inc.',
      contactName: 'John Demo',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastReportDate: null,
    });

    console.log('✅ Created client profile');
    console.log('\nLogin Credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: DemoPassword123!');
    console.log('UID:', userRecord.uid);

    return { uid: userRecord.uid, clientId: 'demo_client_001' };
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
}

/**
 * Generate sample daily data for a month
 */
function generateDailyData(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyData = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const baseClicks = 100 + Math.random() * 200;
    const baseImpressions = 5000 + Math.random() * 3000;

    dailyData.push({
      date: new Date(year, month - 1, day).toISOString().split('T')[0],
      clicks: Math.round(baseClicks),
      impressions: Math.round(baseImpressions),
      ctr: baseClicks / baseImpressions,
      position: 8 + Math.random() * 4,
    });
  }

  return dailyData;
}

/**
 * Generate sample query data
 */
function generateTopQueries() {
  const sampleQueries = [
    'digital marketing services',
    'seo optimization tips',
    'content marketing strategy',
    'social media management',
    'email marketing campaigns',
    'web design services',
    'brand development',
    'marketing automation',
    'conversion rate optimization',
    'analytics and reporting',
    'ppc advertising',
    'influencer marketing',
    'video marketing',
    'mobile app marketing',
    'local seo services',
    'ecommerce marketing',
    'marketing consulting',
    'growth hacking strategies',
    'customer engagement',
    'lead generation services',
  ];

  return sampleQueries.map((query, index) => {
    const clicks = Math.round(500 - index * 20 + Math.random() * 50);
    const impressions = Math.round(clicks * (30 + Math.random() * 20));
    
    return {
      query,
      clicks,
      impressions,
      ctr: clicks / impressions,
      position: 3 + index * 0.5 + Math.random() * 2,
    };
  });
}

/**
 * Create sample monthly report
 */
async function createSampleMonthlyReport(clientId, year, month) {
  try {
    const reportId = `${year}-${String(month).padStart(2, '0')}`;
    const dailyData = generateDailyData(year, month);
    const topQueries = generateTopQueries();

    // Calculate totals
    const totalClicks = dailyData.reduce((sum, day) => sum + day.clicks, 0);
    const totalImpressions = dailyData.reduce((sum, day) => sum + day.impressions, 0);
    const averageCtr = totalClicks / totalImpressions;
    const averagePosition = dailyData.reduce((sum, day) => sum + day.position, 0) / dailyData.length;

    // Create report summary
    const summaryData = {
      client_id: clientId,
      report_id: reportId,
      report_date: new Date(year, month - 1, 1),
      year,
      month,
      total_clicks: totalClicks,
      total_impressions: totalImpressions,
      average_ctr: averageCtr,
      average_position: averagePosition,
      mom_clicks_change: 5.2 + Math.random() * 10,
      mom_impressions_change: 3.8 + Math.random() * 8,
      mom_ctr_change: 1.2 + Math.random() * 3,
      yoy_clicks_change: 15.5 + Math.random() * 20,
      yoy_impressions_change: 12.3 + Math.random() * 15,
      yoy_ctr_change: 2.5 + Math.random() * 5,
    };

    await db.collection('reports_summary').add(summaryData);
    console.log(`✅ Created report summary for ${reportId}`);

    // Create detailed monthly report
    const monthlyData = {
      client_id: clientId,
      report_id: reportId,
      year,
      month,
      daily_data: dailyData,
      device_data: [
        {
          device: 'desktop',
          clicks: Math.round(totalClicks * 0.45),
          impressions: Math.round(totalImpressions * 0.4),
          ctr: averageCtr * 1.1,
          position: averagePosition - 0.5,
        },
        {
          device: 'mobile',
          clicks: Math.round(totalClicks * 0.50),
          impressions: Math.round(totalImpressions * 0.55),
          ctr: averageCtr * 0.9,
          position: averagePosition + 0.8,
        },
        {
          device: 'tablet',
          clicks: Math.round(totalClicks * 0.05),
          impressions: Math.round(totalImpressions * 0.05),
          ctr: averageCtr * 0.95,
          position: averagePosition + 0.3,
        },
      ],
      top_queries: topQueries,
    };

    await db.collection('reports_monthly').add(monthlyData);
    console.log(`✅ Created detailed monthly report for ${reportId}`);

    return summaryData;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
}

/**
 * Create sample annual report
 */
async function createSampleAnnualReport(clientId, year) {
  try {
    const monthlySummaries = [];

    for (let month = 1; month <= 12; month++) {
      const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long' });
      const baseClicks = 2000 + Math.random() * 1000;
      const baseImpressions = 100000 + Math.random() * 50000;

      monthlySummaries.push({
        month,
        month_name: monthName,
        clicks: Math.round(baseClicks),
        impressions: Math.round(baseImpressions),
        ctr: baseClicks / baseImpressions,
        position: 8 + Math.random() * 3,
      });
    }

    const annualData = {
      client_id: clientId,
      year,
      monthly_summaries: monthlySummaries,
      yoy_comparison: {
        clicks_change: 18.5,
        impressions_change: 15.2,
        ctr_change: 3.8,
      },
      top_queries_current: generateTopQueries().slice(0, 50),
      top_queries_previous: generateTopQueries().slice(0, 50),
    };

    await db.collection('reports_annual').add(annualData);
    console.log(`✅ Created annual report for ${year}`);

    return annualData;
  } catch (error) {
    console.error('Error creating annual report:', error);
    throw error;
  }
}

/**
 * Main setup function
 */
async function setupSampleData() {
  console.log('🚀 Starting sample data setup...\n');

  try {
    // Create test client
    const { uid, clientId } = await createTestClient();

    console.log('\n📊 Creating sample reports...\n');

    // Create reports for the last 6 months
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const month = now.getMonth() - i;
      const year = now.getFullYear();
      const actualMonth = month <= 0 ? 12 + month : month;
      const actualYear = month <= 0 ? year - 1 : year;

      await createSampleMonthlyReport(clientId, actualYear, actualMonth);
      
      // Small delay to avoid overwhelming Firestore
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Create annual report for last year
    await createSampleAnnualReport(clientId, now.getFullYear() - 1);

    console.log('\n✅ Sample data setup complete!');
    console.log('\n📝 Next Steps:');
    console.log('1. Deploy your application to Firebase');
    console.log('2. Navigate to the login page');
    console.log('3. Use the credentials above to log in');
    console.log('4. Explore the dashboard and features');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
  } finally {
    // Exit
    process.exit();
  }
}

// Run the setup
setupSampleData();
