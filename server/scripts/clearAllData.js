const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const clearDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_placement_portal';
    console.log(`Connecting to MongoDB at: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully!');

    // 1. Delete all Applications
    try {
      const appRes = await mongoose.connection.collection('applications').deleteMany({});
      console.log(`Deleted ${appRes.deletedCount} applications.`);
    } catch (e) {
      console.log('Applications collection empty or not found');
    }

    // 2. Delete all Jobs / Drives
    try {
      const jobRes = await mongoose.connection.collection('jobs').deleteMany({});
      console.log(`Deleted ${jobRes.deletedCount} jobs/drives.`);
    } catch (e) {
      console.log('Jobs collection empty or not found');
    }

    // 3. Delete all Interviews
    try {
      const intRes = await mongoose.connection.collection('interviews').deleteMany({});
      console.log(`Deleted ${intRes.deletedCount} mock interviews.`);
    } catch (e) {
      console.log('Interviews collection empty or not found');
    }

    // 4. Delete all Resumes
    try {
      const resRes = await mongoose.connection.collection('resumes').deleteMany({});
      console.log(`Deleted ${resRes.deletedCount} resumes.`);
    } catch (e) {
      console.log('Resumes collection empty or not found');
    }

    // 5. Delete all Notifications
    try {
      const notifRes = await mongoose.connection.collection('notifications').deleteMany({});
      console.log(`Deleted ${notifRes.deletedCount} notifications.`);
    } catch (e) {
      console.log('Notifications collection empty or not found');
    }

    // 6. Reset all Users (Keep email, password, name, role, rollNumber, department; wipe all mock history)
    try {
      const userRes = await mongoose.connection.collection('users').updateMany(
        {},
        {
          $set: {
            skills: [],
            solvedQuestions: [],
            readinessScore: 0,
            placementStatus: 'Not Started',
            bio: '',
            github: '',
            linkedin: '',
            phone: '',
            backlogs: 0,
          },
        }
      );
      console.log(`Reset profile fields for ${userRes.modifiedCount} user accounts.`);
    } catch (e) {
      console.log('Users collection error:', e.message);
    }

    console.log('\n--- MongoDB Data Cleared Successfully! ---');
    console.log('Only user login credentials remain. All history, applications, drives, and rounds are 100% reset.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err);
    process.exit(1);
  }
};

clearDatabase();
