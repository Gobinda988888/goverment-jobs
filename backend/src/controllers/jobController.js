const Job = require('../models/JobFirestore'); // Changed to Firestore model
const aiService = require('../services/aiService');
const logger = require('../utils/logger');
const { AppError } = require('../utils/errorHandler');

/**
 * Get all jobs with filtering and pagination
 */
exports.getAllJobs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;
    filters.limit = parseInt(limit);

    const jobs = await Job.find(filters);
    const total = await Job.countDocuments(filters);

    res.json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: jobs
    });
  } catch (error) {
    logger.error(`Error in getAllJobs: ${error.message}`);
    next(error);
  }
};

/**
 * Get featured jobs
 */
exports.getFeaturedJobs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const jobs = await Job.getFeatured(limit);

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    logger.error(`Error in getFeaturedJobs: ${error.message}`);
    next(error);
  }
};

/**
 * Search jobs
 */
exports.searchJobs = async (req, res, next) => {
  try {
    const { q, category, status } = req.query;

    if (!q) {
      return next(new AppError('Search query is required', 400));
    }

    const filters = {};
    if (category) filters.category = category;
    if (status) filters.status = status;

    const jobs = await Job.searchJobs(q, filters);

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    logger.error(`Error in searchJobs: ${error.message}`);
    next(error);
  }
};

/**
 * Get single job by ID
 */
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    logger.error(`Error in getJobById: ${error.message}`);
    next(error);
  }
};



/**
 * Create new job with AI processing
 */
exports.createJob = async (req, res, next) => {
  try {
    const jobData = req.body;

    // Create job first
    let job = await Job.create(jobData);

    // Process with AI in background
    try {
      const aiSummary = await aiService.processJobNotification(job.notificationText || job.title);
      
      // Get YouTube resources using Gemini (no API key needed!)
      const youtubeResources = await aiService.findYouTubeResources(
        job.title, 
        aiSummary.shortSummary
      );
      
      // Update job with AI data and YouTube search links
      job = await Job.findByIdAndUpdate(job.id, {
        aiSummary,
        youtubeResources,
        isAIProcessed: true,
        tags: aiService.generateTags(job.title, aiSummary)
      });

      logger.info(`Job created and processed with AI: ${job.id}`);
    } catch (aiError) {
      logger.error(`AI processing failed for job ${job.id}: ${aiError.message}`);
      // Job is still created, just without AI data
    }

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    logger.error(`Error in createJob: ${error.message}`);
    next(error);
  }
};

/**
 * Update job
 */
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    logger.error(`Error in updateJob: ${error.message}`);
    next(error);
  }
};

/**
 * Delete job
 */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    logger.error(`Error in deleteJob: ${error.message}`);
    next(error);
  }
};

/**
 * Manually process job with AI
 */
exports.processJobWithAI = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    const aiSummary = await aiService.processJobNotification(job.notificationText);
    job.aiSummary = aiSummary;
    job.isAIProcessed = true;
    job.tags = aiService.generateTags(job.title, aiSummary);

    await job.save();

    res.json({
      success: true,
      message: 'Job processed with AI successfully',
      data: job
    });
  } catch (error) {
    logger.error(`Error in processJobWithAI: ${error.message}`);
    next(error);
  }
};

/**
 * Get YouTube resources (search links generated by Gemini AI)
 */
exports.getYouTubeResources = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    // If resources already exist, return them
    if (job.youtubeResources && job.youtubeResources.searchQueries) {
      return res.json({
        success: true,
        data: job.youtubeResources
      });
    }

    // Generate fresh resources using Gemini
    const youtubeResources = await aiService.findYouTubeResources(
      job.title,
      job.aiSummary?.shortSummary || ''
    );

    // Update job with resources
    await Job.findByIdAndUpdate(job.id, { youtubeResources });

    res.json({
      success: true,
      data: youtubeResources
    });
  } catch (error) {
    logger.error(`Error in getYouTubeResources: ${error.message}`);
    next(error);
  }
};

/**
 * Increment view count
 */
exports.incrementView = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return next(new AppError('Job not found', 404));
    }

    await job.incrementViews();

    res.json({
      success: true,
      viewCount: job.viewCount
    });
  } catch (error) {
    logger.error(`Error in incrementView: ${error.message}`);
    next(error);
  }
};
