const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * AI Service for processing job notifications
 * This service uses Google Gemini to extract structured information from job notifications
 */

class AIService {
  /**
   * Main function to process job notification text with AI
   * @param {string} notificationText - Raw job notification text
   * @returns {object} Structured AI summary
   */
  async processJobNotification(notificationText) {
    try {
      const prompt = this.buildPrompt(notificationText);
      
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.3,
          topK: 1,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        logger.error('Failed to extract JSON from Gemini response');
        throw new Error('Invalid AI response format');
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0]);

      logger.info('Gemini AI processing completed successfully');
      return this.formatAIResponse(parsedResponse);

    } catch (error) {
      logger.error(`Gemini AI processing error: ${error.message}`);
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }

  /**
   * Build detailed prompt for AI processing
   */
  buildPrompt(notificationText) {
    return `
Analyze the following Odisha government job notification and extract all relevant information. 
Return a JSON object with the following structure:

{
  "shortSummary": "A concise 2-3 sentence summary of the job opportunity",
  "importantPoints": {
    "eligibility": ["List of eligibility criteria"],
    "importantDates": {
      "applicationStart": "YYYY-MM-DD or null",
      "applicationEnd": "YYYY-MM-DD or null",
      "examDate": "YYYY-MM-DD or null",
      "resultDate": "YYYY-MM-DD or null"
    },
    "ageLimit": {
      "min": 18,
      "max": 35,
      "relaxation": "Age relaxation details for reserved categories"
    },
    "qualification": ["Educational qualifications required"],
    "vacancies": {
      "total": 100,
      "category": {
        "UR": 50,
        "OBC": 20,
        "SC": 15,
        "ST": 10,
        "EWS": 5
      }
    },
    "applicationFees": {
      "general": 500,
      "obc": 300,
      "scst": 0,
      "female": 0
    },
    "selectionProcess": ["Written Exam", "Interview", "Document Verification"],
    "salary": "Pay scale or salary range",
    "howToApply": "Brief steps to apply"
  }
}

Important Instructions:
1. Extract EXACT dates from the notification in YYYY-MM-DD format
2. If information is not available, use null or empty array
3. For vacancies, extract category-wise breakdown if available
4. Include salary/pay scale if mentioned
5. Be accurate with numbers (age limits, fees, vacancies)
6. Extract all important dates (application, exam, result)
7. List all eligibility criteria clearly
8. Make the summary crisp and informative

Job Notification Text:
${notificationText}
`;
  }

  /**
   * Format and validate AI response
   */
  formatAIResponse(aiResponse) {
    // Ensure all required fields exist with defaults
    return {
      shortSummary: aiResponse.shortSummary || 'Summary not available',
      importantPoints: {
        eligibility: aiResponse.importantPoints?.eligibility || [],
        importantDates: {
          applicationStart: this.parseDate(aiResponse.importantPoints?.importantDates?.applicationStart),
          applicationEnd: this.parseDate(aiResponse.importantPoints?.importantDates?.applicationEnd),
          examDate: this.parseDate(aiResponse.importantPoints?.importantDates?.examDate),
          resultDate: this.parseDate(aiResponse.importantPoints?.importantDates?.resultDate)
        },
        ageLimit: {
          min: aiResponse.importantPoints?.ageLimit?.min || null,
          max: aiResponse.importantPoints?.ageLimit?.max || null,
          relaxation: aiResponse.importantPoints?.ageLimit?.relaxation || ''
        },
        qualification: aiResponse.importantPoints?.qualification || [],
        vacancies: {
          total: aiResponse.importantPoints?.vacancies?.total || 0,
          category: {
            UR: aiResponse.importantPoints?.vacancies?.category?.UR || 0,
            OBC: aiResponse.importantPoints?.vacancies?.category?.OBC || 0,
            SC: aiResponse.importantPoints?.vacancies?.category?.SC || 0,
            ST: aiResponse.importantPoints?.vacancies?.category?.ST || 0,
            EWS: aiResponse.importantPoints?.vacancies?.category?.EWS || 0
          }
        },
        applicationFees: {
          general: aiResponse.importantPoints?.applicationFees?.general || null,
          obc: aiResponse.importantPoints?.applicationFees?.obc || null,
          scst: aiResponse.importantPoints?.applicationFees?.scst || 0,
          female: aiResponse.importantPoints?.applicationFees?.female || null
        },
        selectionProcess: aiResponse.importantPoints?.selectionProcess || [],
        salary: aiResponse.importantPoints?.salary || 'Not specified',
        howToApply: aiResponse.importantPoints?.howToApply || 'Check official notification'
      }
    };
  }

  /**
   * Parse date string to Date object
   */
  parseDate(dateString) {
    if (!dateString || dateString === 'null') return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  }

  /**
   * Generate relevant tags from job title and AI summary
   */
  generateTags(title, aiSummary) {
    const tags = [];
    
    // Add keywords from title
    const titleWords = title.toLowerCase().split(/\s+/);
    const relevantWords = titleWords.filter(word => 
      word.length > 3 && 
      !['the', 'and', 'for', 'with', 'from'].includes(word)
    );
    tags.push(...relevantWords);

    // Add category-based tags
    if (title.match(/engineer/i)) tags.push('engineering');
    if (title.match(/teacher|professor|lecturer/i)) tags.push('teaching');
    if (title.match(/police|constable/i)) tags.push('police');
    if (title.match(/doctor|nurse|medical/i)) tags.push('medical');
    if (title.match(/clerk|officer/i)) tags.push('clerical');

    // Add Odisha-specific tags
    tags.push('odisha', 'government-job', 'sarkari-naukri');

    // Remove duplicates and limit to 10 tags
    return [...new Set(tags)].slice(0, 10);
  }

  /**
   * Find YouTube videos using Gemini AI (No YouTube API needed!)
   * Gemini suggests relevant search terms and video topics
   */
  async findYouTubeResources(jobTitle, jobSummary) {
    try {
      const prompt = `
You are helping students prepare for the following government job exam in Odisha, India:

Job Title: ${jobTitle}
Job Summary: ${jobSummary || 'Government job opportunity in Odisha'}

Your task is to suggest 5-7 relevant YouTube search queries that students should use to find helpful preparation videos.

Consider:
1. Exam name and pattern
2. Syllabus topics
3. Previous year papers
4. Study tips and strategies
5. Subject-wise preparation (if applicable)
6. Odisha-specific content

Return ONLY a JSON array of search queries in this exact format:
{
  "searchQueries": [
    "OPSC exam preparation 2024",
    "Odisha government job syllabus",
    "Previous year question papers analysis"
  ],
  "examType": "Type of exam (e.g., OPSC, Police, Teacher, etc.)",
  "mainSubjects": ["Subject 1", "Subject 2", "Subject 3"]
}

Be specific to Odisha government exams. Include Hindi and English search terms if helpful.
`;

      const model = genAI.getGenerativeModel({ 
        model: 'gemini-pro',
        generationConfig: {
          temperature: 0.7,
          topK: 3,
          topP: 0.9,
          maxOutputTokens: 1024,
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        logger.warn('Could not extract YouTube resources from Gemini');
        return this.getDefaultYouTubeQueries(jobTitle);
      }
      
      const suggestedResources = JSON.parse(jsonMatch[0]);
      
      logger.info(`Generated ${suggestedResources.searchQueries?.length || 0} YouTube search queries using Gemini`);
      
      return {
        searchQueries: suggestedResources.searchQueries || this.getDefaultYouTubeQueries(jobTitle).searchQueries,
        examType: suggestedResources.examType || 'Government Job',
        mainSubjects: suggestedResources.mainSubjects || [],
        youtubeSearchLinks: (suggestedResources.searchQueries || []).map(query => ({
          query: query,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
        }))
      };

    } catch (error) {
      logger.error(`Error finding YouTube resources with Gemini: ${error.message}`);
      return this.getDefaultYouTubeQueries(jobTitle);
    }
  }

  /**
   * Fallback YouTube queries if Gemini fails
   */
  getDefaultYouTubeQueries(jobTitle) {
    const baseQueries = [
      `${jobTitle} preparation`,
      `${jobTitle} syllabus`,
      `${jobTitle} previous year papers`,
      'Odisha government job preparation',
      'OPSC exam tips'
    ];

    return {
      searchQueries: baseQueries,
      examType: 'Government Job',
      mainSubjects: [],
      youtubeSearchLinks: baseQueries.map(query => ({
        query: query,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      }))
    };
  }

}

module.exports = new AIService();
