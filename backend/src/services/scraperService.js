const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const cron = require('node-cron');
const logger = require('../utils/logger');
const Job = require('../models/Job');
const aiService = require('./aiService');

/**
 * Web Scraper Service for Odisha Government Job Portals
 * This is a template - customize for actual job websites
 */

class ScraperService {
  constructor() {
    this.sources = [
      {
        name: 'OPSC',
        url: 'https://opsc.gov.in/Recruitment/CurrentRecruitment.aspx',
        parser: this.parseOPSC.bind(this)
      },
      {
        name: 'Odisha eDistrict',
        url: 'https://www.odishassan.gov.in/',
        parser: this.parseOdishaDistrict.bind(this)
      }
      // Add more sources
    ];
  }

  /**
   * Start scheduled scraping
   */
  startScheduler() {
    if (process.env.SCRAPER_ENABLED !== 'true') {
      logger.info('Scraper is disabled');
      return;
    }

    // Run every 6 hours (customize with SCRAPER_CRON env variable)
    const cronSchedule = process.env.SCRAPER_CRON || '0 */6 * * *';
    
    cron.schedule(cronSchedule, async () => {
      logger.info('Starting scheduled job scraping...');
      await this.scrapeAllSources();
    });

    logger.info(`Scraper scheduled with cron: ${cronSchedule}`);
  }

  /**
   * Scrape all configured sources
   */
  async scrapeAllSources() {
    logger.info(`Scraping ${this.sources.length} sources...`);
    
    for (const source of this.sources) {
      try {
        await this.scrapeSource(source);
      } catch (error) {
        logger.error(`Error scraping ${source.name}: ${error.message}`);
      }
    }
  }

