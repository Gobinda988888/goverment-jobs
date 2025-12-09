# Odisha Government Jobs - Project Files

## 📁 Complete File Structure

This document provides a reference of all files created in the project.

---

## Backend Files

```
backend/
├── src/
│   ├── config/
│   │   └── database.js                 # MongoDB connection setup
│   │
│   ├── models/
│   │   └── Job.js                      # Job mongoose schema with virtuals
│   │
│   ├── routes/
│   │   └── jobRoutes.js                # All job API routes
│   │
│   ├── controllers/
│   │   └── jobController.js            # Business logic for job operations
│   │
│   ├── services/
│   │   ├── aiService.js                # OpenAI/Gemini integration for job processing
│   │   ├── youtubeService.js           # YouTube Data API integration
│   │   └── scraperService.js           # Web scraper for job portals
│   │
│   ├── middleware/
│   │   ├── auth.js                     # JWT authentication middleware
│   │   └── validation.js               # Joi validation schemas
│   │
│   ├── utils/
│   │   ├── logger.js                   # Winston logger configuration
│   │   └── errorHandler.js             # Global error handling
│   │
│   └── app.js                          # Express app entry point
│
├── logs/                               # Application logs (generated)
├── tests/                              # Unit tests (to be added)
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
├── package.json                        # NPM dependencies
└── README.md                           # Backend documentation
```

---

## Mobile App Files

```
mobile/
├── lib/
│   ├── models/
│   │   └── job.dart                    # Job, AISummary, YouTubeVideo models
│   │
│   ├── services/
│   │   └── api_service.dart            # Dio HTTP client for API calls
│   │
│   ├── providers/
│   │   └── job_provider.dart           # Riverpod state management
│   │
│   ├── screens/
│   │   ├── home_screen.dart            # Main jobs list screen
│   │   ├── job_detail_screen.dart      # Job details with tabs
│   │   └── search_screen.dart          # Search functionality
│   │
│   ├── widgets/
│   │   ├── job_card.dart               # Reusable job card widget
│   │   ├── info_card.dart              # Information display card
│   │   ├── featured_jobs_section.dart  # Featured jobs carousel
│   │   └── category_filter.dart        # Category filter chips
│   │
│   └── main.dart                       # App entry point
│
├── assets/                             # Images, icons, fonts
├── android/                            # Android configuration
├── ios/                                # iOS configuration
├── test/                               # Widget & unit tests
├── .gitignore                          # Git ignore rules
├── pubspec.yaml                        # Flutter dependencies
└── README.md                           # Mobile app documentation
```

---

## Documentation Files

```
docs/
├── API.md                              # Complete API documentation
├── DEPLOYMENT.md                       # Deployment guide (Heroku, AWS, etc.)
└── SETUP.md                            # Development setup guide
```

---

## Root Files

```
.
├── README.md                           # Main project documentation
└── PROJECT_STRUCTURE.md               # This file
```

---

## Key Files Explained

### Backend

**app.js**
- Express server setup
- Middleware configuration
- Routes mounting
- Error handling
- Server startup

**models/Job.js**
- MongoDB schema definition
- Data validation
- Virtuals (computed fields)
- Instance methods
- Static methods

**services/aiService.js**
- OpenAI API integration
- Prompt engineering
- Job notification parsing
- Structured data extraction

**services/youtubeService.js**
- YouTube Data API wrapper
- Video search functionality
- Statistics fetching
- Rate limit handling

**services/scraperService.js**
- Puppeteer-based web scraping
- Multiple source support
- Cron job scheduling
- Duplicate detection

### Mobile App

**main.dart**
- App initialization
- Theme configuration
- Provider scope
- Material app setup

**models/job.dart**
- Dart data classes
- JSON serialization
- Type-safe models
- Nested classes

**services/api_service.dart**
- Dio HTTP client
- API endpoints
- Error handling
- Request/response logging

**providers/job_provider.dart**
- State management with Riverpod
- Pagination logic
- Search functionality
- Data fetching

**screens/home_screen.dart**
- Main UI layout
- Featured section
- Filters
- Infinite scroll

**screens/job_detail_screen.dart**
- Tabbed interface
- AI summary display
- Video player integration
- Action buttons

---

## Configuration Files

### Backend

**.env.example**
```
PORT=5000
MONGODB_URI=...
OPENAI_API_KEY=...
YOUTUBE_API_KEY=...
JWT_SECRET=...
```

### Mobile

**pubspec.yaml**
```yaml
dependencies:
  flutter_riverpod: ^2.4.9
  dio: ^5.4.0
  youtube_player_flutter: ^8.1.2
  # ... more dependencies
```

---

## Generated/Runtime Files (Not in Git)

### Backend
- `node_modules/` - NPM packages
- `logs/` - Application logs
- `.env` - Environment variables
- `coverage/` - Test coverage

### Mobile
- `.dart_tool/` - Dart build cache
- `build/` - Compiled app
- `.flutter-plugins` - Plugin cache
- `android/app/release/` - Release builds

---

## Total File Count

- **Backend**: ~15 core files
- **Mobile**: ~15 core files
- **Documentation**: 3 files
- **Configuration**: 5 files

**Total: ~38 files** (excluding generated files)

---

## File Size Estimates

- Backend code: ~15 KB
- Mobile code: ~25 KB
- Documentation: ~50 KB
- Total: ~90 KB

---

## Dependencies Count

### Backend (package.json)
- Production: 16 packages
- Development: 4 packages

### Mobile (pubspec.yaml)
- Core: 15 packages
- Dev: 7 packages

---

## Next Steps

1. ✅ All core files created
2. ⏳ Install dependencies
3. ⏳ Configure environment
4. ⏳ Test backend API
5. ⏳ Run mobile app
6. ⏳ Deploy to production

---

This structure provides a scalable foundation for the Odisha Government Jobs application with AI integration.
