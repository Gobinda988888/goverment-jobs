# 🚀 Render Setup Guide - Step by Step

## पूरा Render Setup Guide (हिंदी में)

इस guide को follow करके आप अपना backend Render पर deploy कर सकते हैं।

---

## Step 1: Render Account बनाएं (2 minutes)

### 1.1 Render Website खोलें
- Browser में जाएं: **https://render.com**
- ऊपर right में **"Sign Up"** या **"Get Started"** button पर click करें

### 1.2 Account Create करें
आपके पास 3 options हैं:

**Option A: GitHub से Sign Up (Recommended) ✅**
1. **"Sign up with GitHub"** button पर click करें
2. अपना GitHub username और password डालें
3. **"Authorize Render"** पर click करें
4. ✅ Done! Account बन गया

**Option B: GitLab से Sign Up**
1. **"Sign up with GitLab"** button पर click करें
2. GitLab credentials डालें
3. Authorize करें

**Option C: Email से Sign Up**
1. अपना email address डालें
2. Password set करें (strong password बनाएं)
3. **"Sign Up"** पर click करें
4. Email verification link check करें
5. Email में आया link click करें

---

## Step 2: GitHub Repository Connect करें (3 minutes)

### 2.1 Dashboard खोलें
- Sign in करने के बाद आप Render Dashboard पर पहुंच जाएंगे
- URL होगा: `https://dashboard.render.com`

### 2.2 New Web Service बनाएं
1. Dashboard में ऊपर right corner में **"New +"** button दिखेगा
2. **"New +"** पर click करें
3. Dropdown menu में से **"Web Service"** select करें

### 2.3 Repository Connect करें

**अगर पहली बार GitHub connect कर रहे हैं:**

1. **"Connect account"** button दिखेगा - उस पर click करें
2. GitHub authorization page खुलेगा
3. **"Authorize Render"** पर click करें
4. अपना GitHub password डालें (अगर पूछे)

**Repository Select करें:**

1. आपको repositories की list दिखेगी
2. Search box में type करें: **"goverment-jobs"**
3. या scroll करके **"Gobinda988888/goverment-jobs"** find करें
4. Repository के सामने **"Connect"** button पर click करें

---

## Step 3: Web Service Configure करें (5 minutes)

अब एक form खुलेगा जहां आपको service configure करनी है।

### 3.1 Basic Settings

**Name** (सबसे ऊपर):
```
odisha-jobs-backend
```
या कोई भी नाम जो आपको पसंद हो (spaces नहीं, lowercase recommended)

**Region** (Location):
- Dropdown से select करें: **"Singapore"** (भारत के सबसे नजदीक)
- या: **"Frankfurt"** (Europe)
- Free tier में सभी regions available हैं

**Branch**:
```
main
```
(यह already selected होगा)

**Root Directory**:
```
(खाली छोड़ दें - Leave Empty)
```

### 3.2 Build & Start Commands

**Runtime**:
- Dropdown से select करें: **"Node"**

**Build Command**:
```bash
cd backend && npm install
```
यह command backend folder में जाकर सभी packages install करेगा।

**Start Command**:
```bash
cd backend && npm start
```
यह command server को start करेगा।

### 3.3 Instance Type (Plan Selection)

**Free** plan select करें:
- "Free" option पर click करें
- Free plan में आपको मिलता है:
  - ✅ 750 hours/month (एक service के लिए काफी है)
  - ✅ 512 MB RAM
  - ✅ Shared CPU
  - ⚠️ Limitation: 15 minutes inactivity के बाद service sleep होती है
  - ⚠️ First request के time 30-60 seconds लग सकते हैं

**Paid Plan (Optional - $7/month)**:
- अगर आप चाहें तो "Starter" plan ले सकते हैं
- Benefits:
  - ✅ No sleep/spin down
  - ✅ Fast response
  - ✅ 512 MB RAM
  - ✅ Better performance

---

## Step 4: Environment Variables Add करें (10 minutes)

यह सबसे important step है। सभी configuration यहां set होती है।

### 4.1 Advanced Settings खोलें

Form में नीचे scroll करें और **"Advanced"** button पर click करें।

### 4.2 Environment Variables Add करें

**"Add Environment Variable"** button पर click करके ये सभी variables add करें:

---

