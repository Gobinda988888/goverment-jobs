# APK Installation & Setup Guide

## 🎉 Your APK is Ready!

**Location**: `mobile/build/app/outputs/flutter-apk/app-release.apk` (22.1MB)

## 📱 Installation Steps

### 1. Transfer APK to Your Phone
- Connect your Android phone to the computer via USB
- Copy `app-release.apk` to your phone's Downloads folder
- Or use cloud storage (Google Drive, Dropbox) to transfer

### 2. Install the APK
1. On your Android phone, go to **Settings > Security**
2. Enable **"Install from Unknown Sources"** or **"Allow from this source"**
3. Open the APK file from your Downloads folder
4. Tap **Install**
5. Once installed, you can disable "Unknown Sources" for security

## 🖥️ Running the Backend Server

The mobile app needs the backend server to be running to fetch job data.

### Option 1: Local Testing (Your Computer)
```bash
cd backend
npm install
npm run dev
```
- Backend runs on: `http://localhost:5000`
- For Android emulator: The app is configured to use `http://10.0.2.2:5000/api`
- For physical phone: You need to update the API URL (see below)

### Option 2: Deploy Backend to Cloud (Recommended for Production)

#### Deploy to Render.com (Free):
1. Go to https://render.com and create account
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
5. Add environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your-mongodb-atlas-uri>`
   - `OPENAI_API_KEY=<your-openai-key>`
   - `YOUTUBE_API_KEY=AIzaSyDzLjA46B4MOnXh2G6vUFNpJzir-LDnkyY`
6. Click **"Create Web Service"**

Your backend will be deployed at: `https://your-app-name.onrender.com`

## 🔄 Update Mobile App to Use Production API

If you deploy backend to cloud, update the API URL in the mobile app:

1. Open `mobile/lib/services/api_service.dart`
2. Change line 6:
   ```dart
   static const String baseUrl = 'https://your-app-name.onrender.com/api';
   ```
3. Rebuild APK:
   ```bash
   cd mobile
   flutter build apk --release
   ```

## 📊 MongoDB Setup

You need a MongoDB database for the backend:

### Option 1: MongoDB Atlas (Free Cloud Database)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (free tier M0)
4. Go to **Database Access** → Create database user
5. Go to **Network Access** → Add IP Address (0.0.0.0/0 for development)
6. Go to **Databases** → Connect → Connect your application
7. Copy the connection string
8. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/odisha-jobs?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB
```bash
# Install MongoDB locally
# Then update backend/.env:
MONGODB_URI=mongodb://localhost:27017/odisha-jobs
```

## 🔑 API Keys Required

Your backend `.env` file should have:

```env
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=your-mongodb-uri

# AI Service (Choose one)
OPENAI_API_KEY=your-openai-key
# OR
GEMINI_API_KEY=your-gemini-key

# YouTube API (Already configured)
YOUTUBE_API_KEY=AIzaSyDzLjA46B4MOnXh2G6vUFNpJzir-LDnkyY

# JWT Secret (for authentication - optional for now)
JWT_SECRET=your-secret-key-here
```

### Get API Keys:
- **OpenAI**: https://platform.openai.com/api-keys (Paid)
- **Gemini**: https://makersuite.google.com/app/apikey (Free tier available)
- **YouTube**: Already provided (AIzaSyDzLjA46B4MOnXh2G6vUFNpJzir-LDnkyY)

## 🚀 Testing the Complete Setup

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   Should show: "✅ Server running on port 5000"

2. **Install APK** on your Android phone

3. **Test the App**:
   - Open "Odisha Jobs App"
   - You should see job listings
   - Click on a job to see details
   - Check if YouTube videos load

4. **If App Shows Errors**:
   - Make sure backend is running
   - Check if your phone can reach the backend:
     - Same WiFi network for local testing
     - Or use deployed backend URL

## 📝 Next Steps

1. ✅ APK Built Successfully
2. ⬜ Set up MongoDB database
3. ⬜ Get OpenAI/Gemini API key
4. ⬜ Deploy backend to Render.com
5. ⬜ Update mobile app with production API URL
6. ⬜ Add job data to database (use backend API endpoints)
7. ⬜ Test complete flow on physical device

## 🐛 Troubleshooting

### App shows "No jobs found"
- Backend not running or not accessible
- Database is empty (add some jobs via API)
- Network connectivity issues

### "Connection failed" errors
- Check if backend URL is correct in `api_service.dart`
- For local testing: Phone must be on same WiFi as computer
- For production: Backend must be deployed and accessible

### Videos not loading
- Check YouTube API key is valid
- Check API quota (YouTube API has daily limits)

## 📞 Support

Check the main `README.md` and `docs/` folder for more detailed documentation.

---

**Congratulations!** 🎉 Your Odisha Jobs App is ready to use!
