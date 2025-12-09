const { OpenAI } = require('openai');
const logger = require('../utils/logger');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * AI Service for processing job notifications
 * This service uses GPT-4 to extract structured information from job notifications
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
      
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in analyzing Indian government job notifications, specifically for Odisha state. Extract all relevant information accurately and format it as JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent outputs
        response_format: { type: "json_object" }
      });

      const aiResponse = response.choices[0].message.content;
      const parsedResponse = JSON.parse(aiResponse);

      logger.info('AI processing completed successfully');
      return this.formatAIResponse(parsedResponse);

    } catch (error) {
      logger.error(`AI processing error: ${error.message}`);
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
   * Alternative: Process with Google Gemini
   * Uncomment if using Gemini instead of OpenAI
   */
  /*
  async processWithGemini(notificationText) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = this.buildPrompt(notificationText);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to extract JSON from Gemini response');
    
    const parsedResponse = JSON.parse(jsonMatch[0]);
    return this.formatAIResponse(parsedResponse);
  }
  */
}

module.exports = new AIService();
