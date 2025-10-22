# Setup Notes - FatCow Digital Reports

## Changes Made

### Email Functionality Removed
- All SendGrid email functionality has been removed
- Scheduled email functions removed
- Only core dashboard features remain

## Current Status

✅ **Working Features:**
- Secure login/authentication
- Interactive dashboard with KPI cards
- Performance charts (Chart.js)
- Data tables with search/sort/filter
- Archive for historical reports
- Mobile-responsive design
- Client data isolation

❌ **Removed Features:**
- Automated email notifications
- Scheduled monthly/annual report emails
- SendGrid integration

## Simple Setup Instructions

### 1. Install Firebase CLI

```powershell
npm install -g firebase-tools
```

### 2. Setup Firebase Project

```powershell
# Login to Firebase
firebase login

# Link to your project
firebase use --add
```

### 3. Configure Environment

Create `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
```

### 4. Deploy

```powershell
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Build the app
npm run build

# Deploy functions
firebase deploy --only functions

# Deploy hosting
firebase deploy --only hosting

# Or deploy everything
firebase deploy
```

### 5. Create Test User

In Firebase Console:
1. Go to Authentication → Users
2. Add user:
   - Email: demo@example.com
   - Password: DemoPassword123!
3. Copy the UID

Then in Firestore:
1. Create collection: `clients`
2. Document ID: [paste UID]
3. Fields:
   - clientId: "demo_001"
   - email: "demo@example.com"
   - companyName: "Demo Company"
   - contactName: "Demo User"
   - createdAt: [current timestamp]

## Minimal Cloud Functions

The project now has just one simple function:

```typescript
export const healthCheck = functions.https.onRequest(async (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'FatCow Digital Reports API is running',
    timestamp: new Date().toISOString(),
  });
});
```

## Testing

1. Visit your Firebase Hosting URL
2. Login with demo@example.com / DemoPassword123!
3. Dashboard should load (may show "No Reports" if no data)

## Adding Sample Data

You can manually add data in Firestore Console:

**Collection: `reports_summary`**
```json
{
  "client_id": "demo_001",
  "report_id": "2025-10",
  "year": 2025,
  "month": 10,
  "total_clicks": 1234,
  "total_impressions": 56789,
  "average_ctr": 0.0217,
  "average_position": 12.5,
  "report_date": "2025-10-01T00:00:00Z"
}
```

**Collection: `reports_monthly`**
```json
{
  "client_id": "demo_001",
  "report_id": "2025-10",
  "year": 2025,
  "month": 10,
  "daily_data": [],
  "device_data": [],
  "top_queries": []
}
```

## Troubleshooting

### Build Fails
```powershell
rm -r -fo node_modules
npm install
```

### Deploy Fails
Make sure:
- Firebase CLI is installed
- You're logged in: `firebase login`
- Project is linked: `firebase use --add`

### TypeScript Errors
These should be resolved with the updated tsconfig.json

## What You Get

A complete, secure reporting dashboard where:
- Clients login with email/password
- See their performance data
- View interactive charts
- Browse historical reports
- All data is isolated per client
- Works on mobile devices

No email functionality - clients access reports directly through the web portal.
