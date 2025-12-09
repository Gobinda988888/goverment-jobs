# 🔥 Firebase Storage API - Quick Reference

## 📤 File Upload Endpoints

### Upload PDF (Job Notifications)

**Endpoint**: `POST /api/upload/pdf`

**Content-Type**: `multipart/form-data`

**Body**:
- `file`: PDF file (max 10MB)

**Example using cURL**:
```bash
curl -X POST https://your-app.onrender.com/api/upload/pdf \
  -F "file=@notification.pdf"
```

**Response**:
```json
{
  "message": "PDF uploaded successfully",
  "url": "https://storage.googleapis.com/gobindatest-9a5ca.firebasestorage.app/pdfs/abc123.pdf"
}
```

---

### Upload Image

**Endpoint**: `POST /api/upload/image`

**Content-Type**: `multipart/form-data`

**Body**:
- `file`: Image file (JPEG, PNG, JPG) - max 10MB

**Example using cURL**:
```bash
curl -X POST https://your-app.onrender.com/api/upload/image \
  -F "file=@logo.png"
```

**Response**:
```json
{
  "message": "Image uploaded successfully",
  "url": "https://storage.googleapis.com/gobindatest-9a5ca.firebasestorage.app/images/xyz789.png"
}
```

---

### Delete File

**Endpoint**: `DELETE /api/upload/file`

**Content-Type**: `application/json`

**Body**:
```json
{
  "fileUrl": "https://storage.googleapis.com/gobindatest-9a5ca.firebasestorage.app/pdfs/abc123.pdf"
}
```

**Response**:
```json
{
  "message": "File deleted successfully"
}
```

---

## 🧪 Testing with Postman

### 1. Upload PDF

1. Create new request
2. Method: `POST`
3. URL: `http://localhost:5000/api/upload/pdf` (or your Render URL)
4. Go to **Body** tab
5. Select **form-data**
6. Add key: `file`, Type: **File**
7. Choose your PDF file
8. Click **Send**

### 2. Upload Image

Same as PDF but:
- URL: `/api/upload/image`
- Choose image file (PNG, JPG, JPEG)

### 3. Delete File

1. Method: `DELETE`
2. URL: `http://localhost:5000/api/upload/file`
3. Go to **Body** tab
4. Select **raw** → **JSON**
5. Add:
   ```json
   {
     "fileUrl": "paste-the-url-here"
   }
   ```
6. Click **Send**

---

## 💻 Using in Job Creation

When creating a job, use uploaded URLs:

**POST /api/jobs**
```json
{
  "title": "OPSC Assistant Professor Recruitment 2024",
  "organization": "Odisha Public Service Commission",
  "description": "Full job description...",
  "category": "government",
  "location": "Odisha",
  "salary": "₹57,700 - ₹1,82,400",
  "lastDate": "2024-12-31",
  "notificationUrl": "https://opsc.gov.in/notification",
  "applicationUrl": "https://opsc.gov.in/apply",
  "pdfUrl": "https://storage.googleapis.com/gobindatest-9a5ca.firebasestorage.app/pdfs/opsc-notification.pdf"
}
```

---

## 📝 Firebase Service Methods

### Available in `firebaseService.js`:

```javascript
const firebaseService = require('./services/firebaseService');

// Upload any file
await firebaseService.uploadFile(buffer, 'filename.pdf', 'application/pdf', 'folder');

// Upload PDF specifically
await firebaseService.uploadPDF(buffer, 'notification.pdf');

// Upload image
await firebaseService.uploadImage(buffer, 'logo.png', 'image/png');

// Delete file
await firebaseService.deleteFile('https://storage.googleapis.com/...');

// Get signed URL (temporary access)
await firebaseService.getSignedUrl('pdfs/abc123.pdf', 60); // 60 minutes

// List files in folder
await firebaseService.listFiles('pdfs/');
```

---

## 🔒 Firebase Storage Rules

To make files publicly readable, update Firebase Storage Rules:

1. Go to Firebase Console
2. Navigate to **Storage** → **Rules**
3. Update rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access
    match /{allPaths=**} {
      allow read: if true;
      allow write: if false; // Only backend can write
    }
  }
}
```

4. Click **Publish**

---

## ⚠️ Important Notes

1. **File Size Limit**: 10MB per file (configurable in `uploadController.js`)

2. **Allowed Types**:
   - PDFs: `application/pdf`
   - Images: `image/jpeg`, `image/png`, `image/jpg`

3. **Storage Location**:
   - PDFs: `pdfs/` folder
   - Images: `images/` folder
   - Other: `uploads/` folder

4. **Public URLs**: Files are publicly accessible via HTTPS

5. **Service Account**: Required for production (set `FIREBASE_SERVICE_ACCOUNT` env var)

---

## 🐛 Troubleshooting

### "Firebase initialization error"
- Service account not configured
- Invalid JSON in `FIREBASE_SERVICE_ACCOUNT`
- Solution: Check environment variable format

### "Failed to upload file"
- Firebase Storage rules too restrictive
- Service account lacks permissions
- Solution: Update storage rules, verify service account

### "Invalid file type"
- Trying to upload unsupported file
- Solution: Only PDF, JPEG, PNG, JPG allowed

---

## 📊 Storage Quotas

**Firebase Free Tier (Spark Plan)**:
- 5GB stored
- 1GB/day downloaded
- 20K/day uploads
- 50K/day downloads

**Upgrade to Blaze Plan** (pay-as-you-go):
- Same free tier included
- $0.026/GB stored
- $0.12/GB downloaded

---

## ✅ Next Steps

1. Upload test PDF
2. Upload test image
3. Verify files are accessible
4. Use URLs in job creation
5. Test file deletion
6. Monitor Firebase Storage usage

**Firebase Console**: https://console.firebase.google.com/project/gobindatest-9a5ca/storage
