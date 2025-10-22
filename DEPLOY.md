# Quick Deployment Guide

This is a **simplified version** without email functionality.

## What This Project Does

✅ Secure login for clients  
✅ Interactive dashboard with charts  
✅ Historical report archive  
✅ Mobile-responsive design  
❌ No email notifications (removed)

## Before You Start

You need:
1. **Node.js 18+** installed
2. **Firebase project** created at https://console.firebase.google.com
3. **Firebase CLI** installed: `npm install -g firebase-tools`

## Step 1: Install Dependencies

```powershell
# In project root
npm install

# In functions folder
cd functions
npm install
cd ..
```

## Step 2: Configure Firebase

```powershell
# Login to Firebase
firebase login

# Connect to your project
firebase use --add
# Select your project from the list
```

## Step 3: Set Environment Variables

Create a file named `.env.local` in the project root with your Firebase settings:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourproject
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
```

**Where to get these:**
1. Go to Firebase Console
2. Click Settings (gear icon) → Project settings
3. Scroll to "Your apps" → Web app
4. Copy the config values

## Step 4: Enable Firebase Services

In Firebase Console, enable:
1. **Authentication** → Email/Password provider
2. **Firestore Database** → Create database (production mode)
3. **Functions** → Click "Get Started"
4. **Hosting** → Click "Get Started"

## Step 5: Update Firebase Project ID

Edit `.firebaserc` file and replace `your-project-id-here` with your actual Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Step 6: Deploy

```powershell
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Firestore indexes
firebase deploy --only firestore:indexes

# Build the Next.js app
npm run build

# Deploy Cloud Functions
firebase deploy --only functions

# Deploy to Hosting
firebase deploy --only hosting
```

Or deploy everything at once:
```powershell
npm run build
firebase deploy
```

## Step 7: Create a Test User

### In Firebase Console:

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter:
   - Email: `demo@example.com`
   - Password: `Test123456!`
4. Click **Add user**
5. **Copy the UID** shown in the user list

### In Firestore:

1. Go to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `clients`
4. Document ID: [Paste the UID you copied]
5. Add these fields:
   - `clientId` (string): `demo_client_001`
   - `email` (string): `demo@example.com`
   - `companyName` (string): `Demo Company Inc.`
   - `contactName` (string): `Demo User`
   - `createdAt` (timestamp): Click "Set to current time"
6. Click **Save**

## Step 8: Test Your Deployment

1. After deployment, Firebase will show your hosting URL
2. Visit: `https://your-project-id.web.app`
3. Login with:
   - Email: `demo@example.com`
   - Password: `Test123456!`

You'll see the dashboard (might show "No Reports Available" until you add data).

## Adding Sample Report Data

To see the dashboard in action, add sample data in Firestore:

### Collection: `reports_summary`

Click **Add document**, auto-generate ID, add fields:
```
client_id (string): demo_client_001
report_id (string): 2025-10
year (number): 2025
month (number): 10
total_clicks (number): 1234
total_impressions (number): 56789
average_ctr (number): 0.0217
average_position (number): 12.5
report_date (timestamp): 2025-10-01
mom_clicks_change (number): 5.2
yoy_clicks_change (number): 15.8
```

### Collection: `reports_monthly`

Click **Add document**, auto-generate ID, add fields:
```
client_id (string): demo_client_001
report_id (string): 2025-10
year (number): 2025
month (number): 10
daily_data (array): []
device_data (array): []
top_queries (array): []
```

After adding data, refresh the dashboard to see the reports!

## Troubleshooting

### "firebase: command not found"
```powershell
npm install -g firebase-tools
```

### Build errors
```powershell
# Clear and reinstall
rm -r -fo node_modules
rm -r -fo .next
npm install
```

### Can't login
- Make sure Authentication → Email/Password is enabled in Firebase Console
- Verify the user exists in Authentication → Users
- Check that client profile exists in Firestore with matching UID

### No data showing
- Verify client_id in reports matches the clientId in user's profile
- Check Firestore rules are deployed
- Look for errors in browser console (F12)

## What's Different (No Email)

This version does NOT include:
- ❌ Automated email sending
- ❌ Scheduled monthly/annual emails
- ❌ SendGrid integration
- ❌ Email templates

Clients access reports by:
- ✅ Logging into the web portal directly
- ✅ Using their permanent dashboard link
- ✅ Browsing the archive for historical data

## Next Steps

1. **Add Real Data** - Import your actual SEO data to Firestore
2. **Create Real Users** - Add your actual clients
3. **Customize Branding** - Update colors/logo if needed
4. **Set Custom Domain** - Configure your domain in Firebase Hosting

## Support

See `SETUP_NOTES.md` for more detailed information.

---

**That's it!** Your secure reporting dashboard is now live. 🎉
