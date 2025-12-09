# 🚀 Render Deployment Guide

## ✅ Code Successfully Pushed to GitHub

**Repository**: https://github.com/Gobinda988888/goverment-jobs.git

## 🔥 Firebase Integration Complete

Firebase Storage has been integrated for file uploads (PDFs, images).

**Firebase Configuration**:
- Project ID: `gobindatest-9a5ca`
- Storage Bucket: `gobindatest-9a5ca.firebasestorage.app`
- Firebase Admin SDK installed
- Storage service created for file management

## 📋 Deploy to Render.com

### Step 1: Create Render Account
1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account

### Step 2: Connect GitHub Repository
1. After login, click **"New +"** in top right
2. Select **"Web Service"**
3. Click **"Connect account"** to connect GitHub
4. Search for `goverment-jobs` repository
5. Click **"Connect"**

### Step 3: Configure Web Service

Fill in the following details:

**Basic Configuration**:
- **Name**: `odisha-jobs-backend` (or any name you prefer)
- **Region**: Choose closest to India (e.g., Singapore)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

**Instance Type**:
- Select **"Free"** (sufficient for testing)

### Step 4: Add Environment Variables

Click **"Advanced"** and add these environment variables:

#### Required Variables:

1. **NODE_ENV**
   - Value: `production`

2. **PORT**
   - Value: `5000`

3. **MONGODB_URI**
   - Get from MongoDB Atlas (see below)
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/odisha-jobs?retryWrites=true&w=majority`

4. **YOUTUBE_API_KEY**
   - Value: `AIzaSyDzLjA46B4MOnXh2G6vUFNpJzir-LDnkyY`

5. **JWT_SECRET**
   - Value: Any random string (e.g., `odisha_jobs_super_secret_key_2025`)

#### AI Service (Choose ONE):

**Option A - OpenAI** (Paid):
- **OPENAI_API_KEY**: Your OpenAI API key
- **OPENAI_MODEL**: `gpt-4-turbo-preview`

**Option B - Gemini** (Free tier available):
- **GEMINI_API_KEY**: Your Google Gemini API key

#### Firebase (Optional for Storage):

6. **FIREBASE_SERVICE_ACCOUNT**
   - This is a JSON string (see Firebase setup below)
   - Leave empty for now, can add later

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Your backend will be live at: `https://odisha-jobs-backend.onrender.com`

---

## 🗄️ MongoDB Atlas Setup

### Create Free MongoDB Database:

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
2. **Sign Up** for free account
3. **Create Cluster**:
   - Click **"Build a Database"**
   - Choose **"M0 FREE"** tier
   - Select **"Mumbai"** or **"Singapore"** region (closest to India)
   - Cluster Name: `odisha-jobs-cluster`
   - Click **"Create Cluster"**

4. **Create Database User**:
   - Go to **"Database Access"** in left menu
   - Click **"Add New Database User"**
   - Username: `odishajobs`
   - Password: (Generate strong password or create your own)
   - **Save this password!**
   - User Privileges: **"Read and write to any database"**
   - Click **"Add User"**

5. **Whitelist IP Addresses**:
   - Go to **"Network Access"** in left menu
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click **"Confirm"**

6. **Get Connection String**:
   - Go to **"Database"** in left menu
   - Click **"Connect"** on your cluster
   - Choose **"Connect your application"**
   - Select **"Node.js"** driver
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `<dbname>` with `odisha-jobs`
   - Example: `mongodb+srv://odishajobs:yourpassword@odisha-jobs-cluster.abc123.mongodb.net/odisha-jobs?retryWrites=true&w=majority`

7. **Add to Render**:
   - Go back to Render dashboard
   - Click on your web service
   - Go to **"Environment"** tab
   - Add `MONGODB_URI` with your connection string

---

## 🔑 Get AI API Keys

### Option 1: Google Gemini (Recommended - Free Tier)

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click **"Create API Key"**
4. Copy the API key
5. Add to Render as `GEMINI_API_KEY`

### Option 2: OpenAI (Paid)

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click **"Create new secret key"**
4. Copy the key (starts with `sk-`)
5. Add to Render as `OPENAI_API_KEY`
6. Add credit to your OpenAI account (minimum $5)

---

## 🔥 Firebase Service Account Setup (Optional)

