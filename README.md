# 🐄 FatCow Digital Reports

**Secure Interactive Reporting Platform for SEO Performance**

A modern, mobile-first reporting application that provides clients with permanent, secure access to their SEO performance data through Firebase-powered dashboards.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)
![Firebase](https://img.shields.io/badge/firebase-enabled-orange)

## 🌟 Features

### ✅ Security-First Design
- Firebase Authentication with email/password
- Client-level data isolation via Firestore Security Rules
- HTTPS-only secure connections
- Protected routes with authentication guards

### ✅ Interactive Dashboards
- **Real-time KPI Cards** with month-over-month and year-over-year comparisons
- **Zoomable Charts** built with Chart.js for daily performance trends
- **Searchable Data Tables** with sorting and filtering
- **Device Segmentation** (desktop, mobile, tablet analytics)

### ✅ Data Access
- **Permanent Links:** Same URL always shows latest data
- **Direct Access:** Clients access reports through secure web portal
- **Real-time Updates:** Data refreshes when clients log in

### ✅ Mobile-First Responsive Design
- Fully optimized for smartphones and tablets
- Touch-friendly interactive charts
- Adaptive layouts for all screen sizes
- Fast loading and performance

### ✅ Scalable Architecture
- Built on Google Cloud Platform via Firebase
- Handles thousands of concurrent clients
- Auto-scaling Cloud Functions
- CDN-powered global distribution

## 🚀 Live Demo

**Production URL:** [https://reports.fatcowdigital.com](https://reports.fatcowdigital.com)

## 📋 Quick Start

### Prerequisites

- Node.js 18 or higher
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Firestore, Authentication, Functions, and Hosting enabled

### Installation

```bash
# Clone the repository
git clone [repository-url]
cd fatcow-digital-reports

# Install dependencies
npm install

# Install function dependencies
cd functions
npm install
cd ..

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Initialize Firebase
firebase login
firebase use --add

# Deploy Firestore rules and indexes
firebase deploy --only firestore

# Deploy Cloud Functions
firebase deploy --only functions

# Build and deploy frontend
npm run build
firebase deploy --only hosting
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS |
| **Charts** | Chart.js with react-chartjs-2 |
| **Backend** | Firebase Cloud Functions (Node.js) |
| **Database** | Cloud Firestore (NoSQL) |
| **Auth** | Firebase Authentication |
| **Hosting** | Firebase Hosting with CDN |
| **Build** | Next.js Static Export |

## 📁 Project Structure

```
fatcow-digital-reports/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Protected dashboard routes
│   │   │   ├── page.tsx        # Main dashboard
│   │   │   ├── archive/        # Historical reports
│   │   │   └── layout.tsx      # Dashboard layout
│   │   ├── login/              # Authentication
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home/redirect
│   ├── components/             # Reusable React components
│   │   ├── KPICard.tsx         # Metric display cards
│   │   ├── PerformanceChart.tsx # Chart.js wrapper
│   │   ├── QueryTable.tsx      # Sortable data table
│   │   └── ProtectedRoute.tsx  # Auth guard
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication state
│   ├── lib/
│   │   └── firebase.ts         # Firebase initialization
│   ├── styles/
│   │   └── globals.css         # Global + Tailwind styles
│   └── types/
│       └── index.ts            # TypeScript definitions
├── functions/                   # Firebase Cloud Functions
│   └── src/
│       └── index.ts            # Scheduled email functions
├── public/                      # Static assets
├── firebase.json               # Firebase configuration
├── firestore.rules             # Security rules
├── firestore.indexes.json      # Database indexes
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript config
└── package.json
```

## 🔒 Security Rules

The application enforces strict data isolation:

```javascript
// Users can only read their own client profile
match /clients/{userId} {
  allow read: if request.auth.uid == userId;
}

// Users can only read reports matching their client_id
match /reports_summary/{reportId} {
  allow read: if request.auth != null && 
              resource.data.client_id == getClientId();
}
```

## 📊 Data Models

### Client Profile
```typescript
{
  clientId: string;          // Unique identifier
  email: string;
  companyName: string;
  contactName: string;
  createdAt: Timestamp;
}
```

### Monthly Report Summary
```typescript
{
  client_id: string;
  report_id: string;         // Format: "YYYY-MM"
  year: number;
  month: number;
  total_clicks: number;
  total_impressions: number;
  average_ctr: number;
  average_position: number;
  mom_clicks_change?: number;
  yoy_clicks_change?: number;
}
```

## 🎨 Design System

### Color Palette
- **Primary Navy:** `#0A1128` - Headers, primary text
- **Secondary Blue:** `#1E3A5F` - Accents, buttons
- **Accent Green:** `#10B981` - CTAs, positive indicators
- **Light Background:** `#F8FAFC` - Page background

### Typography
- Font Family: Inter (Google Fonts)
- Headings: Bold, Navy
- Body: Regular, Gray-900

## 📧 Email Templates

Professionally designed HTML emails with:
- Responsive design
- Branded header with logo
- Summary metrics table
- Large CTA button to secure dashboard
- Mobile-optimized layout

## 🔧 Development

### Local Development
```bash
npm run dev
```
Access at `http://localhost:3000`

### Test with Firebase Emulators
```bash
firebase emulators:start
```

### Build for Production
```bash
npm run build
```

### Deploy to Firebase
```bash
# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore
```

## 📖 Documentation

- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Complete setup and deployment instructions
- **[Client Guide](./CLIENT_GUIDE.md)** - End-user documentation for clients

## 🔐 Environment Variables

Required environment variables (`.env.local`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Cloud Functions configuration:
```bash
firebase functions:config:set sendgrid.key="YOUR_KEY"
firebase functions:config:set sendgrid.from="reports@fatcowdigital.com"
```

## 📅 Automation Schedule

| Task | Schedule | Function |
|------|----------|----------|
| Monthly Reports | 2nd of month, 9:00 AM EST | `sendMonthlyReports` |
| Annual Reports | January 5th, 9:00 AM EST | `sendAnnualReports` |

## 🎯 Key Metrics

Dashboard displays:
- Total Clicks
- Total Impressions
- Average CTR (Click-Through Rate)
- Average Search Position
- Month-over-Month changes
- Year-over-Year comparisons

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#troubleshooting) for common issues and solutions.

## 📝 License

Proprietary - FatCow Digital © 2025. All rights reserved.

## 🤝 Support

For technical support or questions:
- Email: support@fatcowdigital.com
- Documentation: See guides above

---

**Built with ❤️ by FatCow Digital**
