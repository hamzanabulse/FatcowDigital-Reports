# 🚀 Deployment Checklist

This checklist ensures a smooth deployment of the FatCow Digital Reports platform.

## Pre-Deployment

### 1. Firebase Project Setup
- [ ] Create Firebase project in console
- [ ] Enable Firestore Database
- [ ] Enable Authentication (Email/Password provider)
- [ ] Enable Cloud Functions
- [ ] Enable Hosting
- [ ] Upgrade to Blaze plan (required for Cloud Functions)

### 2. Environment Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all Firebase configuration values
- [ ] Configure SendGrid API key in Cloud Functions
- [ ] Set SendGrid sender email address

### 3. Dependencies
- [ ] Run `npm install` in root directory
- [ ] Run `npm install` in functions directory
- [ ] Verify all packages installed successfully

## Firestore Setup

### 4. Security Rules
```bash
firebase deploy --only firestore:rules
```
- [ ] Deployed successfully
- [ ] Test rules in Firebase Console

### 5. Indexes
```bash
firebase deploy --only firestore:indexes
```
- [ ] Deployed successfully
- [ ] Verify indexes are building in console

### 6. Initial Data
- [ ] Create test client account (see script below)
- [ ] Upload sample report data
- [ ] Verify data structure matches schema

## Cloud Functions

### 7. Function Configuration
```bash
firebase functions:config:set sendgrid.key="YOUR_KEY"
firebase functions:config:set sendgrid.from="reports@fatcowdigital.com"
```
- [ ] SendGrid API key set
- [ ] Sender email configured
- [ ] Run `firebase functions:config:get` to verify

### 8. Function Deployment
```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```
- [ ] `sendMonthlyReports` deployed
- [ ] `sendAnnualReports` deployed
- [ ] `sendTestReportEmail` deployed
- [ ] Check logs for any errors

### 9. Test Functions
```bash
# Test email function
curl -X POST https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/sendTestReportEmail \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","clientName":"Test","reportId":"2025-10","clientUid":"test_uid"}'
```
- [ ] Test email received
- [ ] Email formatting correct
- [ ] Links functional

## Frontend Application

### 10. Build Next.js Application
```bash
npm run build
```
- [ ] Build completed without errors
- [ ] No TypeScript errors
- [ ] No build warnings (critical ones)

### 11. Deploy Hosting
```bash
firebase deploy --only hosting
```
- [ ] Deployment successful
- [ ] Note the hosting URL
- [ ] Verify default Firebase URL works

### 12. Custom Domain Setup (if applicable)
- [ ] Add custom domain in Firebase Console
- [ ] Update DNS records as instructed
- [ ] Wait for SSL certificate provisioning
- [ ] Verify HTTPS access on custom domain

## Testing

### 13. Authentication Testing
- [ ] Navigate to login page
- [ ] Create test user account
- [ ] Verify login works
- [ ] Verify logout works
- [ ] Test password reset (if implemented)

### 14. Dashboard Testing
- [ ] Login with test account
- [ ] Verify dashboard loads
- [ ] Check KPI cards display correctly
- [ ] Test charts render properly
- [ ] Verify data tables functional
- [ ] Test sort/filter/search in tables

### 15. Mobile Testing
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Verify responsive layout
- [ ] Check touch interactions
- [ ] Test navigation menu

### 16. Archive Testing
- [ ] Navigate to archive page
- [ ] Change year selector
- [ ] Click on archived report
- [ ] Verify data loads correctly

### 17. Security Testing
- [ ] Try accessing dashboard without login → should redirect
- [ ] Try accessing another user's data → should fail
- [ ] Verify HTTPS enforced
- [ ] Check security headers

## Monitoring Setup

### 18. Enable Monitoring
- [ ] Enable Cloud Functions monitoring
- [ ] Set up error reporting
- [ ] Configure uptime checks
- [ ] Set up budget alerts

### 19. Logging
- [ ] Verify Cloud Function logs accessible
- [ ] Check Firestore audit logs
- [ ] Review authentication logs

## SendGrid Configuration

### 20. Email Setup
- [ ] Verify sender email in SendGrid
- [ ] Complete domain authentication (SPF, DKIM)
- [ ] Test email deliverability
- [ ] Add unsubscribe links (if required)

## Documentation

### 21. Internal Documentation
- [ ] Update README with actual URLs
- [ ] Document any custom configurations
- [ ] Create runbook for common operations
- [ ] Document backup procedures

### 22. Client Documentation
- [ ] Prepare client onboarding materials
- [ ] Create sample client credentials
- [ ] Prepare training materials

## Post-Deployment

### 23. Client Onboarding
- [ ] Create client Firebase Auth accounts
- [ ] Create client Firestore profiles
- [ ] Send welcome emails with credentials
- [ ] Schedule training calls

### 24. First Report Generation
- [ ] Upload first month's data
- [ ] Verify reports generate correctly
- [ ] Test automated email sending
- [ ] Collect client feedback

### 25. Maintenance Schedule
- [ ] Schedule regular backups
- [ ] Plan for dependency updates
- [ ] Set up monitoring dashboards
- [ ] Document escalation procedures

## Emergency Procedures

### Rollback Plan
```bash
# List recent deployments
firebase hosting:channel:list

# Rollback hosting
firebase hosting:rollback

# Rollback functions (if needed)
# Redeploy previous version from git
```

### Support Contacts
- Firebase Support: [Link to support]
- SendGrid Support: [Link to support]
- DNS Provider: [Contact info]

## Sign-Off

- [ ] Technical lead approval
- [ ] QA approval
- [ ] Client approval (if applicable)
- [ ] Documentation complete
- [ ] Team trained on maintenance

---

**Deployment Date:** ________________

**Deployed By:** ________________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
