# Backend - Odisha Government Jobs API

Node.js backend for Odisha Government Jobs application with AI processing and YouTube integration.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

Server will start at http://localhost:5000

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── models/
│   │   └── Job.js              # Job schema
│   ├── routes/
│   │   └── jobRoutes.js        # API routes
│   ├── controllers/
│   │   └── jobController.js    # Business logic
│   ├── services/
│   │   ├── aiService.js        # OpenAI integration
│   │   └── youtubeService.js   # YouTube API
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   └── validation.js       # Request validation
│   ├── utils/
│   │   ├── logger.js           # Winston logger
│   │   └── errorHandler.js     # Error handling
│   └── app.js                  # Express app entry
├── logs/                       # Application logs
├── tests/                      # Unit tests
├── .env.example               # Environment template
├── package.json
└── README.md
```

---

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/odisha-jobs

# AI Service (Choose one)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4-turbo-preview

# YouTube
YOUTUBE_API_KEY=AIza...

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🗄️ Database Schema

### Job Collection

```javascript
{
  title: String,              // Required
  organization: String,       // Required
  department: String,
  notificationText: String,   // Required
  notificationUrl: String,
  applicationUrl: String,
  pdfUrl: String,
  
  aiSummary: {
    shortSummary: String,
    importantPoints: {
      eligibility: [String],
      importantDates: {
        applicationStart: Date,
        applicationEnd: Date,
        examDate: Date,
        resultDate: Date
      },
      ageLimit: {
        min: Number,
        max: Number,
        relaxation: String
      },
      qualification: [String],
      vacancies: {
        total: Number,
        category: {
          UR: Number,
          OBC: Number,
          SC: Number,
          ST: Number,
          EWS: Number
        }
      },
      applicationFees: {
        general: Number,
        obc: Number,
        scst: Number,
        female: Number
      },
      selectionProcess: [String],
      salary: String,
      howToApply: String
    }
  },
  
  youtubeVideos: [{
    videoId: String,
    title: String,
    channelName: String,
    thumbnail: String,
    publishedAt: Date,
    viewCount: Number
  }],
  
  category: String,
  tags: [String],
  status: String,
  postedDate: Date,
  viewCount: Number,
  isVerified: Boolean,
  isFeatured: Boolean
}
```

---

## 📡 API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | Get all jobs (with filters) |
| GET | `/api/jobs/featured` | Get featured jobs |
| GET | `/api/jobs/search` | Search jobs |
| GET | `/api/jobs/:id` | Get single job |
| GET | `/api/jobs/:id/resources` | Get YouTube videos |
| PATCH | `/api/jobs/:id/view` | Increment view count |

### Admin Routes (Require Auth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs` | Create new job |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |
| POST | `/api/jobs/:id/process-ai` | Trigger AI processing |
| POST | `/api/jobs/:id/fetch-videos` | Fetch YouTube videos |

Full API documentation: [docs/API.md](../docs/API.md)

---

## 🤖 AI Processing

### How It Works

1. Job notification text is submitted
2. AI service extracts structured information:
   - Summary
   - Important dates
   - Eligibility criteria
   - Vacancies
   - Fees
   - Selection process
3. Data is saved to database
4. YouTube videos are automatically fetched

### AI Prompt

The AI uses a carefully crafted prompt to extract information consistently. See `src/services/aiService.js` for details.

### Supported AI Models

- **OpenAI GPT-4** (default)
- **Google Gemini** (alternative)

To switch to Gemini, uncomment the Gemini code in `aiService.js`.

---

## 📹 YouTube Integration

Automatically fetches related exam preparation videos using:
- Search query: `<job_title> Odisha exam preparation`
- Filters: Relevance, India region, English language
- Caches results to reduce API calls

---

## 🔐 Authentication

Admin routes require JWT token:

```bash
# Get token (implement auth endpoint)
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password"
}

# Use token in requests
Authorization: Bearer <token>
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test jobController
```

---

## 📊 Monitoring

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- `exceptions.log` - Uncaught exceptions

View logs:
```bash
tail -f logs/combined.log
```

---

## 🔄 Scripts

```json
{
  "start": "node src/app.js",
  "dev": "nodemon src/app.js",
  "test": "jest --coverage",
  "lint": "eslint src/**/*.js"
}
```

---

## 🚀 Deployment

See [DEPLOYMENT.md](../docs/DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy to Heroku:
```bash
heroku create odisha-jobs-api
git push heroku main
heroku config:set MONGODB_URI=...
heroku config:set OPENAI_API_KEY=...
```

---

## 📝 Development Tips

1. **Use nodemon** for auto-reload during development
2. **Check logs** regularly for errors
3. **Test API** with Postman/Thunder Client
4. **Monitor MongoDB** with MongoDB Compass
5. **Rate limit** is enabled - adjust if needed

---

## 🐛 Common Issues

**MongoDB connection failed:**
- Ensure MongoDB is running
- Check connection string
- Verify network access (for Atlas)

**AI processing failed:**
- Check API key is valid
- Verify you have API credits
- Check notification text format

**YouTube videos not loading:**
- Verify YouTube API key
- Check API quota limits
- Test API key independently

---

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/)
- [YouTube Data API](https://developers.google.com/youtube/v3)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

---

**Backend API Ready! 🚀**
