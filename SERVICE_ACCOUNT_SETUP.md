# 🔥 Firebase Service Account Setup - Complete Guide

## आपका Firebase Config:

```javascript
Project ID: gobindatest-9a5ca
API Key: AIzaSyDaQ01SM-tN4SnOae6MRxSUbBGWqjFNrAM
Storage Bucket: gobindatest-9a5ca.firebasestorage.app
```

✅ यह config पहले से backend में है!

---

## 🔑 अब Service Account JSON चाहिए

### Step 1: Firebase Console खोलें

```
https://console.firebase.google.com/project/gobindatest-9a5ca/settings/serviceaccounts
```

### Step 2: Service Account Generate करें

1. **"Service accounts"** tab पर जाएं
2. **"Generate new private key"** button पर click करें
3. Warning popup में **"Generate key"** click करें
4. JSON file automatically download होगी
   - Filename: `gobindatest-9a5ca-firebase-adminsdk-xxxxx.json`

### Step 3: JSON को Single Line बनाएं

**Method 1: Online Tool (Fastest)**
```
1. Go to: https://www.text-utils.com/json-formatter/
2. Paste JSON content
3. Click "Minify" or "Remove whitespace"
4. Copy single-line result
```

**Method 2: Command Line**
```bash
# Mac/Linux
cat downloaded-file.json | jq -c . | pbcopy

# Windows PowerShell
Get-Content downloaded-file.json | ConvertFrom-Json | ConvertTo-Json -Compress | Set-Clipboard
```

**Method 3: Manual**
- Text editor में खोलें
- सभी line breaks remove करें
- Single line बना लें

---

## 💻 Local Development Setup

### 1. Backend .env File Update करें

File: `backend/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Firebase Firestore
# No MongoDB needed!

# Firebase Service Account (REQUIRED!)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"gobindatest-9a5ca","private_key_id":"abc123...","private_key":"-----BEGIN PRIVATE KEY-----\nMIIE...","client_email":"firebase-adminsdk@gobindatest-9a5ca.iam.gserviceaccount.com","client_id":"123456","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk..."}

# AI Service (Choose one)
GEMINI_API_KEY=your_gemini_api_key
# OR
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4-turbo-preview

# YouTube Data API
YOUTUBE_API_KEY=AIzaSyDzLjA46B4MOnXh2G6vUFNpJzir-LDnkyY

# JWT Authentication
JWT_SECRET=odisha_jobs_super_secret_2025
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_EMAIL=admin@odishajobs.com
ADMIN_PASSWORD=ChangeThisPassword123!

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

⚠️ **Important**: `FIREBASE_SERVICE_ACCOUNT` में पूरा JSON ek line में paste करें!

### 2. Test Firebase Connection

```bash
# Backend folder में जाएं
cd backend

# Test script run करें
node test-firebase.js
```

**Expected Output:**
```
🔥 Testing Firebase Connection...

Test 1: Firestore Database Connection
✅ Firestore connection successful

Test 2: Create Sample Job
✅ Sample job created: abc123xyz

Test 3: Read Job by ID
✅ Job retrieved successfully

Test 4: Update Job
✅ Job updated successfully

Test 5: Get All Jobs
✅ Found 1 active jobs

Test 6: Delete Job
✅ Job deleted successfully

Test 7: Verify Deletion
✅ Job successfully removed from database

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 All Tests Passed!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Firebase Firestore is properly configured
✅ CRUD operations working
✅ Ready for deployment!
```

### 3. Start Backend Server

```bash
npm run dev
```

Should see:
```
✅ Firebase initialized successfully
✅ Firebase Firestore Connected Successfully
✅ Server running on port 5000
```

---

## 🌐 Render Deployment

### Environment Variables

Render Dashboard → Service → Environment → Add Environment Variable

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `5000` | Required |
| `FIREBASE_SERVICE_ACCOUNT` | `{...json...}` | ⚠️ Most Important! |
| `YOUTUBE_API_KEY` | `AIzaSyDzLjA46B4MOnXh2G6vUFNpJzir-LDnkyY` | Already have |
| `JWT_SECRET` | `odisha_jobs_secret_2025` | Any random string |
| `GEMINI_API_KEY` | `your-key` | Get from Google AI Studio |

### Get Gemini API Key (Free)

```
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key
5. Paste in Render environment variables
```

### Deploy Steps

1. Go to Render Dashboard
2. Select your web service
3. Click **"Environment"** tab
4. Add all variables above
5. Click **"Save Changes"**
6. Service will automatically redeploy
7. Wait 2-3 minutes
8. Check logs for: `✅ Firebase initialized successfully`

---

## 📊 View Data in Firestore

### Firestore Console

```
https://console.firebase.google.com/project/gobindatest-9a5ca/firestore
```

**What you'll see:**
- **jobs** collection - All job postings
- Real-time data sync
- Query and filter capabilities
- Manual edit option
- Usage statistics

---

## 🧪 Test API Endpoints

### 1. Health Check
```bash
curl https://your-app.onrender.com/health
```

### 2. Create Job
```bash
curl -X POST https://your-app.onrender.com/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "OPSC Assistant Professor 2024",
    "organization": "Odisha PSC",
    "notificationText": "OPSC invites applications...",
    "category": "government",
    "location": "Odisha",
    "salary": "₹57,700 - ₹1,82,400",
    "lastDate": "2025-02-15",
    "applicationUrl": "https://opsc.gov.in/apply"
  }'
