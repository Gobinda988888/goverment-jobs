# 🔧 Setup Guide

Complete setup instructions for Odisha Government Jobs application.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MongoDB** (local or Atlas account) ([Download](https://www.mongodb.com/try/download/community))
- **Flutter SDK** 3.0 or higher ([Install Guide](https://docs.flutter.dev/get-started/install))
- **Git** ([Download](https://git-scm.com/))
- **VS Code** or Android Studio (recommended)

### API Keys
You'll need to obtain these API keys:
1. **OpenAI API Key** - [Get it here](https://platform.openai.com/api-keys)
   - OR **Google Gemini API Key** - [Get it here](https://makersuite.google.com/app/apikey)
2. **YouTube Data API v3 Key** - [Get it here](https://console.cloud.google.com/apis/credentials)

---

## 🔙 Backend Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/odisha-jobs-app.git
cd odisha-jobs-app/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- Express.js
- Mongoose
- OpenAI SDK
- Axios (for YouTube API)
- And all other dependencies

### Step 3: Configure Environment Variables
```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/odisha-jobs
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/odisha-jobs

# OpenAI
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# YouTube Data API
YOUTUBE_API_KEY=AIza-your-youtube-key-here

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Admin Credentials (change these!)
ADMIN_EMAIL=admin@odishajobs.com
ADMIN_PASSWORD=ChangeThisPassword123!
```

### Step 4: Start MongoDB
**Option A - Local MongoDB:**
```bash
# Windows
mongod --dbpath C:\data\db

# Mac/Linux
sudo mongod
```

**Option B - MongoDB Atlas:**
- Already running in cloud, just use connection string

### Step 5: Start Development Server
```bash
npm run dev
```

You should see:
```
🚀 Server started on http://localhost:5000
MongoDB Connected: localhost
```

### Step 6: Test API
Open browser and visit:
- http://localhost:5000 - API info
- http://localhost:5000/health - Health check
- http://localhost:5000/api/jobs - Jobs endpoint

Or use cURL:
```bash
curl http://localhost:5000/health
```

---

## 📱 Flutter App Setup

### Step 1: Navigate to Mobile Folder
```bash
cd ../mobile
```

### Step 2: Install Flutter Dependencies
```bash
flutter pub get
```

This will download all Flutter packages defined in `pubspec.yaml`.

### Step 3: Configure API Base URL
Edit `lib/services/api_service.dart`:
```dart
// Change this to your backend URL
static const String baseUrl = 'http://localhost:5000/api';

// For Android emulator, use:
// static const String baseUrl = 'http://10.0.2.2:5000/api';

// For physical device on same network:
// static const String baseUrl = 'http://192.168.1.x:5000/api';
```

### Step 4: Check Flutter Setup
```bash
flutter doctor
```

Fix any issues shown (Android SDK, iOS setup, etc.)

### Step 5: Run on Android Emulator
```bash
# Start Android emulator first, then:
flutter run
```

Or select device in VS Code and press F5

### Step 6: Run on Physical Device
```bash
# Enable USB debugging on Android phone
# Connect via USB
flutter devices  # Check if device is detected
flutter run
```

---

## 🧪 Testing the Complete Flow

### 1. Add Sample Job (via API)

Create file `sample-job.json`:
```json
{
  "title": "Junior Engineer (Civil) - Odisha PWD",
  "organization": "Odisha Public Works Department",
  "department": "Engineering",
  "notificationText": "Applications are invited for the post of Junior Engineer (Civil) in Odisha Public Works Department. Total Vacancies: 50. Educational Qualification: B.Tech/B.E. in Civil Engineering. Age Limit: 21-32 years. Application Fee: Rs. 500 for General, Rs. 300 for OBC, Free for SC/ST. Important Dates: Application Start: 01/12/2024, Application End: 31/12/2024, Exam Date: 15/01/2025. Selection Process: Written Exam followed by Interview. Pay Scale: Rs. 35,000 - 1,12,000 per month.",
  "notificationUrl": "https://odisha.gov.in/pwd/notification",
  "applicationUrl": "https://odisha.gov.in/pwd/apply",
  "pdfUrl": "https://odisha.gov.in/pwd/notification.pdf",
  "category": "Engineering",
  "status": "active"
}
```

Submit using cURL or Postman:
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d @sample-job.json
```

### 2. View Job in Mobile App
- Open app
- You should see the job in the list
- Click on it to see AI-generated summary
- Check YouTube videos tab

---

## 🛠️ Development Tools

### Recommended VS Code Extensions
- **Flutter** - Dart Code
- **ESLint** - For JavaScript linting
- **Prettier** - Code formatting
- **MongoDB for VS Code** - Database management
- **Thunder Client** - API testing

### Useful Commands

**Backend:**
```bash
npm run dev        # Start with nodemon (auto-reload)
npm start          # Production start
npm test           # Run tests
npm run lint       # Check code style
```

**Flutter:**
```bash
flutter run              # Run app
flutter build apk        # Build Android APK
flutter build ios        # Build iOS app
flutter test             # Run tests
flutter clean            # Clean build cache
flutter pub upgrade      # Update dependencies
```

---

## 📊 Database Seeding (Optional)

To add multiple sample jobs quickly:

Create `backend/seeds/jobs.json`:
```json
[
  {
    "title": "Police Constable - Odisha Police",
    "organization": "Odisha Police Department",
    "notificationText": "...",
    "category": "Police",
    "status": "active"
  },
  {
    "title": "Primary School Teacher - Odisha Education",
    "organization": "Department of School Education",
    "notificationText": "...",
    "category": "Teaching",
    "status": "active"
  }
]
```

Create seeder script `backend/seeds/seed.js`:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('../src/models/Job');
const jobs = require('./jobs.json');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Job.deleteMany({}); // Clear existing
  await Job.insertMany(jobs);
  console.log('Database seeded!');
  process.exit(0);
}

seed();
```

Run:
```bash
node seeds/seed.js
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: Cannot connect to MongoDB**
```bash
# Check if MongoDB is running
mongosh

# Or check MongoDB service status
# Windows: Services → MongoDB Server
# Linux: sudo systemctl status mongod
```

**Error: OpenAI API Key invalid**
- Verify key is correct
- Check if you have credits
- Try regenerating key

**Error: Port 5000 already in use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Flutter Issues

**Error: Gradle build failed**
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter run
```

**Error: Cannot connect to backend**
- Check backend is running
- Verify correct IP address
- For emulator, use `10.0.2.2` instead of `localhost`
- Check firewall settings

**Error: SDK not found**
```bash
flutter doctor --android-licenses
flutter config --android-sdk /path/to/sdk
```

---

## 📚 Next Steps

After successful setup:

1. ✅ **Read API Documentation** - `docs/API.md`
2. ✅ **Understand Architecture** - See README.md diagrams
3. ✅ **Add More Jobs** - Test AI processing
4. ✅ **Customize UI** - Modify Flutter screens
5. ✅ **Setup Web Scraper** - Automate job fetching
6. ✅ **Deploy to Production** - Follow `docs/DEPLOYMENT.md`

---

## 💡 Tips

- Use **Postman** or **Thunder Client** for API testing
- Use **MongoDB Compass** for database visualization
- Use **React Native Debugger** for mobile debugging
- Keep backend and frontend running simultaneously during development
- Check logs regularly: `npm run dev` shows all backend logs

---

## 📞 Need Help?

- Check existing issues on GitHub
- Read the complete README.md
- Review API documentation
- Contact: your-email@example.com

---

**Happy Coding! 🚀**
