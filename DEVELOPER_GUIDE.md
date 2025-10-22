# 🌐 FatCow Digital Reports - Developer Documentation

## Overview

FatCow Digital Reports is a secure, full-stack reporting application that provides clients with interactive dashboards through permanent, secure links powered by Firebase.

**Live URL:** https://reports.fatcowdigital.com

## Architecture

### Tech Stack

- **Frontend:** Next.js 14 with TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Chart.js with react-chartjs-2
- **Backend:** Firebase Cloud Functions (Node.js)
- **Database:** Cloud Firestore
- **Authentication:** Firebase Authentication
- **Hosting:** Firebase Hosting
- **Email:** SendGrid

### Security Model

The application implements client-level data isolation using:
- Firebase Authentication for user identity
- Firestore Security Rules enforcing client_id matching
- Unique user UIDs mapped to client_id in the database

## Project Structure

```
fatcow-digital-reports/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── login/              # Login page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── KPICard.tsx
│   │   ├── PerformanceChart.tsx
│   │   ├── QueryTable.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx
│   ├── lib/                    # Utilities
│   │   └── firebase.ts
│   ├── styles/                 # Global styles
│   │   └── globals.css
│   └── types/                  # TypeScript types
│       └── index.ts
├── functions/                  # Firebase Cloud Functions
│   └── src/
│       └── index.ts
├── public/                     # Static assets
├── firebase.json               # Firebase configuration
├── firestore.rules             # Security rules
├── firestore.indexes.json      # Database indexes
└── package.json

```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project created
- SendGrid account with API key

### Step 1: Clone and Install

```bash
cd "fatcow-digital-reports"
npm install
```

### Step 2: Firebase Setup

1. **Initialize Firebase Project**

```bash
firebase login
firebase use --add
```

Select your Firebase project and give it an alias (e.g., "production").

2. **Configure Environment Variables**

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. **Configure SendGrid for Cloud Functions**

```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
firebase functions:config:set sendgrid.from="reports@fatcowdigital.com"
```

### Step 3: Deploy Firestore Rules and Indexes

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Step 4: Install and Deploy Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### Step 5: Build and Deploy Frontend

```bash
npm run build
firebase deploy --only hosting
```

## Development

### Run Locally

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Terminal 2: Start Firebase emulators (optional)
firebase emulators:start
```

Access the app at `http://localhost:3000`

### Testing Cloud Functions Locally

```bash
cd functions
npm run serve
```

## Firestore Data Structure

### Collections

#### `clients` Collection
```typescript
{
  // Document ID = Firebase Auth UID
  clientId: string;          // Unique client identifier
  email: string;             // Client email
  companyName: string;       // Company name
  contactName: string;       // Contact person name
  createdAt: Timestamp;
  lastReportDate?: string;   // Last report generated
}
```

#### `reports_summary` Collection
```typescript
{
  id: string;                // Auto-generated
  client_id: string;         // Links to client
  report_id: string;         // Format: "YYYY-MM"
  report_date: Timestamp;
  year: number;
  month: number;
  total_clicks: number;
  total_impressions: number;
  average_ctr: number;
  average_position: number;
  mom_clicks_change?: number;
  mom_impressions_change?: number;
  mom_ctr_change?: number;
  yoy_clicks_change?: number;
  yoy_impressions_change?: number;
  yoy_ctr_change?: number;
}
```

#### `reports_monthly` Collection
```typescript
{
  id: string;
  client_id: string;
  report_id: string;
  year: number;
  month: number;
  daily_data: Array<{
    date: string;            // ISO date
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  device_data: Array<{
    device: 'desktop' | 'mobile' | 'tablet';
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  top_queries: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}
```

#### `reports_annual` Collection
```typescript
{
  id: string;
  client_id: string;
  year: number;
  monthly_summaries: Array<{
    month: number;
    month_name: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  yoy_comparison?: {
    clicks_change: number;
    impressions_change: number;
    ctr_change: number;
  };
  top_queries_current: QueryData[];
  top_queries_previous?: QueryData[];
}
```