#### Variable 1: NODE_ENV
```
Key: NODE_ENV
Value: production
```
यह server को production mode में run करेगा।

---

#### Variable 2: PORT
```
Key: PORT
Value: 5000
```
Server इस port पर run होगा।

---

#### Variable 3: MONGODB_URI ⚠️ Important

```
Key: MONGODB_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/odisha-jobs
```

**यह कैसे पाएं? (10 minutes का process)**

**MongoDB Atlas Setup:**

1. **MongoDB Atlas खोलें**: https://www.mongodb.com/cloud/atlas
2. **Sign Up करें** (अगर account नहीं है)
   - Google से sign in करें (fastest)
   - या Email से signup करें

3. **Create Cluster**:
   - "Create" button पर click करें
   - **"M0 FREE"** plan select करें (no credit card needed)
   - Cloud Provider: **AWS**
   - Region: **Mumbai (ap-south-1)** या **Singapore**
   - Cluster Name: `odisha-jobs-cluster`
   - **"Create Cluster"** पर click करें
   - Wait करें (2-3 minutes)

4. **Database User Create करें**:
   - Left menu में **"Database Access"** पर click करें
   - **"Add New Database User"** button पर click करें
   - **Username**: `odishajobs` (या कोई भी)
   - **Password**: Strong password बनाएं (save कर लें!) 
     - Example: `OdishaJobs@2024`
   - **Database User Privileges**: "Read and write to any database"
   - **"Add User"** पर click करें

5. **Network Access Setup करें**:
   - Left menu में **"Network Access"** पर click करें
   - **"Add IP Address"** button पर click करें
   - **"Allow Access from Anywhere"** पर click करें
   - IP: `0.0.0.0/0` (automatically fill होगा)
   - **"Confirm"** पर click करें

6. **Connection String पाएं**:
   - Left menu में **"Database"** पर click करें
   - अपने cluster के सामने **"Connect"** button पर click करें
   - **"Connect your application"** option choose करें
   - **Driver**: Node.js
   - **Version**: 5.5 or later
   - Connection string copy करें, यह कुछ ऐसा होगा:
     ```
     mongodb+srv://odishajobs:<password>@odisha-jobs-cluster.abc123.mongodb.net/?retryWrites=true&w=majority
     ```
   - `<password>` को अपने actual password से replace करें
   - `/?retryWrites` से पहले database name add करें: `/odisha-jobs`
   
   **Final connection string example**:
   ```
   mongodb+srv://odishajobs:OdishaJobs@2024@odisha-jobs-cluster.abc123.mongodb.net/odisha-jobs?retryWrites=true&w=majority
   ```

7. **Render में paste करें**:
   - Render के Environment Variables section में
   - `MONGODB_URI` के Value में यह connection string paste करें

---

#### Variable 4: YOUTUBE_API_KEY ✅ Already Have

```
Key: YOUTUBE_API_KEY
Value: AIzaSyDzLjA46B4MOnXh2G6vUFNpJzir-LDnkyY
```
यह already आपके पास है, directly paste करें।

---

#### Variable 5: JWT_SECRET

```
Key: JWT_SECRET
Value: odisha_jobs_super_secret_key_2025_gobinda
```
कोई भी random string डाल सकते हैं (जितना complex उतना बेहतर)।

---

#### Variable 6: AI API Key (Choose One) ⚠️ Important

**Option A: Gemini API (Recommended - FREE)** ✅

```
Key: GEMINI_API_KEY
Value: [आपकी Gemini API key]
```

**Gemini API Key कैसे पाएं?**

1. Browser में जाएं: https://makersuite.google.com/app/apikey
2. Google account से sign in करें
3. **"Create API Key"** button पर click करें
4. Project select करें (या new project बनाएं)
5. API key automatically generate होगी
6. Copy करें और Render में paste करें
7. ✅ Free tier में 60 requests/minute मिलते हैं

**Option B: OpenAI API (Paid - बेहतर quality)**

```
Key: OPENAI_API_KEY
Value: sk-...
```

**OpenAI API Key कैसे पाएं?**

1. Browser में जाएं: https://platform.openai.com/api-keys
2. OpenAI account बनाएं (या sign in करें)
3. Email verify करें
4. **"Create new secret key"** पर click करें
5. Name दें (optional): "Odisha Jobs Backend"
6. Key copy करें (यह फिर से नहीं दिखेगी!)
7. Render में paste करें
8. ⚠️ Credit card add करना होगा
9. ⚠️ Minimum $5 deposit करना होगा
10. Cost: लगभग $0.002 per AI request

