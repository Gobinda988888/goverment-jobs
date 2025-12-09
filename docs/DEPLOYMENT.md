# 🚀 Deployment Guide

Complete guide to deploy Odisha Government Jobs application to production.

---

## 📋 Prerequisites

- MongoDB Atlas account (or MongoDB server)
- OpenAI API key or Google Gemini API key
- YouTube Data API v3 key
- Node.js v18+ installed
- Flutter SDK 3.x installed
- Domain name (optional)
- Cloud hosting account (AWS, Heroku, DigitalOcean, etc.)

---

## 🗄️ Part 1: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create new cluster (Free M0 tier available)

### Step 2: Configure Database
1. Click "Connect" on your cluster
2. Whitelist IP: `0.0.0.0/0` (allow from anywhere) - *or restrict to your server IP*
3. Create database user with password
4. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/odisha-jobs
   ```

### Step 3: Test Connection
```bash
# Use MongoDB Compass or mongosh to test
mongosh "mongodb+srv://username:password@cluster.mongodb.net/odisha-jobs"
```

---

## 🔧 Part 2: Backend Deployment

### Option A: Deploy to Heroku

#### Step 1: Install Heroku CLI
```bash
# Windows
choco install heroku-cli

# Or download from heroku.com/cli
```

#### Step 2: Login & Create App
```bash
heroku login
cd backend
heroku create odisha-jobs-api
```

#### Step 3: Set Environment Variables
```bash
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set OPENAI_API_KEY="sk-..."
heroku config:set YOUTUBE_API_KEY="AIza..."
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set NODE_ENV="production"
```

#### Step 4: Deploy
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

#### Step 5: Verify
```bash
heroku logs --tail
heroku open
```

---

### Option B: Deploy to AWS EC2

#### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2
2. Launch Ubuntu 22.04 LTS instance (t2.micro for free tier)
3. Configure security group:
   - Port 22 (SSH)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 5000 (API - temporary)

#### Step 2: Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### Step 3: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### Step 4: Upload Code
```bash
# From local machine
scp -i your-key.pem -r backend ubuntu@your-ec2-ip:/home/ubuntu/
```

Or use Git:
```bash
# On EC2
git clone https://github.com/your-repo/odisha-jobs.git
cd odisha-jobs/backend
npm install --production
```

#### Step 5: Configure Environment
```bash
# Create .env file
nano .env

# Add all environment variables
PORT=5000
MONGODB_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
YOUTUBE_API_KEY=AIza...
JWT_SECRET=your-secret
NODE_ENV=production
```

#### Step 6: Start with PM2
```bash
pm2 start src/app.js --name odisha-jobs-api
pm2 save
pm2 startup
```

#### Step 7: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/odisha-jobs
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/odisha-jobs /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 8: Setup SSL (Optional but Recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option C: Deploy to DigitalOcean

#### Step 1: Create Droplet
1. Go to DigitalOcean dashboard
2. Create Droplet → Ubuntu 22.04
3. Choose plan (Basic $6/month)
4. Add SSH key

#### Step 2: Follow AWS EC2 Steps 2-8
(Same process as AWS)

---

## 📱 Part 3: Flutter App Deployment

### Android App (Google Play Store)

#### Step 1: Prepare App
```bash
cd mobile

# Update pubspec.yaml version
version: 1.0.0+1

# Update API base URL in lib/services/api_service.dart
static const String baseUrl = 'https://your-api-domain.com/api';
```

#### Step 2: Generate Keystore
```bash
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

#### Step 3: Configure Signing
Create `android/key.properties`:
```properties
storePassword=<password>
keyPassword=<password>
keyAlias=upload
storeFile=<path-to-keystore>
```

Update `android/app/build.gradle`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

#### Step 4: Build Release APK
```bash
flutter build apk --release

# Or build App Bundle for Play Store
flutter build appbundle --release
```

APK location: `build/app/outputs/flutter-apk/app-release.apk`

#### Step 5: Submit to Play Store
1. Go to [play.google.com/console](https://play.google.com/console)
2. Create app
3. Upload app bundle
4. Fill in store listing details
5. Submit for review

---

### iOS App (Apple App Store)

#### Step 1: Setup Xcode
```bash
cd mobile
flutter build ios --release
open ios/Runner.xcworkspace
```

#### Step 2: Configure Signing
1. In Xcode, select Runner target
2. Signing & Capabilities tab
3. Select your Apple Developer team
4. Configure bundle identifier

#### Step 3: Archive & Upload
1. Product → Archive
2. Distribute App
3. App Store Connect
4. Upload

#### Step 4: Submit to App Store
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create new app
3. Fill in details
4. Submit for review

---

## 🔐 Part 4: Security Checklist

### Backend Security
- [ ] Change default JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Whitelist MongoDB IPs
- [ ] Add rate limiting
- [ ] Sanitize user inputs
- [ ] Keep dependencies updated
- [ ] Use environment variables
- [ ] Enable CORS properly
- [ ] Add request logging
- [ ] Setup monitoring

### API Keys Security
```bash
# Never commit .env file
echo ".env" >> .gitignore

# Use different keys for dev/prod
# Rotate keys regularly
```

---

## 📊 Part 5: Monitoring & Maintenance

### Setup PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Setup Error Tracking (Optional)
- Sentry.io for error tracking
- New Relic for APM
- LogRocket for frontend monitoring

### Database Backups
```bash
# MongoDB Atlas auto-backups
# Or manual backup
mongodump --uri="mongodb+srv://..." --out=/backup/
```

---

## 🔄 Part 6: CI/CD Pipeline (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "odisha-jobs-api"
          heroku_email: "your-email@example.com"

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: subosito/flutter-action@v2
      - run: flutter pub get
      - run: flutter build apk --release
      - uses: actions/upload-artifact@v2
        with:
          name: release-apk
          path: build/app/outputs/flutter-apk/app-release.apk
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue: Cannot connect to MongoDB**
- Check IP whitelist
- Verify connection string
- Test with MongoDB Compass

**Issue: API timeout**
- Increase server resources
- Check API rate limits
- Optimize database queries

**Issue: Flutter build fails**
- Clear build cache: `flutter clean`
- Update dependencies: `flutter pub upgrade`
- Check Android SDK

---

## 🎉 Post-Deployment

1. Test all API endpoints
2. Test mobile app thoroughly
3. Monitor error logs
4. Setup analytics
5. Create backup strategy
6. Document API for team
7. Setup alerts for downtime

---

**Deployment Complete! 🚀**
