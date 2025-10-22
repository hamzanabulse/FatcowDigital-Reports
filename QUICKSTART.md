# Quick Start Guide

Get FatCow Digital Reports up and running in under 30 minutes.

## 1. Prerequisites Check ✅

Make sure you have:
```bash
node --version  # Should be 18+
npm --version
```

Install Firebase CLI if needed:
```bash
npm install -g firebase-tools
firebase --version
```

## 2. Firebase Project Setup (5 minutes)

### Create Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it (e.g., "fatcow-reports")
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Services
In your Firebase project:
1. **Authentication** → Get Started → Enable "Email/Password"
2. **Firestore Database** → Create database → Start in production mode
3. **Functions** → Get Started (accept terms)
4. **Hosting** → Get Started
5. **Upgrade to Blaze Plan** (required for Cloud Functions)

## 3. Local Setup (5 minutes)

```bash
# Navigate to project
cd "c:\Users\Admin\Downloads\fatcow reporting\fatcow-digital-reports"

# Install dependencies
npm install

# Install function dependencies
cd functions
npm install
cd ..

# Login to Firebase
firebase login

# Link to your project
firebase use --add
# Select your project and give it an alias like "production"
```

## 4. Configure Environment (3 minutes)

### Get Firebase Config
1. Firebase Console → Project Settings → General
2. Scroll to "Your apps" → Web app
3. If no web app, click "Add app" → Web
4. Copy the config object

### Create .env.local
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local with your Firebase config
```

Your `.env.local` should look like:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
```

## 5. SendGrid Setup (5 minutes)

### Create SendGrid Account
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Verify your email
3. Create an API Key → Settings → API Keys → Create API Key
4. Copy the key (you'll only see it once!)

### Configure Functions
```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
firebase functions:config:set sendgrid.from="reports@fatcowdigital.com"

# Verify
firebase functions:config:get
```

## 6. Deploy to Firebase (5 minutes)

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Build the app
npm run build

# Deploy everything
firebase deploy
```

Wait for deployment to complete. Note the hosting URL!

## 7. Create Test Account (2 minutes)

### Option A: Firebase Console (Easy)
1. Firebase Console → Authentication → Users
2. Click "Add user"
3. Email: `demo@example.com`
4. Password: `DemoPassword123!`
5. Click "Add user"
6. Copy the UID

Then manually create client profile in Firestore:
1. Firestore → Start collection: `clients`
2. Document ID: [paste the UID]
3. Add fields:
   - `clientId` (string): "demo_client_001"
   - `email` (string): "demo@example.com"
   - `companyName` (string): "Demo Company"
   - `contactName` (string): "Demo User"
   - `createdAt` (timestamp): [current time]

### Option B: Using Script (Advanced)
```bash
# Install Firebase Admin SDK
npm install firebase-admin --save-dev

# Run the sample data script
node scripts/setup-sample-data.js
```

## 8. Test Your Deployment (3 minutes)

1. **Visit your hosting URL**
   ```
   https://your-project.web.app
   ```

2. **Login**
   - Email: `demo@example.com`
   - Password: `DemoPassword123!`

3. **Verify Dashboard Loads**
   - Should redirect to dashboard after login
   - If no reports yet, you'll see "No Reports Available"

## 9. Add Sample Report Data (Optional)

If using the script from Option B above, sample data is already created.

Otherwise, manually add a report in Firestore:

**Collection:** `reports_summary`

**Document (auto-ID):**
```json
{
  "client_id": "demo_client_001",
  "report_id": "2025-10",
  "report_date": "2025-10-01T00:00:00Z",
  "year": 2025,
  "month": 10,
  "total_clicks": 1234,
  "total_impressions": 56789,
  "average_ctr": 0.0217,
  "average_position": 12.5,
  "mom_clicks_change": 5.2,
  "yoy_clicks_change": 15.8
}
```

**Collection:** `reports_monthly`

**Document (auto-ID):**
```json
{
  "client_id": "demo_client_001",
  "report_id": "2025-10",
  "year": 2025,
  "month": 10,
  "daily_data": [
    {
      "date": "2025-10-01",
      "clicks": 45,
      "impressions": 2100,
      "ctr": 0.0214,
      "position": 11.2
    }
    // ... add more days
  ],
  "device_data": [],
  "top_queries": []
}
```

## 10. Custom Domain (Optional)

If you want `reports.fatcowdigital.com`:

1. Firebase Console → Hosting → Add custom domain
2. Enter: `reports.fatcowdigital.com`
3. Follow DNS setup instructions
4. Wait for SSL certificate (up to 24 hours)

## Troubleshooting

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Function Errors
```bash
cd functions
rm -rf node_modules
npm install
npm run build
cd ..
firebase deploy --only functions
```

### Can't Login
- Check Authentication is enabled in Firebase Console
- Verify user exists in Authentication → Users
- Check browser console for errors

### No Data Showing
- Verify Firestore rules deployed: `firebase deploy --only firestore:rules`
- Check `client_id` matches between user profile and reports
- Look in Firestore Console to confirm data exists

### Email Not Sending
```bash
# Check SendGrid config
firebase functions:config:get

# Test function manually
firebase functions:shell
> sendTestReportEmail({body: {email: "test@example.com", clientName: "Test", reportId: "2025-10", clientUid: "test"}})
```

## Next Steps

1. ✅ Review [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for detailed info
2. ✅ Share [CLIENT_GUIDE.md](./CLIENT_GUIDE.md) with clients
3. ✅ Set up monitoring and backups
4. ✅ Configure production SendGrid sender authentication
5. ✅ Schedule regular data imports

## Success! 🎉

Your secure reporting platform is now live at:
```
https://your-project.web.app
```

**Test Login:**
- Email: `demo@example.com`
- Password: `DemoPassword123!`

Happy reporting! 🐄📊
