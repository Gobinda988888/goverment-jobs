# 📡 API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication
For admin routes, include JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Get All Jobs
**GET** `/jobs`

Fetch all jobs with filtering and pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Items per page |
| status | string | - | Filter by status (active, upcoming, closed, result_declared) |
| category | string | - | Filter by category |
| sortBy | string | postedDate | Sort field |
| order | string | desc | Sort order (asc, desc) |

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "totalPages": 5,
  "currentPage": 1,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Junior Engineer (Civil)",
      "organization": "Odisha Public Works Department",
      "aiSummary": {
        "shortSummary": "...",
        "importantPoints": {...}
      },
      "status": "active",
      "postedDate": "2024-12-01T00:00:00.000Z",
      "viewCount": 1500,
      "daysRemaining": 15
    }
  ]
}
```

---

### 2. Get Featured Jobs
**GET** `/jobs/featured`

Fetch featured jobs.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | integer | 5 | Number of featured jobs |

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

---

### 3. Search Jobs
**GET** `/jobs/search`

Search jobs using text search.

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query |
| category | string | No | Filter by category |
| status | string | No | Filter by status |

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

### 4. Get Job by ID
**GET** `/jobs/:id`

Fetch single job details.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Junior Engineer (Civil)",
    "organization": "Odisha PWD",
    "notificationText": "Full notification text...",
    "aiSummary": {
      "shortSummary": "...",
      "importantPoints": {
        "eligibility": ["B.Tech in Civil Engineering"],
        "importantDates": {
          "applicationStart": "2024-12-01",
          "applicationEnd": "2024-12-31",
          "examDate": "2025-01-15"
        },
        "ageLimit": {
          "min": 21,
          "max": 32,
          "relaxation": "5 years for SC/ST"
        },
        "qualification": ["B.Tech/B.E. in Civil Engineering"],
        "vacancies": {
          "total": 50,
          "category": {
            "UR": 25,
            "OBC": 12,
            "SC": 8,
            "ST": 5
          }
        },
        "applicationFees": {
          "general": 500,
          "obc": 300,
          "scst": 0
        },
        "selectionProcess": ["Written Exam", "Interview"],
        "salary": "Rs. 35,000 - 1,12,000",
        "howToApply": "Apply online through official website"
      }
    },
    "youtubeVideos": []
  }
}
```

---

### 5. Get Job Resources (YouTube Videos)
**GET** `/jobs/:id/resources`

Fetch YouTube preparation videos for a job.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "videoId": "dQw4w9WgXcQ",
      "title": "Odisha Junior Engineer Exam Preparation",
      "channelName": "Exam Prep Channel",
      "thumbnail": "https://...",
      "publishedAt": "2024-11-01T00:00:00.000Z",
      "viewCount": 50000
    }
  ]
}
```

---

### 6. Create Job (Admin Only)
**POST** `/jobs`

Create a new job with AI processing.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Junior Engineer (Civil)",
  "organization": "Odisha PWD",
  "department": "Public Works",
  "notificationText": "Full notification text here...",
  "notificationUrl": "https://official-site.com/notification",
  "applicationUrl": "https://official-site.com/apply",
  "pdfUrl": "https://official-site.com/notification.pdf",
  "category": "Engineering",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": {...}
}
```

---

### 7. Update Job (Admin Only)
**PUT** `/jobs/:id`

Update existing job.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** (partial update supported)
```json
{
  "status": "closed",
  "isFeatured": true
}
```

---

### 8. Delete Job (Admin Only)
**DELETE** `/jobs/:id`

Delete a job.

**Headers:**
```
Authorization: Bearer <token>
```

---

### 9. Process Job with AI (Admin Only)
**POST** `/jobs/:id/process-ai`

Manually trigger AI processing for a job.

**Headers:**
```
Authorization: Bearer <token>
```

---

### 10. Fetch YouTube Videos (Admin Only)
**POST** `/jobs/:id/fetch-videos`

Manually fetch YouTube videos for a job.

**Headers:**
```
Authorization: Bearer <token>
```

---

### 11. Increment View Count
**PATCH** `/jobs/:id/view`

Increment view count for a job (called when user opens job details).

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Job not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Something went wrong"
}
```

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Response when exceeded:**
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

---

## Categories

Available job categories:
- Engineering
- Teaching
- Police
- Medical
- Banking
- Railway
- Administrative
- Other

---

## Job Status Values

- `upcoming` - Job notification released, applications not yet started
- `active` - Applications are open
- `closed` - Application deadline passed
- `result_declared` - Results have been published

---

## Pagination Example

Request:
```
GET /api/jobs?page=2&limit=20&category=Engineering&status=active
```

Response includes:
- `count` - Number of items in current response
- `total` - Total items matching criteria
- `totalPages` - Total pages available
- `currentPage` - Current page number

---

## Testing with cURL

### Get all jobs:
```bash
curl -X GET "http://localhost:5000/api/jobs?page=1&limit=10"
```

### Search jobs:
```bash
curl -X GET "http://localhost:5000/api/jobs/search?q=engineer"
```

### Create job (requires auth):
```bash
curl -X POST "http://localhost:5000/api/jobs" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Job",
    "organization": "Test Org",
    "notificationText": "This is a test notification..."
  }'
```

---

## WebSocket Support (Future)

Real-time job notifications will be added in future versions using Socket.io.

---

## API Versioning

Current version: v1 (implicit)

Future versions will use explicit versioning:
- `/api/v1/jobs`
- `/api/v2/jobs`