**Recommendation**: Gemini से start करें (free है), बाद में OpenAI पर switch कर सकते हैं।

---

#### Variable 7: OPENAI_MODEL (Only if using OpenAI)

```
Key: OPENAI_MODEL
Value: gpt-4-turbo-preview
```
(OpenAI use कर रहे हैं तो only)

---

#### Variable 8: FIREBASE_SERVICE_ACCOUNT (Optional - बाद में add कर सकते हैं)

```
Key: FIREBASE_SERVICE_ACCOUNT
Value: [JSON string - अभी skip करें]
```

**Firebase Service Account कैसे setup करें? (Optional)**

1. Firebase Console खोलें: https://console.firebase.google.com
2. अपना project select करें: `gobindatest-9a5ca`
3. ⚙️ **Settings** icon → **"Project settings"**
4. **"Service accounts"** tab पर click करें
5. **"Generate new private key"** button पर click करें
6. Warning आएगी - **"Generate key"** पर click करें
7. JSON file download होगी
8. File open करें
9. सारा JSON content copy करें
10. Online tool से single line बनाएं: https://www.text-utils.com/json-formatter/
11. Render में paste करें

**⚠️ अभी के लिए skip करें** - File upload बाद में setup करेंगे।

---

### 4.3 Final Environment Variables Check

सभी variables add करने के बाद check करें:

✅ NODE_ENV = production  
✅ PORT = 5000  
✅ MONGODB_URI = mongodb+srv://...  
✅ YOUTUBE_API_KEY = AIzaSy...  
✅ JWT_SECRET = odisha_jobs...  
✅ GEMINI_API_KEY = AIzaSy... (या OPENAI_API_KEY)  
⬜ FIREBASE_SERVICE_ACCOUNT (optional - skip for now)

---

## Step 5: Deploy करें! (5 minutes)

### 5.1 Create Web Service

सबकुछ configure करने के बाद:

1. Page के सबसे नीचे scroll करें
2. बड़ा blue button दिखेगा: **"Create Web Service"**
3. उस पर click करें

### 5.2 Deployment Wait करें

अब deployment process शुरू होगी:

1. Screen पर logs दिखने लगेंगे
2. आपको दिखेगा:
   ```
   ==> Cloning from https://github.com/Gobinda988888/goverment-jobs...
   ==> Checking out commit fd7337c in branch main
   ==> Running build command 'cd backend && npm install'...
   ==> Installing dependencies...
   ==> Build successful!
   ==> Starting service with 'cd backend && npm start'...
   ```

3. Wait करें: **3-5 minutes** लगेंगे

4. Success message आएगा:
   ```
   ==> Your service is live 🎉
   ```

### 5.3 Service URL पाएं

1. Dashboard में service name के नीचे URL दिखेगा
2. Example: `https://odisha-jobs-backend.onrender.com`
3. यह आपका backend URL है! 🎉

---

## Step 6: Test करें (2 minutes)

### 6.1 Health Check Test

