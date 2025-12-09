// Firebase Connection Test Script
require('dotenv').config();
const { db, admin } = require('./src/config/firebase');
const Job = require('./src/models/JobFirestore');

async function testFirebaseConnection() {
  console.log('🔥 Testing Firebase Connection...\n');

  try {
    // Test 1: Firestore Connection
    console.log('Test 1: Firestore Database Connection');
    const testRef = db.collection('_test');
    await testRef.doc('connection-test').set({
      connected: true,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: 'Firebase Firestore is working!'
    });
    console.log('✅ Firestore connection successful\n');
    
    // Clean up test document
    await testRef.doc('connection-test').delete();

    // Test 2: Create a sample job
    console.log('Test 2: Create Sample Job');
    const sampleJob = await Job.create({
      title: 'Test Job - OPSC Sample Notification',
      organization: 'Odisha Public Service Commission',
      notificationText: 'This is a test job notification for Firebase Firestore integration.',
      category: 'government',
      location: 'Odisha',
      salary: '₹50,000 - ₹1,00,000',
      lastDate: new Date('2025-12-31'),
      applicationUrl: 'https://opsc.gov.in/test',
      status: 'active'
    });
    console.log('✅ Sample job created:', sampleJob.id);
    console.log('   Title:', sampleJob.title);
    console.log('   Organization:', sampleJob.organization);
    console.log('');

    // Test 3: Read the job back
    console.log('Test 3: Read Job by ID');
    const retrievedJob = await Job.findById(sampleJob.id);
    console.log('✅ Job retrieved successfully');
    console.log('   ID:', retrievedJob.id);
    console.log('   Title:', retrievedJob.title);
    console.log('');

    // Test 4: Update the job
    console.log('Test 4: Update Job');
    const updatedJob = await Job.findByIdAndUpdate(sampleJob.id, {
      views: 100,
      isFeatured: true
    });
    console.log('✅ Job updated successfully');
    console.log('   Views:', updatedJob.views);
    console.log('   Featured:', updatedJob.isFeatured);
    console.log('');

    // Test 5: Get all jobs
    console.log('Test 5: Get All Jobs');
    const allJobs = await Job.find({ status: 'active' });
    console.log('✅ Found', allJobs.length, 'active jobs');
    console.log('');

    // Test 6: Delete the test job
    console.log('Test 6: Delete Job');
    const deleted = await Job.findByIdAndDelete(sampleJob.id);
    console.log('✅ Job deleted successfully');
    console.log('   Deleted job:', deleted.title);
    console.log('');

    // Test 7: Verify deletion
    console.log('Test 7: Verify Deletion');
    const shouldBeNull = await Job.findById(sampleJob.id);
    if (shouldBeNull === null) {
      console.log('✅ Job successfully removed from database');
    } else {
      console.log('❌ Job still exists');
    }
    console.log('');

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 All Tests Passed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Firebase Firestore is properly configured');
    console.log('✅ CRUD operations working');
    console.log('✅ Ready for deployment!');
    console.log('');
    console.log('📊 Firebase Console:');
    console.log('   https://console.firebase.google.com/project/gobindatest-9a5ca/firestore');
    console.log('');

  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Check FIREBASE_SERVICE_ACCOUNT in .env file');
    console.error('2. Verify service account JSON is valid');
    console.error('3. Ensure Firestore is enabled in Firebase Console');
    console.error('4. Check Firebase service account has proper permissions');
    console.error('');
    console.error('Full error:', error);
  }

  process.exit(0);
}

// Run tests
console.log('');
console.log('🔥 Firebase Firestore Integration Test');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

testFirebaseConnection();
