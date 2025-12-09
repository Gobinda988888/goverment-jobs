const { bucket } = require('../config/firebase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class FirebaseService {
  /**
   * Upload file to Firebase Storage
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - Original file name
   * @param {string} mimeType - MIME type of file
   * @param {string} folder - Folder path in storage
   * @returns {Promise<string>} - Public URL of uploaded file
   */
  async uploadFile(fileBuffer, fileName, mimeType, folder = 'uploads') {
    try {
      // Generate unique filename
      const fileExtension = path.extname(fileName);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const filePath = `${folder}/${uniqueFileName}`;

      // Create file reference
      const file = bucket.file(filePath);

      // Upload file
      await file.save(fileBuffer, {
        metadata: {
          contentType: mimeType,
          metadata: {
            originalName: fileName,
            uploadedAt: new Date().toISOString()
          }
        },
        public: true, // Make file publicly accessible
        validation: 'md5'
      });

      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
      
      console.log(`✅ File uploaded successfully: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error('❌ Firebase upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Upload PDF file (specific for job notifications)
   * @param {Buffer} fileBuffer - PDF buffer
   * @param {string} fileName - Original file name
   * @returns {Promise<string>} - Public URL
   */
  async uploadPDF(fileBuffer, fileName) {
    return this.uploadFile(fileBuffer, fileName, 'application/pdf', 'pdfs');
  }

  /**
   * Upload image file
   * @param {Buffer} fileBuffer - Image buffer
   * @param {string} fileName - Original file name
   * @param {string} mimeType - Image MIME type
   * @returns {Promise<string>} - Public URL
   */
  async uploadImage(fileBuffer, fileName, mimeType) {
    return this.uploadFile(fileBuffer, fileName, mimeType, 'images');
  }

  /**
   * Delete file from Firebase Storage
   * @param {string} fileUrl - Public URL of file to delete
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFile(fileUrl) {
    try {
      // Extract file path from URL
      const urlParts = fileUrl.split(`${bucket.name}/`);
      if (urlParts.length < 2) {
        throw new Error('Invalid file URL');
      }

      const filePath = urlParts[1];
      const file = bucket.file(filePath);

      await file.delete();
      console.log(`✅ File deleted successfully: ${filePath}`);
      return true;
    } catch (error) {
      console.error('❌ Firebase delete error:', error);
      return false;
    }
  }

  /**
   * Get signed URL for private file access
   * @param {string} filePath - Path to file in storage
   * @param {number} expiresInMinutes - Expiration time in minutes
   * @returns {Promise<string>} - Signed URL
   */
  async getSignedUrl(filePath, expiresInMinutes = 60) {
    try {
      const file = bucket.file(filePath);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresInMinutes * 60 * 1000
      });

      return url;
    } catch (error) {
      console.error('❌ Firebase signed URL error:', error);
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }

  /**
   * List all files in a folder
   * @param {string} folder - Folder path
   * @returns {Promise<Array>} - List of files
   */
  async listFiles(folder = '') {
    try {
      const [files] = await bucket.getFiles({ prefix: folder });
      
      return files.map(file => ({
        name: file.name,
        url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
        size: file.metadata.size,
        contentType: file.metadata.contentType,
        created: file.metadata.timeCreated,
        updated: file.metadata.updated
      }));
    } catch (error) {
      console.error('❌ Firebase list files error:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }
}

module.exports = new FirebaseService();