1. अपना service URL copy करें
2. Browser में open करें: `https://odisha-jobs-backend.onrender.com/health`
3. आपको यह दिखना चाहिए:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "timestamp": "2024-12-09T10:30:00.000Z",
     "uptime": 45.123
   }
   ```

✅ अगर यह दिखा तो backend **successfully deployed** है!

### 6.2 API Test

Browser में try करें:
```
https://odisha-jobs-backend.onrender.com/api/jobs
```

Response (अभी empty array आएगा क्योंकि database खाली है):
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

✅ Perfect! Backend काम कर रहा है!

---

## Step 7: Mobile App Update करें (5 minutes)

अब mobile app को इस backend से connect करना है।

### 7.1 API Service File खोलें

1. VS Code या कोई editor open करें
2. File खोलें: `C:\Users\GOBINDA\Desktop\tosi\mobile\lib\services\api_service.dart`

### 7.2 Base URL Update करें

File में line 6 पर जाएं और change करें:

**पुराना (Before)**:
```dart
static const String baseUrl = 'http://10.0.2.2:5000/api';
```

**नया (After)**:
```dart
static const String baseUrl = 'https://odisha-jobs-backend.onrender.com/api';
```

⚠️ अपने actual Render URL से replace करें!

### 7.3 Save करें

File को save करें: `Ctrl + S`

---

## Step 8: APK Rebuild करें (5 minutes)

### 8.1 Terminal/PowerShell खोलें

1. Windows में PowerShell open करें
2. या VS Code में Terminal खोलें

### 8.2 Mobile Folder में जाएं

```bash
cd C:\Users\GOBINDA\Desktop\tosi\mobile
```

### 8.3 Dependencies Get करें

```bash
flutter pub get
```

Wait करें (30 seconds)

### 8.4 APK Build करें

```bash
flutter build apk --release
```

Wait करें (2-3 minutes)

Success message:
```
✓ Built build\app\outputs\flutter-apk\app-release.apk (22.1MB)
```

### 8.5 New APK Location

```
C:\Users\GOBINDA\Desktop\tosi\mobile\build\app\outputs\flutter-apk\app-release.apk
```

यह नया APK अब आपके live backend से connect होगा! 🎉

---

## Step 9: APK Install और Test करें

### 9.1 APK को Phone में Transfer करें

**Method 1: USB Cable**
1. Phone को USB से connect करें
2. File transfer mode enable करें
3. `app-release.apk` को phone की Downloads folder में copy करें

**Method 2: Cloud (Google Drive/Dropbox)**
1. APK को Google Drive में upload करें
2. Phone में Drive open करें
3. APK download करें

### 9.2 APK Install करें

1. Phone में Downloads folder खोलें
2. `app-release.apk` पर tap करें
3. **"Install Unknown Apps"** permission की warning आएगी
4. **"Settings"** पर tap करें
5. **"Allow from this source"** enable करें
6. Back करें और फिर से APK पर tap करें
7. **"Install"** पर tap करें
8. Wait करें (1 minute)
9. ✅ **"Open"** पर tap करें

### 9.3 App Test करें

App open होने पर:

1. ⏳ Loading indicator दिखेगा (first time 30-60 seconds लग सकते हैं - Render spin up हो रहा है)
2. "No jobs found" दिखेगा (क्योंकि database empty है)
3. ✅ अगर यह दिखा तो app सही से backend से connect हो रहा है!

---

## Step 10: Test Job Add करें (Optional)

अब एक test job database में add करते हैं।

### 10.1 Postman/Thunder Client Install करें

**Option A: Postman (Popular)**
1. Download: https://www.postman.com/downloads/
2. Install करें

**Option B: Thunder Client (VS Code Extension)**
1. VS Code में Extensions खोलें
2. "Thunder Client" search करें
3. Install करें

**Option C: cURL (Command Line)**
Terminal/PowerShell से directly

### 10.2 Test Job POST करें

**Postman में:**

1. New Request बनाएं
2. Method: **POST**
3. URL: `https://odisha-jobs-backend.onrender.com/api/jobs`
4. Headers tab:
   - Key: `Content-Type`
   - Value: `application/json`
5. Body tab:
   - Select: **raw**
   - Format: **JSON**
6. Body में paste करें:

```json
{
  "title": "OPSC Civil Services Examination 2024",
  "organization": "Odisha Public Service Commission",
  "description": "OPSC invites applications for Civil Services Examination 2024. Candidates with Graduate degree from recognized university are eligible to apply.",
  "category": "government",
  "location": "Odisha",
  "salary": "₹56,100 - ₹2,00,000",
  "vacancies": 125,
  "lastDate": "2025-01-15",
  "notificationUrl": "https://opsc.gov.in/notification",
  "applicationUrl": "https://opsc.gov.in/apply",
  "eligibility": ["Graduate Degree", "Age 21-38 years", "Indian Citizen"],
  "importantDates": {
    "notificationDate": "2024-12-01",
    "applicationStart": "2024-12-10",
    "applicationEnd": "2025-01-15",
    "examDate": "2025-03-15"
  }
}
```

7. **Send** button पर click करें