```

### 3. Get All Jobs
```bash
curl https://your-app.onrender.com/api/jobs
```

### 4. Get Featured Jobs
```bash
curl https://your-app.onrender.com/api/jobs/featured
```

---

## ⚠️ Common Issues

### Issue 1: "Firebase initialization error"

**Cause**: FIREBASE_SERVICE_ACCOUNT not set or invalid

**Solution**:
1. Check .env file has the variable
2. Verify JSON is valid: https://jsonlint.com
3. Ensure it's single line (no line breaks)
4. Check quotes are not broken

**Test**:
```bash
node test-firebase.js
```

### Issue 2: "Permission denied" in Firestore

**Cause**: Firestore Security Rules too restrictive

**Solution**:
1. Go to: https://console.firebase.google.com/project/gobindatest-9a5ca/firestore/rules
2. Update rules (for development):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **"Publish"**

### Issue 3: "Module not found: firebase-admin"

**Solution**:
```bash
cd backend
npm install
```

### Issue 4: Backend starts but database empty

**Cause**: Service account doesn't have permissions

**Solution**:
1. Firebase Console → IAM & Admin
2. Find your service account email
3. Add role: **"Firebase Admin"**
4. Save and retry

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── firebase.js         ✅ Firebase config (already set)
│   │   └── database.js         ✅ Firestore connection
│   ├── models/
│   │   └── JobFirestore.js     ✅ Firestore model
│   ├── controllers/
│   │   └── jobController.js    ✅ Updated for Firestore
│   └── ...
├── test-firebase.js            ✅ NEW - Test script
├── .env                        ⚠️ Add SERVICE_ACCOUNT here
└── package.json
```

---

## ✅ Setup Checklist

**Local Development:**
- [ ] Firebase service account JSON downloaded
- [ ] JSON converted to single line
- [ ] Added to `backend/.env` as `FIREBASE_SERVICE_ACCOUNT`
- [ ] AI API key added (Gemini or OpenAI)
- [ ] Ran `node test-firebase.js` - all tests passed
- [ ] Backend starts with `npm run dev`
- [ ] Can create jobs via API
- [ ] Jobs visible in Firestore Console

**Render Deployment:**
- [ ] Render account created
- [ ] GitHub repo connected
- [ ] Web service created
- [ ] Environment variables added:
  - [ ] NODE_ENV=production
  - [ ] PORT=5000
  - [ ] FIREBASE_SERVICE_ACCOUNT
  - [ ] YOUTUBE_API_KEY
  - [ ] GEMINI_API_KEY
  - [ ] JWT_SECRET
- [ ] Service deployed successfully
- [ ] Health check working
- [ ] Test job created via API
- [ ] Job visible in Firestore

**Mobile App:**
- [ ] Backend URL updated in `api_service.dart`
- [ ] APK rebuilt
- [ ] Installed on phone
- [ ] App connects to backend
- [ ] Jobs display correctly

---

## 🎯 Quick Commands

```bash
# Test Firebase connection
node test-firebase.js

# Start development server
npm run dev

# Check if service account is set
echo $FIREBASE_SERVICE_ACCOUNT

# View Firestore data
# Go to: https://console.firebase.google.com/project/gobindatest-9a5ca/firestore
```

---

## 💰 Firebase Free Tier Limits

- **Firestore Reads**: 50,000/day ✅
- **Firestore Writes**: 20,000/day ✅
- **Firestore Deletes**: 20,000/day ✅
- **Storage**: 1 GB ✅
- **Storage Downloads**: 1 GB/day ✅
- **Storage Uploads**: 20,000/day ✅

**Enough for**:
- 📝 10,000+ job postings
- 👥 1,000+ daily active users
- 📄 1,000+ PDF files
- 🖼️ 5,000+ images

---

## 📞 Resources

| Resource | URL |
|----------|-----|
| Firebase Console | https://console.firebase.google.com/project/gobindatest-9a5ca |
| Firestore Database | https://console.firebase.google.com/project/gobindatest-9a5ca/firestore |
| Service Accounts | https://console.firebase.google.com/project/gobindatest-9a5ca/settings/serviceaccounts |
| Storage | https://console.firebase.google.com/project/gobindatest-9a5ca/storage |
| Gemini API | https://makersuite.google.com/app/apikey |
| GitHub Repo | https://github.com/Gobinda988888/goverment-jobs |

---

## 🎉 Summary

**Your Firebase Config**: ✅ Already in code  
**Need Now**: Service Account JSON  
**Steps**: 3 easy steps (download → convert → add to .env)  
**Time**: 5 minutes  
**Result**: Fully working backend with database!

**अब बस Service Account JSON add करना है और deploy करना है!** 🚀
