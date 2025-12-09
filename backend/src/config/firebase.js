const admin = require('firebase-admin');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaQ01SM-tN4SnOae6MRxSUbBGWqjFNrAM",
  authDomain: "gobindatest-9a5ca.firebaseapp.com",
  projectId: "gobindatest-9a5ca",
  storageBucket: "gobindatest-9a5ca.firebasestorage.app",
  messagingSenderId: "775995487156",
  appId: "1:775995487156:web:2310f72f1fa9261d8ef8e1",
  measurementId: "G-4NER30J44G"
};

// Initialize Firebase Admin SDK
// For production, use service account credentials
let firebaseApp;

try {
  // Try to initialize with service account (production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: firebaseConfig.storageBucket
    });
  } else {
    // For development, initialize without credentials
    // Note: This will have limited functionality
    firebaseApp = admin.initializeApp({
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket
    });
  }
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error.message);
}

// Get Firebase services
const db = admin.firestore();
const storage = admin.storage();
const bucket = storage.bucket();

module.exports = {
  admin,
  db,
  storage,
  bucket,
  firebaseConfig
};