**cURL Command:**
```bash
curl -X POST https://odisha-jobs-backend.onrender.com/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "OPSC Civil Services Examination 2024",
    "organization": "Odisha Public Service Commission",
    "description": "OPSC invites applications for Civil Services Examination 2024.",
    "category": "government",
    "location": "Odisha",
    "salary": "₹56,100 - ₹2,00,000",
    "lastDate": "2025-01-15",
    "applicationUrl": "https://opsc.gov.in/apply"
  }'
```

### 10.3 Response Check करें

Success response:
```json
{
  "success": true,
  "data": {
    "_id": "657abc123...",
    "title": "OPSC Civil Services Examination 2024",
    "organization": "Odisha Public Service Commission",
    ...
  }
}
```

✅ Job successfully created!

### 10.4 Mobile App में Check करें

1. App को restart करें (close and reopen)
2. या Pull to refresh करें
3. अब job card दिखेगा! 🎉
4. Job पर tap करें - details screen खुलेगा
5. ✅ Perfect! Everything working!

---

## 🎉 Congratulations! Setup Complete!

आपका पूरा application अब live है:

✅ **Backend**: https://odisha-jobs-backend.onrender.com  
✅ **Database**: MongoDB Atlas (Connected)  
✅ **AI Service**: Gemini/OpenAI (Working)  
✅ **Mobile App**: APK installed and connected  
✅ **GitHub**: Code pushed and synced  

---

## 📊 Render Dashboard समझें

### Dashboard Features:

1. **Logs**:
   - Real-time server logs देखें
   - Errors और warnings track करें
   - Click: Service → Logs tab

2. **Metrics**:
   - CPU usage
   - Memory usage
   - Request count
   - Click: Service → Metrics tab

3. **Events**:
   - Deployment history
   - Service restarts
   - Configuration changes
   - Click: Service → Events tab

4. **Environment**:
   - Variables edit करें
   - New variables add करें
   - Click: Service → Environment tab

5. **Settings**:
   - Service name change करें
   - Instance type upgrade करें
   - Auto-deploy on/off करें
   - Click: Service → Settings tab

---

## 🔄 Auto-Deploy Setup (Bonus)

हर बार जब आप GitHub पर code push करें, automatic deploy हो:

### Already Enabled! ✅

Render automatically GitHub repository को watch कर रहा है।

**Test करें:**

1. कोई भी file में छोटा change करें
2. Git commit और push करें:
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```
3. Render dashboard में Events tab check करें
4. Automatic deployment शुरू हो जाएगी! 🚀

---

## ⚠️ Common Issues और Solutions

### Issue 1: "Service Unavailable" (503 Error)

**Reason**: Free tier service sleep में चली गई है (15 min inactivity)

**Solution**: 
- 30-60 seconds wait करें
- Service automatically wake up होगी
- Page refresh करें

**Prevention**:
- Paid plan लें ($7/month - no sleep)
- या Cron job setup करें (हर 10 minutes ping करे)

---

### Issue 2: Database Connection Failed

**Symptoms**: 
- Backend logs में "MongoServerError" दिख रहा है
- Jobs load नहीं हो रहे

**Solution**:
1. MongoDB Atlas खोलें
2. Network Access check करें - `0.0.0.0/0` whitelisted है?
3. Database User check करें - correct username/password?
4. Connection string check करें - password special characters escaped हैं?
5. Render Environment variables में MONGODB_URI correct है?

**Fix Steps**:
1. Render Dashboard → Service → Environment
2. MONGODB_URI edit करें
3. Correct connection string paste करें
4. Save करें (service automatically redeploy होगी)

---

### Issue 3: AI Processing Not Working

**Symptoms**:
- Jobs create हो रहे हैं लेकिन AI summary नहीं बन रहा

**Solution**:
1. Check API key valid है या नहीं
2. Gemini: https://makersuite.google.com/app/apikey
3. OpenAI: https://platform.openai.com/api-keys
4. API quota check करें (free limit exceed तो नहीं?)

**Fix**:
1. New API key generate करें
2. Render Environment में update करें
3. Service redeploy होगी

---

### Issue 4: Mobile App Shows "No Jobs"

**Possible Reasons**:

1. **Backend URL Wrong**:
   - Check: `mobile/lib/services/api_service.dart`
   - Correct URL hai? `https://` included hai?
   - Rebuild APK: `flutter build apk --release`

2. **Database Empty**:
   - कोई job add नहीं किया अभी तक
   - Postman से POST `/api/jobs` करें

