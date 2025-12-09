# 🎯 Quick Reference - Odisha Jobs App

## 📦 What You Have

✅ **Backend**: Node.js + Express + MongoDB + Firebase Storage  
✅ **Mobile**: Flutter Android app (APK built)  
✅ **Storage**: Firebase for PDFs & images  
✅ **Code**: Pushed to GitHub  
✅ **Docs**: Complete documentation  

---

## 🔗 Important URLs

| Resource | URL |
|----------|-----|
| **GitHub** | https://github.com/Gobinda988888/goverment-jobs.git |
| **Firebase** | https://console.firebase.google.com/project/gobindatest-9a5ca |
| **Render** | https://dashboard.render.com |
| **MongoDB** | https://cloud.mongodb.com |

---

## 🚀 Deploy Now (30 mins)

### 1️⃣ MongoDB Atlas (5 mins)
```
1. Go to: https://cloud.mongodb.com
2. Create free cluster (M0)
3. Create user + password
4. Whitelist: 0.0.0.0/0
5. Get connection string
```

### 2️⃣ Get AI Key (2 mins)
**Gemini (Free)**: https://makersuite.google.com/app/apikey  
**OR**  
**OpenAI (Paid)**: https://platform.openai.com/api-keys

### 3️⃣ Deploy to Render (15 mins)
```
1. Go to: https://render.com
2. New + → Web Service
3. Connect GitHub repo: goverment-jobs
4. Configure:
   - Build: cd backend && npm install
   - Start: cd backend && npm start
5. Add Environment Variables:
   - NODE_ENV=production
   - MONGODB_URI=<paste-from-step-1>
   - YOUTUBE_API_KEY=your_youtube_api_key_here
   - GEMINI_API_KEY=<paste-from-step-2>
   - JWT_SECRET=random_secret_123
6. Create Web Service
7. Wait for deploy
```

### 4️⃣ Update Mobile App (5 mins)
```
1. Edit: mobile/lib/services/api_service.dart
2. Change: baseUrl = 'https://your-app.onrender.com/api'
3. Run: cd mobile && flutter build apk --release
4. APK: mobile/build/app/outputs/flutter-apk/app-release.apk
```

### 5️⃣ Test (3 mins)
```
1. Visit: https://your-app.onrender.com/health
2. Install APK on phone
3. Add test job via API
4. View in mobile app
```

---

## 📝 Add Job via API

**URL**: `POST https://your-app.onrender.com/api/jobs`

**Body**:
```json
{
  "title": "OPSC Assistant Professor 2024",
  "organization": "Odisha PSC",
  "description": "Full description...",
  "category": "government",
  "location": "Odisha",
  "salary": "₹57,700 - ₹1,82,400",
  "lastDate": "2024-12-31",
  "applicationUrl": "https://opsc.gov.in/apply"
}
```

---

## 🔥 Upload Files

**Upload PDF**:
```bash
curl -X POST https://your-app.onrender.com/api/upload/pdf \
  -F "file=@notification.pdf"
```

**Upload Image**:
```bash
curl -X POST https://your-app.onrender.com/api/upload/image \
  -F "file=@logo.png"
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend not starting | Check MongoDB URI in env vars |
| App shows "No jobs" | Database empty - add jobs via API |
| Videos not loading | Check YouTube API key |
| Upload fails | Set Firebase service account (optional) |
| App can't connect | Update baseUrl in api_service.dart |

---

## 📊 API Endpoints

```
GET  /api/jobs              # All jobs
GET  /api/jobs/featured     # Featured jobs
GET  /api/jobs/:id          # Job details
POST /api/jobs              # Create job
GET  /api/jobs/:id/resources # YouTube videos

POST /api/upload/pdf        # Upload PDF
POST /api/upload/image      # Upload image
DELETE /api/upload/file     # Delete file
```

---

## 🎯 Firebase Config

**Project**: `gobindatest-9a5ca`  
**Storage**: `gobindatest-9a5ca.firebasestorage.app`  
**Console**: https://console.firebase.google.com/project/gobindatest-9a5ca

**For Production**: Add `FIREBASE_SERVICE_ACCOUNT` env var  
(Get from Firebase Console → Settings → Service Accounts → Generate Key)

---

## 📱 APK Location

```
mobile/build/app/outputs/flutter-apk/app-release.apk
Size: 22.1 MB
```

**Install**:
1. Transfer to phone
2. Enable "Unknown Sources"
3. Install APK

---

## 📚 Documentation Files

- `README.md` - Project overview
- `PROJECT_SUMMARY.md` - Complete summary ⭐
- `RENDER_DEPLOYMENT.md` - Deployment guide ⭐
- `APK_INSTALLATION_GUIDE.md` - Install APK
- `FIREBASE_API_GUIDE.md` - File upload API ⭐
- `docs/API.md` - Full API docs
- `docs/DEPLOYMENT.md` - Deployment options
- `docs/SETUP.md` - Development setup

⭐ = Most important

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas setup
- [ ] AI API key obtained
- [ ] Backend deployed to Render
- [ ] Environment variables set
- [ ] Backend health check works
- [ ] Mobile app baseUrl updated
- [ ] APK rebuilt with production URL
- [ ] APK installed and tested
- [ ] Test job added via API
- [ ] App displays jobs correctly

---

## 🎉 You're Done!

Backend: **https://your-app.onrender.com**  
Mobile: **app-release.apk** (22.1 MB)  
GitHub: **github.com/Gobinda988888/goverment-jobs**

**Total Time**: ~30-60 minutes to deploy

**Next**: Add real job data and launch! 🚀