## Creating Client Accounts

Use Firebase Console or Admin SDK:

```javascript
// 1. Create Firebase Auth user
const userRecord = await admin.auth().createUser({
  email: 'client@company.com',
  password: 'temporary_password',
  displayName: 'Client Name'
});

// 2. Create client profile in Firestore
await admin.firestore().collection('clients').doc(userRecord.uid).set({
  clientId: 'unique_client_id',
  email: 'client@company.com',
  companyName: 'Company Name',
  contactName: 'Contact Person',
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});
```

## Generating Reports

Reports should be generated by your data pipeline and written to Firestore. Example:

```javascript
const reportData = {
  client_id: 'client_unique_id',
  report_id: '2025-10',
  report_date: new Date('2025-10-01'),
  year: 2025,
  month: 10,
  total_clicks: 12345,
  total_impressions: 678901,
  average_ctr: 0.0181,
  average_position: 12.5,
  mom_clicks_change: 5.2,
  yoy_clicks_change: 15.8
};

await admin.firestore().collection('reports_summary').add(reportData);
```

## Automated Email Distribution

### Monthly Reports
- **Schedule:** 2nd of each month at 9:00 AM EST
- **Function:** `sendMonthlyReports`
- **Triggered by:** Cloud Scheduler (Pub/Sub)

### Annual Reports
- **Schedule:** January 5th at 9:00 AM EST
- **Function:** `sendAnnualReports`
- **Triggered by:** Cloud Scheduler (Pub/Sub)

### Testing Email Functions

Use the HTTP endpoint for testing:

```bash
curl -X POST https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/sendTestReportEmail \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "clientName": "Test Client",
    "reportId": "2025-10",
    "clientUid": "firebase_auth_uid"
  }'
```

## Custom Domain Setup

1. **Add Domain in Firebase Console**
   - Go to Hosting section
   - Click "Add custom domain"
   - Enter `reports.fatcowdigital.com`

2. **Update DNS Records**
   - Add the A/AAAA records provided by Firebase
   - Wait for SSL certificate provisioning (can take up to 24 hours)

## Security Best Practices

1. **Never expose Firebase config in public repos** - Use environment variables
2. **Rotate SendGrid API keys regularly**
3. **Monitor Firestore security rules** - Test thoroughly
4. **Use Firebase App Check** - Protect against unauthorized access
5. **Enable Firebase Authentication email verification** (optional)

## Monitoring and Logs

### View Cloud Function Logs
```bash
firebase functions:log
```

### View Specific Function
```bash
firebase functions:log --only sendMonthlyReports
```

### Firestore Usage
Monitor in Firebase Console → Firestore Database → Usage tab

## Troubleshooting

### Build Errors

**Issue:** TypeScript compilation errors
```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Function Deployment Fails

**Issue:** Missing dependencies
```bash
cd functions
rm -rf node_modules
npm install
cd ..
firebase deploy --only functions
```

### Email Not Sending

1. Check SendGrid API key: `firebase functions:config:get`
2. Verify SendGrid sender authentication
3. Check function logs for errors

### Data Not Showing

1. Verify Firestore rules allow read access
2. Check client_id matches between user and reports
3. Confirm data exists in Firestore Console

## Performance Optimization

- **Firestore Indexes:** Automatically created from `firestore.indexes.json`
- **Image Optimization:** Next.js Image component (currently disabled for static export)
- **Code Splitting:** Automatic with Next.js
- **Caching:** Firebase Hosting CDN caching enabled

## Backup and Recovery

### Export Firestore Data
```bash
gcloud firestore export gs://[BUCKET_NAME]/[EXPORT_FOLDER]
```

### Import Firestore Data
```bash
gcloud firestore import gs://[BUCKET_NAME]/[EXPORT_FOLDER]
```

## Support

For technical issues:
- Check Firebase Console for errors
- Review function logs
- Consult Firebase documentation

## License

Proprietary - FatCow Digital © 2025