3. **Backend Sleep में है**:
   - Browser में `/health` endpoint खोलें
   - Wait करें 60 seconds
   - App में retry करें

4. **Network Error**:
   - Phone internet connected है?
   - Firewall block तो नहीं कर रहा?

---

### Issue 5: Deployment Failed

**Symptoms**: 
- Build fails with error
- Logs में red error messages

**Common Errors**:

**A. "Module not found"**
```
Error: Cannot find module 'express'
```
**Solution**:
- `package.json` में dependency missing है
- Local पर test करें: `cd backend && npm install && npm start`
- Working हो तो git push करें

**B. "Port already in use"**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
- Local server बंद करें
- Render पर यह issue नहीं आना चाहिए
- Environment में PORT=5000 check करें

**C. "Build command failed"**
```
Error: Command 'cd backend && npm install' failed
```
**Solution**:
- Build command check करें
- Should be: `cd backend && npm install`
- Space और spelling verify करें

---

## 🔧 Advanced Settings (Optional)

### Custom Domain Add करें

अपना domain connect करें (जैसे: `api.odishajobs.com`)

**Steps**:
1. Domain buy करें (GoDaddy, Namecheap, etc.)
2. Render Dashboard → Service → Settings
3. **"Custom Domains"** section में जाएं
4. **"Add Custom Domain"** click करें
5. अपना domain enter करें: `api.odishajobs.com`
6. DNS records update करें (Render instructions देगा):
   - Type: `CNAME`
   - Name: `api`
   - Value: `odisha-jobs-backend.onrender.com`
7. Wait करें (15-30 minutes)
8. ✅ SSL automatically setup हो जाएगा

---

### Upgrade to Paid Plan

Free tier से upgrade करना है:

1. Dashboard → Service → Settings
2. **"Instance Type"** section
3. **"Change"** button click करें
4. **"Starter"** plan select करें ($7/month)
5. Payment method add करें
6. **"Upgrade"** click करें

**Benefits**:
- ✅ No sleep (24/7 running)
- ✅ Faster response times
- ✅ Better performance
- ✅ Priority support

---

## 📞 Support और Resources

### Render Documentation
- https://render.com/docs

### Render Community
- https://community.render.com

### Render Status
- https://status.render.com (downtime check करें)

### Your Project Links

| Resource | URL |
|----------|-----|
| **Backend (Render)** | https://odisha-jobs-backend.onrender.com |
| **GitHub Repo** | https://github.com/Gobinda988888/goverment-jobs |
| **Firebase Console** | https://console.firebase.google.com/project/gobindatest-9a5ca |
| **MongoDB Atlas** | https://cloud.mongodb.com |

---

## ✅ Final Checklist

Setup complete करने के लिए verify करें:

- [ ] Render account बन गया
- [ ] GitHub repository connected
- [ ] Web service created
- [ ] सभी environment variables added:
  - [ ] NODE_ENV
  - [ ] PORT
  - [ ] MONGODB_URI
  - [ ] YOUTUBE_API_KEY
  - [ ] JWT_SECRET
  - [ ] GEMINI_API_KEY या OPENAI_API_KEY
- [ ] Service successfully deployed
- [ ] Health check working (`/health`)
- [ ] MongoDB Atlas setup complete
- [ ] Database user created
- [ ] IP whitelisted (0.0.0.0/0)
- [ ] Mobile app `api_service.dart` updated
- [ ] New APK built with production URL
- [ ] APK installed on phone
- [ ] App successfully connects to backend
- [ ] Test job added via API
- [ ] Job visible in mobile app

✅ **All Done!** Your app is now LIVE! 🎉

---

## 🚀 What's Next?

### 1. Add More Jobs
- Use Postman/API to add real government job listings
- या admin panel बना सकते हैं (future feature)

### 2. Share APK
- WhatsApp, Telegram पर share करें
- या Google Play Store पर publish करें

### 3. Monitor Usage
- Render Dashboard से usage check करें
- MongoDB से database size track करें

### 4. Collect Feedback
- Users से feedback लें
- Bugs fix करें
- New features add करें

### 5. Marketing
- Social media पर promote करें
- Job groups में share करें
- SEO optimize करें

**Good Luck! 🍀**

---

**Questions? Issues?**
- Check documentation files in project
- या Render/MongoDB community forum में पूछें
