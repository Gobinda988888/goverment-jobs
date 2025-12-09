// Firestore Job Model (replacing Mongoose)
const { db } = require('../config/firebase');
const admin = require('firebase-admin');

class Job {
  constructor(data) {
    this.title = data.title || '';
    this.organization = data.organization || '';
    this.department = data.department || '';
    this.notificationText = data.notificationText || '';
    this.notificationUrl = data.notificationUrl || '';
    this.applicationUrl = data.applicationUrl || '';
    this.pdfUrl = data.pdfUrl || '';
    
    // AI Generated Data
    this.aiSummary = data.aiSummary || null;
    
    // Job Details
    this.category = data.category || 'government';
    this.location = data.location || '';
    this.salary = data.salary || '';
    this.vacancies = data.vacancies || null;
    this.qualifications = data.qualifications || [];
    this.experience = data.experience || '';
    
    // Important Dates
    this.postedDate = data.postedDate || new Date();
    this.lastDate = data.lastDate || null;
    this.examDate = data.examDate || null;
    
    // Status
    this.status = data.status || 'active';
    this.isFeatured = data.isFeatured || false;
    this.views = data.views || 0;
    
    // YouTube Resources
    this.youtubeVideos = data.youtubeVideos || [];
    
    // Metadata
    this.createdAt = data.createdAt || admin.firestore.FieldValue.serverTimestamp();
    this.updatedAt = data.updatedAt || admin.firestore.FieldValue.serverTimestamp();
  }

  // Get collection reference
  static collection() {
    return db.collection('jobs');
  }

  // Create new job
  static async create(jobData) {
    const job = new Job(jobData);
    const docRef = await this.collection().add({
      ...job,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { id: docRef.id, ...job };
  }

  // Find all jobs with filters
  static async find(filters = {}) {
    let query = this.collection();
    
    // Apply filters
    if (filters.category) {
      query = query.where('category', '==', filters.category);
    }
    if (filters.location) {
      query = query.where('location', '==', filters.location);
    }
    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }
    if (filters.isFeatured !== undefined) {
      query = query.where('isFeatured', '==', filters.isFeatured);
    }
    
    // Sorting
    query = query.orderBy('createdAt', 'desc');
    
    // Limit
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    const snapshot = await query.get();
    const jobs = [];
    
    snapshot.forEach(doc => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return jobs;
  }

  // Find job by ID
  static async findById(id) {
    const doc = await this.collection().doc(id).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data()
    };
  }

  // Update job
  static async findByIdAndUpdate(id, updateData) {
    const docRef = this.collection().doc(id);
    
    await docRef.update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const updated = await docRef.get();
    return {
      id: updated.id,
      ...updated.data()
    };
  }

  // Delete job
  static async findByIdAndDelete(id) {
    const docRef = this.collection().doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return null;
    }
    
    const data = {
      id: doc.id,
      ...doc.data()
    };
    
    await docRef.delete();
    return data;
  }

  // Search jobs (title, organization, description)
  static async search(searchTerm) {
    const allJobs = await this.find({ status: 'active' });
    
    const lowerSearch = searchTerm.toLowerCase();
    return allJobs.filter(job => 
      job.title.toLowerCase().includes(lowerSearch) ||
      job.organization.toLowerCase().includes(lowerSearch) ||
      (job.notificationText && job.notificationText.toLowerCase().includes(lowerSearch))
    );
  }

  // Increment view count
  static async incrementViews(id) {
    const docRef = this.collection().doc(id);
    await docRef.update({
      views: admin.firestore.FieldValue.increment(1)
    });
  }

  // Get featured jobs
  static async getFeatured(limit = 5) {
    return this.find({ isFeatured: true, status: 'active', limit });
  }

  // Get jobs by category
  static async getByCategory(category, limit = 20) {
    return this.find({ category, status: 'active', limit });
  }

  // Get active jobs (not expired)
  static async getActive() {
    const allJobs = await this.find({ status: 'active' });
    const now = new Date();
    
    return allJobs.filter(job => {
      if (!job.lastDate) return true;
      const lastDate = job.lastDate.toDate ? job.lastDate.toDate() : new Date(job.lastDate);
      return lastDate >= now;
    });
  }

  // Count documents
  static async countDocuments(filters = {}) {
    const jobs = await this.find(filters);
    return jobs.length;
  }
}

module.exports = Job;