For file uploads to work properly:

1. **Go to Firebase Console**: https://console.firebase.google.com
2. Select your project: `gobindatest-9a5ca`
3. Click **⚙️ Settings** → **"Project settings"**
4. Go to **"Service accounts"** tab
5. Click **"Generate new private key"**
6. Download the JSON file

7. **Convert JSON to Single Line**:
   - Open the downloaded JSON file
   - Copy all content
   - Remove all line breaks and spaces (make it single line)
   - Or use online tool: https://www.text-utils.com/json-formatter/

8. **Add to Render**:
   - In Render dashboard, add environment variable
   - Key: `FIREBASE_SERVICE_ACCOUNT`
   - Value: The entire JSON as single line string

---

## 📱 Update Mobile App with Backend URL

Once your backend is deployed:

1. **Get Backend URL**:
   - From Render dashboard
   - Example: `https://odisha-jobs-backend.onrender.com`

2. **Update Mobile App**:
   ```dart
   // Open: mobile/lib/services/api_service.dart
   // Change line 6:
   static const String baseUrl = 'https://odisha-jobs-backend.onrender.com/api';
   ```

3. **Rebuild APK**:
   ```bash
   cd mobile
   flutter build apk --release
   ```

4. **New APK Location**:
   - `mobile/build/app/outputs/flutter-apk/app-release.apk`

---

## ✅ Test Your Deployment

### 1. Check Backend Health
Open in browser:
```
https://your-app-name.onrender.com/health
```
Should return: `{"status": "ok", "message": "Server is running"}`

### 2. Test API Endpoints

**Get All Jobs**:
```
https://your-app-name.onrender.com/api/jobs
```

**Get Featured Jobs**:
```
https://your-app-name.onrender.com/api/jobs/featured
```

### 3. Test Mobile App
- Install updated APK on phone
- Should now fetch jobs from live backend
- No need for local backend server

---

## 📊 Monitor Your App

### Render Dashboard
- **Logs**: View real-time server logs
- **Metrics**: CPU, memory usage
- **Events**: Deployment history

### Free Tier Limitations
- ⚠️ **Spins down after 15 minutes of inactivity**
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (enough for one service)

### Upgrade to Paid ($7/month):
- No spin-down
- Faster response times
- Better performance

---

## 🐛 Troubleshooting

### "Service Unavailable" Error
- Backend is spinning up (wait 60 seconds)
- Or deployment failed (check logs in Render)

### "Database Connection Failed"
- Check MongoDB URI is correct
- Verify IP whitelist includes 0.0.0.0/0
- Check MongoDB user has correct permissions

### "Firebase Error"
- Firebase service account not configured (optional for now)
- Can still use app without file upload features

### Mobile App Shows "No Jobs"
- Database is empty (need to add jobs via API)
- Backend not accessible (check URL)
- Network connectivity issue

---

## 📝 Add Jobs to Database

Use Postman or similar tool to add jobs via API:

**Endpoint**: `POST https://your-app.onrender.com/api/jobs`

**Body** (JSON):
```json
{
  "title": "OPSC Civil Services Recruitment 2024",
  "organization": "Odisha Public Service Commission",
  "description": "OPSC is recruiting for various civil services positions...",
  "category": "government",
  "location": "Odisha",
  "salary": "₹56,100 - ₹2,00,000",
  "lastDate": "2024-12-31",
  "notificationUrl": "https://opsc.gov.in/notification",
  "applicationUrl": "https://opsc.gov.in/apply",
  "pdfUrl": "https://opsc.gov.in/notification.pdf"
}
```

---

## 🎉 Deployment Complete!

**Your Backend**: https://your-app-name.onrender.com
**GitHub Repo**: https://github.com/Gobinda988888/goverment-jobs.git
**Mobile APK**: `mobile/build/app/outputs/flutter-apk/app-release.apk`

### Next Steps:
1. ✅ Code pushed to GitHub
2. ✅ Firebase integrated
3. ⬜ Deploy to Render
4. ⬜ Set up MongoDB Atlas
5. ⬜ Get AI API key (Gemini/OpenAI)
6. ⬜ Update mobile app with backend URL
7. ⬜ Add job data to database
8. ⬜ Test complete flow

**Need help?** Check the logs in Render dashboard or MongoDB Atlas monitoring.
