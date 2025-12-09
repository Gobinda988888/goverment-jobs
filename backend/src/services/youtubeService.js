const axios = require('axios');
const logger = require('../utils/logger');

/**
 * YouTube Service for fetching related exam preparation videos
 * Uses YouTube Data API v3
 */

class YouTubeService {
  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY;
    this.baseURL = 'https://www.googleapis.com/youtube/v3';
    this.maxResults = 10; // Number of videos to fetch
  }

  /**
   * Search YouTube videos based on query
   * @param {string} searchQuery - Search query string
   * @param {number} maxResults - Maximum number of results (default 10)
   * @returns {array} Array of video objects
   */
  async searchVideos(searchQuery, maxResults = this.maxResults) {
    try {
      if (!this.apiKey) {
        logger.warn('YouTube API key not configured');
        return [];
      }

      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          part: 'snippet',
          q: searchQuery,
          type: 'video',
          maxResults: maxResults,
          order: 'relevance', // Can be: date, rating, relevance, viewCount
          regionCode: 'IN',
          relevanceLanguage: 'en',
          safeSearch: 'strict',
          key: this.apiKey
        }
      });

      const videos = response.data.items || [];
      
      // Fetch additional statistics for videos
      const videoIds = videos.map(v => v.id.videoId).join(',');
      const videoStats = await this.getVideoStatistics(videoIds);

      // Combine search results with statistics
      const processedVideos = videos.map((video, index) => {
        const stats = videoStats[video.id.videoId] || {};
        
        return {
          videoId: video.id.videoId,
          title: video.snippet.title,
          channelName: video.snippet.channelTitle,
          thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
          publishedAt: new Date(video.snippet.publishedAt),
          viewCount: parseInt(stats.viewCount) || 0,
          likeCount: parseInt(stats.likeCount) || 0,
          commentCount: parseInt(stats.commentCount) || 0
        };
      });

      logger.info(`Fetched ${processedVideos.length} YouTube videos for query: ${searchQuery}`);
      return processedVideos;

    } catch (error) {
      logger.error(`YouTube API error: ${error.message}`);
      
      // Check for quota exceeded error
      if (error.response?.status === 403) {
        logger.error('YouTube API quota exceeded');
        throw new Error('YouTube API quota exceeded. Please try again later.');
      }
      
      throw new Error(`Failed to fetch YouTube videos: ${error.message}`);
    }
  }

  /**
   * Get video statistics (views, likes, comments)
   * @param {string} videoIds - Comma-separated video IDs
   * @returns {object} Object with video statistics
   */
  async getVideoStatistics(videoIds) {
    try {
      if (!videoIds) return {};

      const response = await axios.get(`${this.baseURL}/videos`, {
        params: {
          part: 'statistics',
          id: videoIds,
          key: this.apiKey
        }
      });

      const stats = {};
      response.data.items?.forEach(item => {
        stats[item.id] = item.statistics;
      });

      return stats;

    } catch (error) {
      logger.error(`Error fetching video statistics: ${error.message}`);
      return {};
    }
  }

  /**
   * Get trending exam preparation videos in Odisha
   * @returns {array} Array of trending video objects
   */
  async getTrendingExamVideos() {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          part: 'snippet',
          q: 'Odisha government job exam preparation',
          type: 'video',
          maxResults: 20,
          order: 'viewCount',
          publishedAfter: this.getDateDaysAgo(30), // Last 30 days
          regionCode: 'IN',
          key: this.apiKey
        }
      });

      const videos = response.data.items || [];
      
      return videos.map(video => ({
        videoId: video.id.videoId,
        title: video.snippet.title,
        channelName: video.snippet.channelTitle,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
        publishedAt: new Date(video.snippet.publishedAt)
      }));

    } catch (error) {
      logger.error(`Error fetching trending videos: ${error.message}`);
      return [];
    }
  }

  /**
   * Get channel information
   * @param {string} channelId - YouTube channel ID
   * @returns {object} Channel information
   */
  async getChannelInfo(channelId) {
    try {
      const response = await axios.get(`${this.baseURL}/channels`, {
        params: {
          part: 'snippet,statistics',
          id: channelId,
          key: this.apiKey
        }
      });

      const channel = response.data.items?.[0];
      if (!channel) return null;

      return {
        channelId: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.high.url,
        subscriberCount: parseInt(channel.statistics.subscriberCount),
        videoCount: parseInt(channel.statistics.videoCount)
      };

    } catch (error) {
      logger.error(`Error fetching channel info: ${error.message}`);
      return null;
    }
  }

  /**
   * Helper function to get ISO date string for days ago
   */
  getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  }

  /**
   * Validate YouTube API key
   * @returns {boolean} True if API key is valid
   */
  async validateApiKey() {
    try {
      await axios.get(`${this.baseURL}/search`, {
        params: {
          part: 'snippet',
          q: 'test',
          maxResults: 1,
          key: this.apiKey
        }
      });
      return true;
    } catch (error) {
      logger.error('YouTube API key validation failed');
      return false;
    }
  }
}

module.exports = new YouTubeService();
