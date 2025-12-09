// Firestore (Firebase Database) - No connection needed
// Firebase is initialized in config/firebase.js
const logger = require('../utils/logger');
const { db } = require('./firebase');

const connectDB = async () => {
  try {
    // Test Firestore connection
    const testRef = db.collection('_test');
    await testRef.doc('connection').set({
      connected: true,
      timestamp: new Date()
    });
    
    logger.info('✅ Firebase Firestore Connected Successfully');
    
    // Clean up test document
    await testRef.doc('connection').delete();
    
  } catch (error) {
    logger.error(`❌ Error connecting to Firestore: ${error.message}`);
    logger.warn('⚠️ Continuing without database connection - add FIREBASE_SERVICE_ACCOUNT to environment');
  }
};

module.exports = connectDB;
