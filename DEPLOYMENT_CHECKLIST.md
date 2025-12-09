# ✅ Quick Deployment Checklist

## 🚀 15-Minute Deployment

Follow this checklist step-by-step:

---

### □ Step 1: Firebase Service Account (5 min)

1. □ Go to: https://console.firebase.google.com/project/gobindatest-9a5ca/settings/serviceaccounts
2. □ Click "Generate new private key"
3. □ Download JSON file
4. □ Convert to single line: https://www.text-utils.com/json-formatter/
5. □ Copy single-line JSON (save in notepad)

---

### □ Step 2: Gemini API Key (2 min)

1. □ Go to: https://makersuite.google.com/app/apikey
2. □ Sign in with Google
3. □ Click "Create API Key"
4. □ Copy key (save in notepad)

---

### □ Step 3: Render Account (2 min)

1. □ Go to: https://render.com
2. □ Click "Get Started"
3. □ Sign up with GitHub
4. □ Authorize Render

---

### □ Step 4: Create Web Service (3 min)

1. □ Click "New +" → "Web Service"
2. □ Connect GitHub account
3. □ Select repository: "goverment-jobs"
4. □ Click "Connect"

---

### □ Step 5: Configure Service (2 min)

**Basic:**
- □ Name: `odisha-jobs-backend`
- □ Region: `Singapore`
- □ Branch: `main`
- □ Runtime: `Node`
- □ Build: `cd backend && npm install`
- □ Start: `cd backend && npm start`
- □ Instance: `Free`

**Click "Advanced" ⬇️**

---

### □ Step 6: Environment Variables (5 min)

Add these 6 variables:

1. □ `NODE_ENV` = `production`
2. □ `PORT` = `5000`
3. □ `FIREBASE_SERVICE_ACCOUNT` = `{paste JSON from Step 1}`
4. □ `GEMINI_API_KEY` = `{paste key from Step 2}`
5. □ `YOUTUBE_API_KEY` = `AIzaSyDzLjA46B4MOnXh2G6vUFNpJzir-LDnkyY`
6. □ `JWT_SECRET` = `odisha_jobs_secret_2025`

---

### □ Step 7: Deploy (5 min)

1. □ Click "Create Web Service"
2. □ Wait 3-5 minutes
3. □ See "Your service is live 🎉"
4. □ Copy your URL: `https://your-app.onrender.com`

---

### □ Step 8: Verify (2 min)

1. □ Open: `https://your-app.onrender.com/health`
2. □ See: `{"success": true, "message": "Server is running"}`
3. □ Open: `https://your-app.onrender.com/api/jobs`
4. □ See: `{"success": true, "count": 0, "data": []}`

✅ Both working? **Backend is live!**

---

### □ Step 9: Update Mobile App (5 min)

1. □ Open: `mobile/lib/services/api_service.dart`
2. □ Change line 6: `baseUrl = 'https://your-app.onrender.com/api'`
3. □ Save file
4. □ Run: `cd mobile`
5. □ Run: `flutter pub get`
6. □ Run: `flutter build apk --release`
7. □ Wait 2-3 minutes
8. □ APK ready: `mobile/build/app/outputs/flutter-apk/app-release.apk`

---

### □ Step 10: Install & Test (3 min)

1. □ Transfer APK to phone
2. □ Install APK
3. □ Open app
4. □ Wait 60 seconds (first load)
5. □ See "No jobs found" message

✅ यह दिखा? **App working!**

---

### □ Step 11: Add Test Job (2 min)

**PowerShell Command:**
```powershell
$body = @{
    title = "OPSC Civil Services 2024"
    organization = "Odisha PSC"
    notificationText = "Test notification"
    category = "government"
    location = "Odisha"
    salary = "₹56,100 - ₹2,00,000"
    lastDate = "2025-01-15"
    applicationUrl = "https://opsc.gov.in/apply"
    status = "active"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-app.onrender.com/api/jobs" -Method POST -Body $body -ContentType "application/json"
```

1. □ Replace `your-app` with actual URL
2. □ Run command in PowerShell
3. □ See success response

---

### □ Step 12: Verify in App (1 min)

1. □ Open mobile app
2. □ Pull down to refresh
3. □ See job card
4. □ Tap on job
5. □ See details screen

✅ Job दिखा? **Everything working!**

---

## 🎉 Deployment Complete!

### ✅ What's Live:

- ✅ Backend API: `https://your-app.onrender.com`
- ✅ Database: Firebase Firestore
- ✅ Storage: Firebase Storage
- ✅ Mobile App: Installed on phone
- ✅ Auto-deploy: Enabled

### 📊 Stats:

- ⏱️ **Time Taken**: ~15-20 minutes
- 💰 **Cost**: $0/month (free tier)
- 📱 **Status**: Production ready
- 🔄 **Auto-updates**: Yes

### 🔗 Important Links:

Save these URLs:

- **Backend**: https://your-app.onrender.com
- **Render Dashboard**: https://dashboard.render.com
- **Firebase Console**: https://console.firebase.google.com/project/gobindatest-9a5ca
- **Firestore Data**: https://console.firebase.google.com/project/gobindatest-9a5ca/firestore
- **GitHub Repo**: https://github.com/Gobinda988888/goverment-jobs

---

## 📱 Next Steps:

### Add More Jobs:
```powershell
# Same PowerShell command, change title/organization/etc
$body = @{...} | ConvertTo-Json
Invoke-RestMethod -Uri "https://your-app.onrender.com/api/jobs" -Method POST -Body $body -ContentType "application/json"
```

### Share App:
- WhatsApp: Share APK file
- Drive: Upload and share link
- Play Store: Publish (optional)

### Monitor:
- Render Logs: Check for errors
- Firestore Console: View all jobs
- Mobile App: Test regularly

---

## ⚠️ Common Issues:

| Issue | Solution |
|-------|----------|
| 503 Error | Wait 60 sec (free tier sleeps) |
| App won't connect | Check backend URL in api_service.dart |
| Jobs not saving | Verify FIREBASE_SERVICE_ACCOUNT in Render |
| Slow first load | Normal for free tier (spins up on request) |

---

## 💪 Upgrade Options:

### Render Starter ($7/month):
- No sleep/spin down
- Faster response
- Better for production

### Firebase Blaze (Pay-as-you-go):
- Higher limits
- More storage
- Advanced features

But **free tier is enough** for testing and initial launch! 🎯

---

**Congratulations! Your app is LIVE! 🚀🎉**
