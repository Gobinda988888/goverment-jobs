const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    index: true
  },
  organization: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  department: {
    type: String,
    trim: true
  },

  // Original Data
  notificationText: {
    type: String,
    required: [true, 'Notification text is required']
  },
  notificationUrl: {
    type: String,
    trim: true
  },
  applicationUrl: {
    type: String,
    trim: true
  },
  pdfUrl: {
    type: String,
    trim: true
  },

  // AI Generated Data
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
          UR: { type: Number, default: 0 },
          OBC: { type: Number, default: 0 },
          SC: { type: Number, default: 0 },
          ST: { type: Number, default: 0 },
          EWS: { type: Number, default: 0 }
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

  // YouTube Resources
  youtubeVideos: [{
    videoId: {
      type: String,
      required: true
    },
    title: String,
    channelName: String,
    thumbnail: String,
    publishedAt: Date,
    viewCount: Number
  }],

  // Metadata
  category: {
    type: String,
    enum: ['Engineering', 'Teaching', 'Police', 'Medical', 'Banking', 'Railway', 'Administrative', 'Other'],
    default: 'Other'
  },
  tags: [String],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'closed', 'result_declared'],
    default: 'active',
    index: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  viewCount: {
    type: Number,
    default: 0
  },
  bookmarkCount: {
    type: Number,
    default: 0
  },

  // Admin fields
  isVerified: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isAIProcessed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
jobSchema.index({ title: 'text', organization: 'text', tags: 'text' });
jobSchema.index({ status: 1, postedDate: -1 });
jobSchema.index({ category: 1, status: 1 });

// Virtual for days remaining
jobSchema.virtual('daysRemaining').get(function() {
  if (this.aiSummary?.importantPoints?.importantDates?.applicationEnd) {
    const endDate = new Date(this.aiSummary.importantPoints.importantDates.applicationEnd);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }
  return null;
});

// Pre-save middleware to update lastUpdated
jobSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Method to increment view count
jobSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Static method to get featured jobs
jobSchema.statics.getFeaturedJobs = function(limit = 5) {
  return this.find({ isFeatured: true, status: 'active' })
    .sort({ postedDate: -1 })
    .limit(limit);
};

// Static method to search jobs
jobSchema.statics.searchJobs = function(query, filters = {}) {
  const searchQuery = {
    $text: { $search: query },
    ...filters
  };
  return this.find(searchQuery).sort({ score: { $meta: 'textScore' } });
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
