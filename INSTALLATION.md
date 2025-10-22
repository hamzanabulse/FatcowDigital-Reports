# Installation & Setup Instructions

## Step-by-Step Setup Guide

### 1. Initial Setup

Open PowerShell in the project directory:

```powershell
# Navigate to project
cd "c:\Users\Admin\Downloads\fatcow reporting\fatcow-digital-reports"

# Install root dependencies
npm install

# Install function dependencies
cd functions
npm install
cd ..
```

### 2. Firebase CLI Setup

```powershell
# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Link to your Firebase project
firebase use --add
```

When prompted:
- Select your Firebase project
- Give it an alias (e.g., "production")

### 3. Environment Configuration

```powershell
# Copy environment template
Copy-Item .env.example .env.local
```

Edit `.env.local` with your Firebase configuration:
1. Go to Firebase Console → Project Settings
2. Scroll to "Your apps" section
3. Click the web app icon (</>)
4. Copy the config values to `.env.local`

### 4. SendGrid Configuration

```powershell
# Set SendGrid API key
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"

# Set sender email
firebase functions:config:set sendgrid.from="reports@fatcowdigital.com"

# Verify configuration
firebase functions:config:get
```

### 5. Deploy Firestore

```powershell
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

### 6. Build the Application

```powershell
# Build Next.js application
npm run build
```

If you encounter any errors, check that all dependencies are installed correctly.

### 7. Deploy to Firebase

```powershell
# Deploy Cloud Functions
firebase deploy --only functions

# Deploy Hosting
firebase deploy --only hosting

# Or deploy everything at once
firebase deploy
```

### 8. Create Test Account (Choose One Method)

#### Method A: Firebase Console (Recommended for First Time)

1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Enter:
   - Email: `demo@example.com`
   - Password: `DemoPassword123!`
4. Click "Add user"
5. **Copy the UID shown**

Then create client profile:
1. Go to Firestore Database
2. Start collection: `clients`
3. Document ID: [Paste the UID you copied]
4. Add fields:
   - `clientId` (string): `demo_client_001`
   - `email` (string): `demo@example.com`
   - `companyName` (string): `Demo Company Inc.`
   - `contactName` (string): `Demo User`
   - `createdAt` (timestamp): [Click "Set to current time"]
5. Click "Save"

#### Method B: Using Script (Advanced)

```powershell
# Install Firebase Admin SDK (if needed)
npm install --save-dev firebase-admin

# Run sample data script
node scripts/setup-sample-data.js
```

This will:
- Create a test user account
- Create client profile
- Generate 6 months of sample reports
- Generate an annual report

### 9. Test the Application

```powershell
# Get your hosting URL
firebase hosting:channel:deploy preview
```

Or visit your main hosting URL shown after deployment.

**Test Login:**
- Navigate to the URL
- Click login
- Email: `demo@example.com`
- Password: `DemoPassword123!`

### 10. Custom Domain (Optional)

If setting up `reports.fatcowdigital.com`:

1. Firebase Console → Hosting → Add custom domain
2. Enter: `reports.fatcowdigital.com`
3. Follow DNS setup instructions provided
4. Wait for SSL certificate provisioning (can take 24 hours)

## Verification Checklist

After setup, verify:

- [ ] Application builds without errors
- [ ] Firestore rules deployed
- [ ] Cloud Functions deployed
- [ ] Hosting deployed and accessible
- [ ] Can login with test account
- [ ] Dashboard loads (may show "No Reports" if no data yet)
- [ ] Archive page accessible
- [ ] Logout works
- [ ] Mobile responsive design works

## Common Issues & Solutions

### Issue: npm install fails

**Solution:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### Issue: Firebase login fails

**Solution:**
```powershell
# Logout and login again
firebase logout
firebase login --reauth
```

### Issue: Build fails with TypeScript errors

**Solution:**
These are expected until dependencies are installed. After running `npm install`, build again.

### Issue: Functions deployment fails

**Solution:**
```powershell
cd functions

# Clear and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Build
npm run build

cd ..

# Deploy
firebase deploy --only functions
```

### Issue: "No such file or directory" error

**Solution:**
Make sure you're in the correct directory:
```powershell
cd "c:\Users\Admin\Downloads\fatcow reporting\fatcow-digital-reports"
```

### Issue: Can't access after deployment

**Solutions:**
1. Check that deployment completed successfully
2. Verify URL is correct (Firebase will show it after deploy)
3. Try incognito/private browsing window
4. Check Firebase Console → Hosting for deployment status

### Issue: Login doesn't work

**Solutions:**
1. Verify Firebase Authentication is enabled (Email/Password provider)
2. Check that user exists in Authentication → Users
3. Verify password is correct (min 6 characters)
4. Check browser console for errors (F12)

### Issue: No data showing in dashboard

**Solutions:**
1. Verify Firestore rules are deployed
2. Check that `client_id` in reports matches user's `clientId`
3. Verify data exists in Firestore Console
4. Check browser console for errors

## Environment Variables Reference

Create `.env.local` with these values:

```env
# Get these from Firebase Console → Project Settings → General → Your apps → Web app

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

## Firebase Functions Configuration

Set these via Firebase CLI:

```powershell
# SendGrid API Key (get from SendGrid → Settings → API Keys)
firebase functions:config:set sendgrid.key="SG.xxxxxxxxxxxxx"

# Sender email (must be verified in SendGrid)
firebase functions:config:set sendgrid.from="reports@fatcowdigital.com"
```

## Next Steps After Installation

1. **Read Documentation**
   - `README.md` - Project overview
   - `QUICKSTART.md` - Quick setup guide
   - `DEVELOPER_GUIDE.md` - Detailed technical docs
   - `CLIENT_GUIDE.md` - Share with clients

2. **Add Real Data**
   - Import actual client data
   - Generate real reports
   - Test email delivery

3. **Configure Production**
   - Set up custom domain
   - Configure SendGrid sender authentication
   - Enable monitoring and logging
   - Set up backups

4. **Onboard Clients**
   - Create client accounts
   - Send credentials securely
   - Provide training if needed

## Support

If you encounter issues not covered here:

1. Check the `DEVELOPER_GUIDE.md` for detailed troubleshooting
2. Review Firebase Console for error messages
3. Check Cloud Function logs: `firebase functions:log`
4. Verify all prerequisites are met

## Success!

Once completed, you should have:
- ✅ A live, secure reporting platform
- ✅ Automated email functionality
- ✅ Test account for demonstration
- ✅ Full documentation

Your application is ready for production use! 🎉

---

**Need Help?**
- Firebase Docs: https://firebase.google.com/docs
- Next.js Docs: https://nextjs.org/docs
- Project Docs: See README.md and DEVELOPER_GUIDE.md