  /**
   * Scrape a single source
   */
  async scrapeSource(source) {
    logger.info(`Scraping ${source.name}...`);
    
    try {
      const jobs = await source.parser(source.url);
      
      logger.info(`Found ${jobs.length} jobs from ${source.name}`);
      
      // Process each job
      for (const jobData of jobs) {
        await this.processScrapedJob(jobData);
      }
    } catch (error) {
      logger.error(`Failed to scrape ${source.name}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Parse OPSC website (Example)
   */
  async parseOPSC(url) {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for job listings to load
      await page.waitForSelector('.job-listing', { timeout: 10000 });
      
      const html = await page.content();
      const $ = cheerio.load(html);
      
      const jobs = [];
      
      // Customize selectors based on actual website structure
      $('.job-listing').each((index, element) => {
        const title = $(element).find('.job-title').text().trim();
        const organization = 'Odisha Public Service Commission';
        const notificationUrl = $(element).find('a').attr('href');
        const pdfUrl = $(element).find('.pdf-link').attr('href');
        
        if (title && notificationUrl) {
          jobs.push({
            title,
            organization,
            notificationUrl: this.resolveUrl(url, notificationUrl),
            pdfUrl: pdfUrl ? this.resolveUrl(url, pdfUrl) : null,
            category: this.categorizeJob(title),
            source: 'OPSC'
          });
        }
      });
      
      return jobs;
    } finally {
      await browser.close();
    }
  }

  /**
   * Parse Odisha District website (Example)
   */
  async parseOdishaDistrict(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const $ = cheerio.load(response.data);
      const jobs = [];
      
      // Customize based on actual website
      $('.notification-item').each((index, element) => {
        const title = $(element).find('h3').text().trim();
        const notificationUrl = $(element).find('a').attr('href');
        
        if (title && notificationUrl) {
          jobs.push({
            title,
            organization: 'Odisha Government',
            notificationUrl: this.resolveUrl(url, notificationUrl),
            category: this.categorizeJob(title),
            source: 'Odisha eDistrict'
          });
        }
      });
      
      return jobs;
    } catch (error) {
      logger.error(`Error parsing Odisha District: ${error.message}`);
      return [];
    }
  }

  /**
   * Process and save scraped job
   */
  async processScrapedJob(jobData) {
    try {
      // Check if job already exists
      const existingJob = await Job.findOne({
        title: jobData.title,
        organization: jobData.organization
      });
      
      if (existingJob) {
        logger.info(`Job already exists: ${jobData.title}`);
        return;
      }
      
      // Fetch full notification text from PDF or page
      let notificationText = await this.fetchNotificationText(jobData.notificationUrl);
      
      if (!notificationText || notificationText.length < 100) {
        logger.warn(`Insufficient notification text for: ${jobData.title}`);
        notificationText = `${jobData.title} - ${jobData.organization}. Please visit the official notification for complete details.`;
      }
      
      // Create job
      const job = await Job.create({
        ...jobData,
        notificationText,
        status: 'active',
        isVerified: false // Mark as unverified until admin reviews
      });
      
      logger.info(`Created new job: ${job.title}`);
      
      // Process with AI (async, don't wait)
      this.processJobWithAI(job._id).catch(err => {
        logger.error(`AI processing failed for ${job._id}: ${err.message}`);
      });
      
    } catch (error) {
      logger.error(`Error processing job ${jobData.title}: ${error.message}`);
    }
  }

  /**
   * Fetch notification text from URL
   */
  async fetchNotificationText(url) {
    try {
      if (url.endsWith('.pdf')) {
        // For PDF, you'd need PDF parsing library
        // For now, return basic info
        return 'Please check the official PDF notification for complete details.';
      }
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 15000
      });
      
      const $ = cheerio.load(response.data);
      
      // Remove scripts and styles
      $('script, style, nav, header, footer').remove();
      
      // Get main content
      const text = $('.content, .main-content, article, .notification-text')
        .text()
        .trim()
        .replace(/\s+/g, ' ');
      
      return text || $('body').text().trim().replace(/\s+/g, ' ');
      
    } catch (error) {
      logger.error(`Error fetching notification text: ${error.message}`);
      return '';
    }
  }

  /**
   * Process job with AI
   */
  async processJobWithAI(jobId) {
    try {
      const job = await Job.findById(jobId);
      if (!job) return;
      
      const aiSummary = await aiService.processJobNotification(job.notificationText);
      job.aiSummary = aiSummary;
      job.isAIProcessed = true;
      job.tags = aiService.generateTags(job.title, aiSummary);
      
      await job.save();
      
      logger.info(`AI processed job: ${job.title}`);
    } catch (error) {
      logger.error(`AI processing error: ${error.message}`);
    }
  }

  /**
   * Categorize job based on title
   */
  categorizeJob(title) {
    const titleLower = title.toLowerCase();
    
    if (titleLower.match(/engineer|technical|civil|mechanical|electrical/)) {
      return 'Engineering';
    } else if (titleLower.match(/teacher|lecturer|professor|education/)) {
      return 'Teaching';
    } else if (titleLower.match(/police|constable|si |inspector/)) {
      return 'Police';
    } else if (titleLower.match(/doctor|nurse|medical|health/)) {
      return 'Medical';
    } else if (titleLower.match(/clerk|assistant|officer|administrative/)) {
      return 'Administrative';
    } else if (titleLower.match(/railway|station master|ticket/)) {
      return 'Railway';
    } else if (titleLower.match(/bank|banking/)) {
      return 'Banking';
    }
    
    return 'Other';
  }

  /**
   * Resolve relative URL to absolute
   */
  resolveUrl(baseUrl, relativeUrl) {
    if (!relativeUrl) return null;
    
    if (relativeUrl.startsWith('http')) {
      return relativeUrl;
    }
    
    const base = new URL(baseUrl);
    return new URL(relativeUrl, base.origin).href;
  }

  /**
   * Manually trigger scraping
   */
  async scrapeNow() {
    logger.info('Manual scraping triggered');
    await this.scrapeAllSources();
  }

  /**
   * Test scraper on single URL
   */
  async testScraper(url, parserName = 'parseOPSC') {
    logger.info(`Testing scraper on: ${url}`);
    
    const parser = this[parserName];
    if (!parser) {
      throw new Error(`Parser ${parserName} not found`);
    }
    
    const jobs = await parser.call(this, url);
    logger.info(`Test found ${jobs.length} jobs`);
    
    return jobs;
  }
}

module.exports = new ScraperService();

/*
USAGE EXAMPLES:

1. In app.js - Start scheduler:
   const scraperService = require('./services/scraperService');
   scraperService.startScheduler();

2. Manual trigger via API endpoint:
   router.post('/admin/scrape', auth, async (req, res) => {
     await scraperService.scrapeNow();
     res.json({ message: 'Scraping started' });
   });

3. Test scraper:
   const jobs = await scraperService.testScraper('https://opsc.gov.in/...');
   console.log(jobs);

CUSTOMIZATION NOTES:

1. Update CSS selectors in parseOPSC() and parseOdishaDistrict() 
   based on actual website structure

2. Add more sources in constructor

3. Handle pagination if websites have multiple pages

4. Add PDF parsing using pdf-parse library:
   npm install pdf-parse
   
5. Add rate limiting between requests to avoid being blocked

6. Add retry logic for failed requests

7. Store scraping logs and statistics

8. Add duplicate detection based on notification numbers

9. Send notifications to admin when new jobs are found

10. Add monitoring for scraper health
*/
